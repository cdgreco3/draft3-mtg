"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import { Button, CircularProgress, Alert, ToggleButton, ToggleButtonGroup, Box, 
  Slider, Typography, Stack, Paper, Container, Grid, Card, CardContent } from "@mui/material";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create gothic theme
const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b0000', // Dark red
      light: '#a52a2a',
      dark: '#660000',
    },
    secondary: {
      main: '#2f4f4f', // Dark slate gray
      light: '#708090',
      dark: '#1c2e2e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Cinzel", "Gothic A1", "Arial", "Garamond", sans-serif,',
    h1: {
      fontFamily: 'Garamond',
      fontSize: '3.5rem',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Cinzel", serif',
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Cinzel", serif',
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Cinzel", serif',
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Gothic A1", sans-serif',
    },
    body2: {
      fontFamily: '"Gothic A1", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Cinzel", serif',
          padding: '8px 24px',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#8b0000',
        },
        thumb: {
          backgroundColor: '#8b0000',
          '&:hover': {
            backgroundColor: '#a52a2a',
          },
        },
        track: {
          backgroundColor: '#a52a2a',
        },
        rail: {
          backgroundColor: '#2f4f4f',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
          border: '1px solid #2f4f4f',
        },
      },
    },
  },
});

const VisuallyHiddenInput = styled("input")({
  display: "none",
});

const manaSymbols = [
  { symbol: "W", url: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/8e/W.svg" },
  { symbol: "U", url: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/9/9f/U.svg" },
  { symbol: "B", url: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/2/2f/B.svg" },
  { symbol: "R", url: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/87/R.svg" },
  { symbol: "G", url: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/88/G.svg" },
  { symbol: "C", url: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/1/1a/C.svg" },
];

export const StyledManaToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: "0.5rem",
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}, & .${toggleButtonGroupClasses.lastButton}`]: {
    borderRadius: theme.shape.borderRadius,
  },
}));

export const StyledManaToggleButton = styled(ToggleButton)(({ theme }) => ({
  background: "#2f4f4f",
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${theme.palette.divider}`,
  padding: "8px",
  minWidth: "48px",
  minHeight: "48px",
  color: theme.palette.text.primary,
  fontFamily: '"Cinzel", serif',
  fontWeight: 600,

  "&:hover": {
    border: `2px solid ${theme.palette.primary.light}`,
    backgroundColor: "#3a5f5f",
    transform: 'translateY(-1px)',
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `2px solid ${theme.palette.primary.light}`,
  },
  "&.Mui-selected:hover": {
    border: `2px solid ${theme.palette.primary.light}`,
    backgroundColor: theme.palette.primary.dark,
  },
}));

const GothicButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.dark} 90%)`,
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.text.primary,
  fontFamily: '"Cinzel", serif',
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '12px 32px',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.light} 30%, ${theme.palette.secondary.main} 90%)`,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(139, 0, 0, 0.3)',
  },
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
})) as typeof Button;

const PrimaryGothicButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  border: `2px solid ${theme.palette.primary.light}`,
  color: theme.palette.text.primary,
  fontFamily: '"Cinzel", serif',
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '12px 32px',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(139, 0, 0, 0.3)',
  },
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
})) as typeof Button;

function valuetext(value: number) {
  return `${value}`;
}

const marks = [
  { value: 0, label: '0' },
  { value: 5 },
  { value: 10 },
  { value: 15 },
  { value: 20, label: '20+' },
];

const draftMarks = [
  { value: 0, label: '0' },
  { value: 45, label: '45' },
  { value: 90, label: '90' },
  { value: 135, label: '135' },
  { value: 180, label: '180' },
  { value: 225, label: '225' },
  { value: 270, label: '270' },
  { value: 315, label: '315' },
  { value: 360, label: '360' },
];

export default function Home() {
  const [numCards, setNumCards] = React.useState(0);
  const [loading, setLoading] = React.useState(false); // Single loading state
  const [error, setError] = React.useState<string | null>(null);
  const [manaFilter, setManaFilter] = React.useState<string[]>([]);
  const [manaCostFilter, setManaCostFilter] = React.useState<number[]>([0, 20]);
  const [draftNumberFilter, setDraftNumberFilter] = React.useState<number>(90);
  const [draftedCsvUrl, setDraftedCsvUrl] = React.useState<string | null>(null);
  const [rarityPercentages, setRarityPercentages] = React.useState({
    mythic: 3,
    rare: 7,
    uncommon: 30,
    common: 60
  });
  const [draftedCards, setDraftedCards] = React.useState<any[]>([]);
  const [showDraftResults, setShowDraftResults] = React.useState(false);

  const fileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    console.log("Selected file:", file);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
          setNumCards(0);
        } else {
          setNumCards(result.rows || 0);
        }
      })
      .catch((err) => {
        console.error("Upload error:", err);
        setError("Failed to upload file. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleManaChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, newFilter: string[]) => {
    const filterValue = newFilter || [];
    setManaFilter(filterValue);
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/filter", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        mana: filterValue,
        cmc: manaCostFilter,
        draft: draftNumberFilter,
        rarity: rarityPercentages
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
          setNumCards(0);
        } else {
          setNumCards(result.rows || 0);
        }
      })
      .catch(() => setError("Failed to filter CSV"))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleManaCostChange = (event: Event, newValue: number[]) => {
    setManaCostFilter(newValue);
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/filter", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        mana: manaFilter || [],
        cmc: newValue,
        draft: draftNumberFilter,
        rarity: rarityPercentages
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
          setNumCards(0);
        } else {
          setNumCards(result.rows || 0);
        }
      })
      .catch(() => setError("Failed to filter CSV"))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDraftNumberChange = (event: Event, newValue: number | number[]) => {
    const singleValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setDraftNumberFilter(singleValue);
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/filter", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        mana: manaFilter || [],
        cmc: manaCostFilter,
        draft: singleValue,
        rarity: rarityPercentages
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
          setNumCards(0);
        } else {
          setNumCards(result.rows || 0);
        }
      })
      .catch(() => setError("Failed to filter CSV"))
      .finally(() => {
        setLoading(false);
      });
  };


  const adjustRarityPercentages = (changedRarity: string, newValue: number) => {
    const priorities = ['mythic', 'rare', 'uncommon', 'common'];
    
    const currentPercentages = { ...rarityPercentages };
    const oldValue = currentPercentages[changedRarity as keyof typeof currentPercentages];
    const difference = newValue - oldValue;
    
    currentPercentages[changedRarity as keyof typeof currentPercentages] = newValue;
    
    if (difference > 0) {
      // Increasing this rarity - decrease others starting from lowest priority
      let remainingDifference = difference;
      
      for (let i = priorities.length - 1; i >= 0 && remainingDifference > 0; i--) {
        if (priorities[i] === changedRarity) continue;
        
        const current = currentPercentages[priorities[i] as keyof typeof currentPercentages];
        const reduction = Math.min(remainingDifference, current);
        currentPercentages[priorities[i] as keyof typeof currentPercentages] = current - reduction;
        remainingDifference -= reduction;
      }
    } else if (difference < 0) {
      // Decreasing this rarity - increase others starting from lowest priority
      let remainingDifference = -difference;
      
      for (let i = priorities.length - 1; i >= 0 && remainingDifference > 0; i--) {
        if (priorities[i] === changedRarity) continue;
        
        const current = currentPercentages[priorities[i] as keyof typeof currentPercentages];
        const increase = remainingDifference
        currentPercentages[priorities[i] as keyof typeof currentPercentages] = current + increase;
        remainingDifference -= increase;
      }
    }
    
    return currentPercentages;
  };


  const getTotalPercentage = (percentages: typeof rarityPercentages, excludeRarity?: string) => {
    let total = 0;
    Object.entries(percentages).forEach(([rarity, value]) => {
      if (rarity !== excludeRarity) {
        total += value;
      }
    });
    return total;
  };

  const handleRarityChange = (rarity: string) => (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    const newPercentages = adjustRarityPercentages(rarity, value);
    
    // Ensure total is exactly 100
    const total = getTotalPercentage(newPercentages);
    if (total !== 100) {
      // Adjust the lowest priority (common) to make total 100
      const adjustment = 100 - total;
      newPercentages.common += adjustment;
    }
    
    setRarityPercentages(newPercentages);
  };


  const getCumulativeValues = () => { // In referral to the rarity distribution visualizer
    const values = {
      mythic: rarityPercentages.mythic,
      rare: rarityPercentages.mythic + rarityPercentages.rare,
      uncommon: rarityPercentages.mythic + rarityPercentages.rare + rarityPercentages.uncommon,
      common: 100 // Ensures there is never an open circle
    };
    return values;
  };

  const cumulativeValues = getCumulativeValues();

  const handleCloseDraftResults = () => {
    setShowDraftResults(false);
    setDraftedCards([]);
  };

  const handleDownloadCsv = () => {
    if (draftedCsvUrl) {
      const link = document.createElement('a');
      link.href = draftedCsvUrl;
      link.download = `drafted_cards_${draftNumberFilter}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Cleanup blob URL when component unmounts or new draft is created
  React.useEffect(() => {
    return () => {
      if (draftedCsvUrl) {
        window.URL.revokeObjectURL(draftedCsvUrl);
      }
    };
  }, [draftedCsvUrl]);

  const handleDraftCards = () => {
    if (numCards === 0) {
      setError("No cards available to draft");
      return;
    }

    if (draftNumberFilter > numCards) {
      setError(`Cannot draft ${draftNumberFilter} cards - only ${numCards} cards available`);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/draft", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        mana: manaFilter || [],
        cmc: manaCostFilter,
        draft: draftNumberFilter,
        rarity: rarityPercentages
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setDraftedCards(result.drafted_cards || []);
          setShowDraftResults(true);
          
          // Also generate CSV URL for download
          generateCsvUrl();
        }
      })
      .catch(() => setError("Failed to draft cards: Ensure rarity distribution is reasonable and draft pool is greater than draft size."))
      .finally(() => {
        setLoading(false);
      });
  };

  const generateCsvUrl = () => {
    fetch("http://localhost:5000/draft-csv", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        mana: manaFilter || [],
        cmc: manaCostFilter,
        draft: draftNumberFilter,
        rarity: rarityPercentages
      })
    })
      .then((res) => {
        if (res.ok) {
          return res.blob();
        } else {
          throw new Error('Failed to generate CSV');
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        setDraftedCsvUrl(url);
      })
      .catch(() => console.error("Failed to generate CSV"));
  };

  return (
    <ThemeProvider theme={gothicTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h1" component="h1" gutterBottom sx={{ 
            color: gothicTheme.palette.primary.main,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            mb: 2
          }}>
            Draft³ MTG
          </Typography>
          <Typography variant="h5" component="h2" sx={{ 
            color: gothicTheme.palette.text.secondary,
            fontStyle: 'italic',
            mb: 4
          }}>
            Welcome to Draft³ MTG. Upload a CSV export from ManaBox, Deckbox etc. to get started!
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <GothicButton 
                component="label" 
                variant="contained" 
                disabled={loading}
                fullWidth
              >
                Import CSV
                <VisuallyHiddenInput type="file" accept=".csv" onChange={fileHandler} />
              </GothicButton>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <PrimaryGothicButton 
                variant="contained" 
                disabled={loading || numCards === 0}
                onClick={handleDraftCards}
                fullWidth
              >
                {loading ? "Drafting..." : `Draft ${draftNumberFilter} Cards`}
              </PrimaryGothicButton>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <GothicButton 
                variant="outlined" 
                disabled={loading || numCards === 0}  // Enable when cards are available
                onClick={handleDownloadCsv}
                fullWidth
              >
                {loading ? "Generating CSV..." : "Download CSV"}
              </GothicButton>
            </Box>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              border: `1px solid ${gothicTheme.palette.error.main}`,
              backgroundColor: 'rgba(211, 47, 47, 0.1)'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Drafting Pool Counter with Loading */}
        <Card sx={{ mb: 6, textAlign: 'center', background: `linear-gradient(45deg, ${gothicTheme.palette.secondary.dark} 30%, ${gothicTheme.palette.secondary.main} 90%)`, position: 'relative' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative' }}>
              {loading && (
                <CircularProgress 
                  size={32} 
                  sx={{ 
                    color: gothicTheme.palette.primary.main,
                    position: 'absolute',
                    left: 20
                  }} 
                />
              )}
              <Typography variant="h2" component="h2" sx={{ color: gothicTheme.palette.text.primary }}>
                Drafting Pool: {numCards}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Left Column - Mana Filters */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                || Mana Colors ||
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}> {/* Reduced bottom margin */}
                <StyledManaToggleButtonGroup
                  value={manaFilter}
                  exclusive={false}
                  onChange={handleManaChange}
                  aria-label="Mana Color"
                >
                  {manaSymbols.map((mana) => (
                    <StyledManaToggleButton
                      key={mana.symbol}
                      value={mana.symbol}
                      aria-label={mana.symbol}
                    >
                      <img src={mana.url} alt={mana.symbol} style={{ width: "24px", height: "24px" }} />
                    </StyledManaToggleButton>
                  ))}
                </StyledManaToggleButtonGroup>
              </Box>
              
              {/* Instructional text */}
              <Typography 
                variant="caption" 
                sx={{ 
                  textAlign: 'center', 
                  color: gothicTheme.palette.text.secondary,
                  fontStyle: 'italic',
                  mb: 3,
                  display: 'block'
                }}
              >
                * Select all filters to remove basic lands
              </Typography>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                <Box>
                  <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
                    || Mana Cost ||
                  </Typography>
                  <Slider
                    value={manaCostFilter}
                    min={0}
                    max={20}
                    marks={marks}
                    onChange={handleManaCostChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                  />
                </Box>

                <Box>
                  <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
                    || Draft Size ||
                  </Typography>
                  <Slider
                    value={draftNumberFilter}
                    min={0}
                    max={360}
                    step={5}
                    marks={draftMarks}
                    onChange={handleDraftNumberChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Middle Column - Rarity Sliders */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                || Rarity Distribution ||
              </Typography>
              <Stack spacing={3} sx={{ flex: 1, justifyContent: 'space-around' }}>
                <Box>
                  <Typography variant="body1" gutterBottom sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600 }}>
                    Common: {rarityPercentages.common}%
                  </Typography>
                  <Slider
                    value={rarityPercentages.common}
                    min={0}
                    max={100}
                    step={1}
                    onChange={handleRarityChange('common')}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box>
                  <Typography variant="body1" gutterBottom sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600 }}>
                    Uncommon: {rarityPercentages.uncommon}%
                  </Typography>
                  <Slider
                    value={rarityPercentages.uncommon}
                    min={0}
                    max={100}
                    step={1}
                    onChange={handleRarityChange('uncommon')}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box>
                  <Typography variant="body1" gutterBottom sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600 }}>
                    Rare: {rarityPercentages.rare}%
                  </Typography>
                  <Slider
                    value={rarityPercentages.rare}
                    min={0}
                    max={100}
                    step={1}
                    onChange={handleRarityChange('rare')}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box>
                  <Typography variant="body1" gutterBottom sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600 }}>
                    Mythic: {rarityPercentages.mythic}%
                  </Typography>
                  <Slider
                    value={rarityPercentages.mythic}
                    min={0}
                    max={100}
                    step={1}
                    onChange={handleRarityChange('mythic')}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column - Circular Progress */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h4" component="h3" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                || Rarity Distribution Visualization ||
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: 200, height: 200, mb: 3 }}>
                  {/* Common (base layer) */}
                  <CircularProgress 
                    variant="determinate" 
                    value={100}
                    size={200}
                    thickness={4}
                    sx={{ 
                      position: 'absolute',
                      color: '#2f4f4f',
                    }}
                  />
                  
                  {/* Uncommon */}
                  <CircularProgress 
                    variant="determinate" 
                    value={cumulativeValues.uncommon}
                    size={200}
                    thickness={4}
                    sx={{ 
                      position: 'absolute',
                      color: '#6d6d6d',
                    }}
                  />
                  
                  {/* Rare */}
                  <CircularProgress 
                    variant="determinate" 
                    value={cumulativeValues.rare}
                    size={200}
                    thickness={4}
                    sx={{ 
                      position: 'absolute',
                      color: '#ffd700',
                    }}
                  />
                  
                  {/* Mythic */}
                  <CircularProgress 
                    variant="determinate" 
                    value={cumulativeValues.mythic}
                    size={200}
                    thickness={4}
                    sx={{ 
                      position: 'absolute',
                      color: '#8b0000',
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#2f4f4f', fontFamily: '"Cinzel", serif' }}>Common: {rarityPercentages.common}%</Typography>
                  <Typography sx={{ color: '#6d6d6d', fontFamily: '"Cinzel", serif' }}>Uncommon: {rarityPercentages.uncommon}%</Typography>
                  <Typography sx={{ color: '#ffd700', fontFamily: '"Cinzel", serif' }}>Rare: {rarityPercentages.rare}%</Typography>
                  <Typography sx={{ color: '#8b0000', fontFamily: '"Cinzel", serif' }}>Mythic: {rarityPercentages.mythic}%</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Scryfall recognition */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: gothicTheme.palette.text.secondary,
              fontStyle: 'italic',
            }}
          >
            Card images provided by Scryfall
          </Typography>
        </Box>
      </Container>

    {/* Draft Results Modal */}
    {showDraftResults && (
      <Paper 
        sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 1300, 
          p: 4, 
          overflow: 'auto',
          backgroundColor: 'rgba(0,0,0,0.9)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" component="h2" sx={{ color: 'white' }}>
            Draft Results - {draftedCards.length} Cards
          </Typography>
          <GothicButton 
            variant="outlined" 
            onClick={handleCloseDraftResults}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Close
          </GothicButton>
        </Box>

        <Grid container spacing={2}>
          {draftedCards.map((card, index) => (
            <Grid key={index} size={{ xs: 7.5, sm: 3.75, md: 2.5, lg: 1.5 }}> {/* 60, 30, 20, 12 are base */}
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: 'transparent',
                border: '1px solid #2f4f4f'
              }}>
                {card.image_url ? (
                  <Box
                    component="img"
                    src={card.image_url}
                    alt={card.name}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {card.name || card.Name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {card.type_line || 'No image available'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#8b0000', mt: 1 }}>
                      {card.rarity ? card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1) : ''}
                    </Typography>
                  </CardContent>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    )}
    </ThemeProvider>
  );
}