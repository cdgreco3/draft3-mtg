from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import pandas as pd
import json
import random
import requests
import os

app = Flask(__name__)
CORS(app)


def load_bulk_data():
    bulk_file = "default-cards.json"
    if not os.path.exists(bulk_file):
        print("Downloading Scryfall bulk data...")
        bulk_data_url = "https://api.scryfall.com/bulk-data"
        response = requests.get(bulk_data_url)
        bulk_data = response.json()
        
        default_cards_url = None
        for item in bulk_data['data']:
            if item['type'] == 'default_cards':
                default_cards_url = item['download_uri']
                break
        
        if default_cards_url:
            print(f"Downloading from {default_cards_url}")
            response = requests.get(default_cards_url)
            with open(bulk_file, 'w', encoding='utf-8') as f:
                json.dump(response.json(), f, ensure_ascii=False, indent=2)
    
    with open(bulk_file, 'r', encoding='utf-8') as f:
        return json.load(f)

bulk_cards = load_bulk_data()

bulk_index = {card["name"].lower(): card for card in bulk_cards}


stored_df = None


EXCLUDED_LAYOUTS = {
    "planar", "scheme", "vanguard", "token", "emblem", "double_faced_token",
    "art_series", "adventure", "augment", "split", "flip", "class"
}

RARITY_CATEGORIES = ['mythic', 'rare', 'uncommon', 'common']
MANA_SYMBOLS = {'W', 'U', 'B', 'R', 'G', 'C'}


def get_card_data(card_name):
    return bulk_index.get(card_name.lower())


def should_exclude_card(card_data):
    layout = card_data.get("layout", "")
    return layout in EXCLUDED_LAYOUTS


def get_card_colors_and_cmc(card_data):
    layout = card_data.get("layout", "")
    
    if layout == "transform" and "card_faces" in card_data:
        front_face = card_data["card_faces"][0]
        colors = set(front_face.get("colors", []))
        cmc = front_face.get("cmc", card_data.get("cmc", 0))
    else:
        colors = set(card_data.get("colors", []))
        cmc = card_data.get("cmc", 0)
    
    return colors, cmc


def get_card_mana_production(card_data):
    mana_production = set()
    
    produced_mana = card_data.get("produced_mana", [])
    if produced_mana:
        mana_production.update(produced_mana)

    oracle_text = card_data.get("oracle_text", "").upper()
    type_line = card_data.get("type_line", "").upper()

    if "LAND" in type_line and "BASIC" not in type_line:
        if "ADD" in oracle_text or "{T}" in oracle_text:
            import re
            mana_symbols = re.findall(r'\{([WUBRGC])\}', oracle_text)
            mana_production.update(mana_symbols)
    
    return mana_production


def passes_color_filter(colors, type_line, mana_production, mana_filter):
    if not mana_filter:
        return True
    
    mana_filter_set = set(mana_filter)
    type_line_upper = type_line.upper()

    # Colorless non-lands are included (artifacts, colorless creatures)
    if not colors and "LAND" not in type_line_upper:
        return True
    
    is_land = "LAND" in type_line_upper
    is_basic_land = "BASIC" in type_line_upper
    
    # Non-basic lands
    if is_land and not is_basic_land:
        # Check if mana production matches filter
        if mana_production & mana_filter_set:
            return True
        # Utility lands
        if not mana_production:
            return True
        return False
        
    # Colored cards
    if colors and colors & mana_filter_set:
        return True
    
    return False


def passes_cmc_filter(cmc, cmc_filter):
    if not cmc_filter or not isinstance(cmc_filter, list) or len(cmc_filter) != 2:
        return True
    
    min_cmc, max_cmc = cmc_filter
    try:
        cmc_val = float(cmc)
        min_cmc_val = float(min_cmc)
        max_cmc_val = float(max_cmc)
    except (ValueError, TypeError):
        # Allow cards with mana cost "X" to pass
        return True
    
    if max_cmc_val >= 20:
        return cmc_val >= min_cmc_val
    else:
        return min_cmc_val <= cmc_val <= max_cmc_val


def get_filtered_cards(mana_filter=None, cmc_filter=None):
    global stored_df
    if stored_df is None:
        return []
    
    cards_list = stored_df.to_dict(orient='records')
    
    filtered_cards = []
    
    for row in cards_list:
        card_name = str(row.get("Name", ""))
        card_data = get_card_data(card_name)
        
        if not card_data or should_exclude_card(card_data):
            continue
        
        colors, cmc = get_card_colors_and_cmc(card_data)
        type_line = card_data.get("type_line", "")
        mana_production = get_card_mana_production(card_data)
        
        # Color filter
        if not passes_color_filter(colors, type_line, mana_production, mana_filter):
            continue
        
        # CMC filter
        if not passes_cmc_filter(cmc, cmc_filter):
            continue

        filtered_cards.append(row)
    return filtered_cards


def categorize_cards_by_rarity(cards):
    cards_by_rarity = {rarity: [] for rarity in RARITY_CATEGORIES}
    
    for card in cards:
        card_name = str(card.get("Name", ""))
        card_data = get_card_data(card_name)
        rarity = card_data.get("rarity", "common").lower() if card_data else "common"
        
        if rarity in cards_by_rarity:
            cards_by_rarity[rarity].append(card)
        else:
             cards_by_rarity['common'].append(card) # Default to common for unknown rarities
    
    return cards_by_rarity


def validate_rarity_distribution(cards_by_rarity, rarity_percentages, draft_count):
    validation = {
        'is_valid': True,
        'warnings': [],
        'max_possible_cards': draft_count
    }
    
    # Calculate how many cards we need for each rarity
    required_counts = {}
    total_requested_percentage = sum(rarity_percentages.values())
    if total_requested_percentage != 100:
        validation['is_valid'] = False
        validation['warnings'].append(f"Rarity percentages must sum to 100, currently {total_requested_percentage}")
        return validation
        
    
    for rarity in RARITY_CATEGORIES:
        percentage = rarity_percentages.get(rarity, 0)
        # Round up to 1
        required_counts[rarity] = int(draft_count * (percentage / 100.0))
        if percentage > 0 and required_counts[rarity] == 0:
            required_counts[rarity] = 1

    
    # Check if there's enough cards for each rarity
    max_multiplier = float('inf')
    
    for rarity in RARITY_CATEGORIES:
        required_percentage = rarity_percentages.get(rarity, 0)
        available_count = len(cards_by_rarity[rarity])
        required_count = required_counts.get(rarity, 0)

        # Compare available vs. required
        if available_count < required_count:
            validation['is_valid'] = False
            validation['warnings'].append(
                f"Not enough {rarity} cards: need at least {required_count}, only {available_count} available."
            )

        # Calculate the maximum draft size
        if required_percentage > 0:
            multiplier = available_count / (required_percentage / 100.0)
            max_multiplier = min(max_multiplier, multiplier)

    max_possible_cards = int(max_multiplier)
    validation['max_possible_cards'] = max_possible_cards
    
    if max_possible_cards < draft_count:
        validation['is_valid'] = False
        validation['warnings'].append(
             f"The draft size of {draft_count} is impossible with the current card pool and rarity distribution. The maximum possible draft size is {max_possible_cards}."
        )

    return validation


def apply_rarity_filter(cards, rarity_percentages, draft_count):
    if not cards:
        return [], {'is_valid': False, 'warnings': ['No cards available in filtered pool'], 'max_possible_cards': 0}
    
    print(f"Applying rarity percentages: {rarity_percentages} for {draft_count} cards")
    
    cards_by_rarity = categorize_cards_by_rarity(cards)
    
    validation = validate_rarity_distribution(cards_by_rarity, rarity_percentages, draft_count)
    
    if not validation['is_valid']:
        return [], validation
    
    final_cards = []
    
    total_selected_count = 0
    num_to_select = min(draft_count, validation['max_possible_cards'])
    
    required_counts = {}
    for rarity in RARITY_CATEGORIES:
        percentage = rarity_percentages.get(rarity, 0)
        required_counts[rarity] = int(num_to_select * (percentage / 100.0))
        if percentage > 0 and required_counts[rarity] == 0:
             required_counts[rarity] = 1 # Ensure at least 1

    current_sum = sum(required_counts.values())
    
    # Give any remaining slots to Common
    if current_sum < num_to_select:
        required_counts['common'] += (num_to_select - current_sum)

    for rarity in RARITY_CATEGORIES:
        required_count = required_counts[rarity]
        available_cards = cards_by_rarity[rarity]
        
        count_to_take = min(required_count, len(available_cards)) 
        
        random.shuffle(available_cards) 
        final_cards.extend(available_cards[:count_to_take])
    
    # Ensure the final list matches the requested size for drafting
    if len(final_cards) < num_to_select:
         validation['is_valid'] = False
         validation['warnings'].append(f"Internal error: could only select {len(final_cards)} cards, expected {num_to_select}.")
         return [], validation
         
    return final_cards, validation


def enhance_card_data(card_row):
    card_name = str(card_row.get("Name", ""))
    card_data = get_card_data(card_name)
    
    if not card_data:
        return card_row
    
    colors, cmc = get_card_colors_and_cmc(card_data)
    mana_production = get_card_mana_production(card_data)
    
    enhanced_data = card_row
    enhanced_data.update({
        "colors": list(colors),
        "type_line": card_data.get("type_line", ""),
        "oracle_text": card_data.get("oracle_text"),
        "cmc": cmc,
        "mana_production": list(mana_production),
        "image": card_data.get("image_uris", {}).get("normal"),
        "rarity": card_data.get("rarity", "common") # Add rarity for inspection
    })
    
    return enhanced_data


@app.route("/")
def home():
    return jsonify({"message": "MTG Draft Simulator API"}), 200


@app.route("/upload", methods=["POST"])
def upload():
    global stored_df
    
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith(".csv"):
        return jsonify({"error": "File is not a CSV"}), 400

    try:
        df = pd.read_csv(file).fillna("") # Preserves json formatting
        
        required_columns = {"Name"}
        if not required_columns.issubset(df.columns):
            return jsonify({"error": "Invalid CSV format"}), 400
        
        missing_cards = []
        for name in df['Name']:
            if not get_card_data(str(name)):
                missing_cards.append(name)

        if missing_cards:
             return jsonify({"error": f"Missing card data for: {', '.join(missing_cards[:5])}..."}), 400

        df = df.sort_values(by="Name")
        stored_df = df
        
        initial_filtered_cards = get_filtered_cards()
        
        data = [enhance_card_data(card) for card in initial_filtered_cards]
        
        return jsonify({
            "columns": df.columns.tolist(),
            "data": data,
            "rows": len(data)
        })
        
    except Exception as e:
        return jsonify({"error": f"Error processing CSV: {str(e)}"}), 400


@app.route("/filter", methods=["POST"])
def filter_csv():
    if stored_df is None:
        return jsonify({"error": "No CSV uploaded"}), 400
    
    request_data = request.get_json() or {}
    mana_filter = request_data.get("mana", [])
    cmc_filter = request_data.get("cmc", None)
    draft_count = request_data.get("draft", 90)
    rarity_percentages = request_data.get("rarity", {})
    
    # Get filtered cards after mana and CMC filters
    filtered_cards = get_filtered_cards(mana_filter, cmc_filter)
    print(f"After mana/CMC filters: {len(filtered_cards)} cards")

    _, validation = apply_rarity_filter(filtered_cards, rarity_percentages, draft_count)
    enhanced_data = [enhance_card_data(card) for card in filtered_cards]
    columns = list(enhanced_data[0].keys()) if enhanced_data else []

    return jsonify({
        "columns": columns,
        "data": enhanced_data,
        "rows": len(enhanced_data),
        "validation": validation
    })


@app.route("/draft", methods=["POST"])
def draft_cards():
    if stored_df is None:
        return jsonify({"error": "No CSV uploaded"}), 400
    
    request_data = request.get_json() or {}
    mana_filter = request_data.get("mana", [])
    cmc_filter = request_data.get("cmc", None)
    draft_count = request_data.get("draft", 90)
    rarity_percentages = request_data.get("rarity", {})
    
    # Get filtered cards with mana/CMC applied
    filtered_cards = get_filtered_cards(mana_filter, cmc_filter)
    
    # Apply rarity filter and select the actual drafted cards
    final_cards, validation = apply_rarity_filter(filtered_cards, rarity_percentages, draft_count)
    
    if not validation['is_valid']:
        return jsonify({
            "error": "Cannot draft with current settings",
            "validation": validation
        }), 400
    
    if not final_cards:
        return jsonify({"error": "No cards available to draft"}), 400
    
    # Enhance the drafted cards with image data
    drafted_cards_with_images = []
    for card in final_cards:
        card_name = str(card.get("Name", ""))
        scryfall_id = card.get("scryfall_id") or card.get("scryfall_Id") or card.get("Scryfall ID")
        card_data = get_card_data(card_name)
        
        drafted_card = card.copy() if isinstance(card, dict) else card.to_dict()

        image_url = None
        
        # Use scryfall_id if available in CSV
        if scryfall_id:
            for bulk_card in bulk_cards:
                if bulk_card.get("id") == scryfall_id:
                    # Check Language
                    if bulk_card.get("lang") == "en":
                        image_url = bulk_card.get("image_uris", {}).get("normal")
                        if image_url:
                            break
                    elif not image_url and bulk_card.get("image_uris", {}).get("normal"):
                        image_url = bulk_card.get("image_uris", {}).get("normal")
        # Use name
        if not image_url and card_data:
            english_card = None
            for bulk_card in bulk_cards:
                if (bulk_card.get("name", "").lower() == card_name.lower() and 
                    bulk_card.get("lang") == "en"):
                    english_card = bulk_card
                    break
            
            if english_card:
                image_url = english_card.get("image_uris", {}).get("normal")
                if not image_url and english_card.get("card_faces"):
                    image_url = english_card["card_faces"][0].get("image_uris", {}).get("normal")
            
            # Other language (English card doesn't exist)
            if not image_url and card_data.get("image_uris"):
                image_url = card_data.get("image_uris", {}).get("normal")
            if not image_url and card_data.get("card_faces"):
                image_url = card_data["card_faces"][0].get("image_uris", {}).get("normal")
        
        # Try to construct URL
        if not image_url:
            import urllib.parse
            encoded_name = urllib.parse.quote(card_name)
            image_url = f"https://api.scryfall.com/cards/named?format=image&exact={encoded_name}"
        
        drafted_card.update({
            "image_url": image_url,
            "name": card_data.get("name", card_name) if card_data else card_name,
            "mana_cost": card_data.get("mana_cost", "") if card_data else "",
            "type_line": card_data.get("type_line", "") if card_data else "",
            "oracle_text": card_data.get("oracle_text", "") if card_data else "",
            "rarity": card_data.get("rarity", "") if card_data else "",
            "colors": card_data.get("colors", []) if card_data else [],
            "scryfall_id": scryfall_id
        })
        
        drafted_cards_with_images.append(drafted_card)
    
    return jsonify({
        "drafted_cards": drafted_cards_with_images,
        "total_cards": len(drafted_cards_with_images)
    })


@app.route("/draft-csv", methods=["POST"])
def draft_cards_csv():
    if stored_df is None:
        return jsonify({"error": "No CSV uploaded"}), 400
    
    request_data = request.get_json() or {}
    mana_filter = request_data.get("mana", [])
    cmc_filter = request_data.get("cmc", None)
    draft_count = request_data.get("draft", 90)
    rarity_percentages = request_data.get("rarity", {})
    
    # Get filtered cards with rarity applied
    filtered_cards = get_filtered_cards(mana_filter, cmc_filter)
    final_cards, validation = apply_rarity_filter(filtered_cards, rarity_percentages, draft_count)
    
    if not validation['is_valid'] or not final_cards:
        return jsonify({"error": "Cannot draft with current settings"}), 400
    
    # Create CSV response
    drafted_df = pd.DataFrame(final_cards)
    csv_output = drafted_df.to_csv(index=False)
    
    response = make_response(csv_output)
    response.headers["Content-Disposition"] = f"attachment; filename=drafted_cards_{len(final_cards)}.csv"
    response.headers["Content-Type"] = "text/csv"
    
    return response


if __name__ == "__main__":
    app.run(port=5000, debug=True)