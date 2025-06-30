import React, { useState, useCallback } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Paper,
  Alert,
  Fade,
  Zoom,
  Container,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  Search,
  Person,
  SearchOff,
  Clear,
  AutoAwesome,
  TrendingUp,
  FilterList,
  CheckCircle,
  Visibility,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Internal imports
import { API_CONFIG } from "../theme/constants";

// Dark theme color palette for the entire application
const AppColors = {
  primary: {
    main: "#3b82f6", // Bright blue for dark theme
    dark: "#1d4ed8", // Darker blue
    light: "#60a5fa", // Lighter blue
    contrast: "#ffffff", // White text on blue
  },
  secondary: {
    main: "#ef4444", // Bright red accent
    dark: "#dc2626", // Darker red
    light: "#f87171", // Lighter red
    contrast: "#ffffff", // White text on red
  },
  success: {
    main: "#10b981", // Bright green
    light: "#34d399",
    contrast: "#ffffff",
  },
  background: {
    default: "#0f172a", // Very dark blue-gray (light black)
    paper: "#1e293b", // Dark gray for cards
    elevated: "#334155", // Lighter gray for elevated cards
  },
  text: {
    primary: "#f8fafc", // Very light gray for primary text
    secondary: "#cbd5e1", // Light gray for secondary text
    disabled: "#64748b", // Medium gray for disabled text
  },
  border: {
    light: "#334155", // Light border for dark theme
    main: "#475569", // Main border
    dark: "#64748b", // Dark border
  },
};

// Styled components with dark theme colors and better contrast
const HeroSection = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${AppColors.primary.main} 0%, ${AppColors.primary.dark} 100%)`,
  color: AppColors.primary.contrast,
  padding: theme.spacing(6, 4),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
  position: "relative",
  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  backgroundColor: AppColors.background.paper,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
  border: `2px solid ${AppColors.border.light}`,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: AppColors.primary.light,
    boxShadow: "0 6px 25px rgba(59, 130, 246, 0.2)",
  },
  "&:focus-within": {
    borderColor: AppColors.primary.main,
    boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.2)`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "1.1rem",
    color: AppColors.text.primary,
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(2),
    color: AppColors.text.primary,
    "&::placeholder": {
      color: AppColors.text.secondary,
      opacity: 1,
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  minWidth: 130,
  height: 50,
  borderRadius: theme.spacing(2.5),
  fontSize: "1rem",
  fontWeight: 600,
  backgroundColor: AppColors.primary.main,
  color: AppColors.primary.contrast,
  textTransform: "none",
  boxShadow: `0 4px 16px rgba(59, 130, 246, 0.3)`,
  transition: "all 0.2s ease",
  cursor: "pointer !important",
  "&:hover": {
    backgroundColor: AppColors.primary.dark,
    boxShadow: `0 6px 20px rgba(59, 130, 246, 0.4)`,
    transform: "translateY(-1px)",
    cursor: "pointer !important",
  },
  "&:disabled": {
    backgroundColor: AppColors.text.disabled,
    color: AppColors.background.paper,
    transform: "none",
    boxShadow: "none",
    cursor: "not-allowed !important",
  },
}));

const MatchScoreChip = styled(Chip)(({ theme }) => ({
  backgroundColor: AppColors.success.main,
  color: AppColors.success.contrast,
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 28,
  "& .MuiChip-label": {
    padding: theme.spacing(0, 1.5),
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${AppColors.secondary.light}`,
  backgroundColor: "#7f1d1d",
  color: AppColors.secondary.light,
  "& .MuiAlert-icon": {
    color: AppColors.secondary.main,
  },
}));

// Types for search results
interface RawChunkResult {
  chunk_index: number;
  id: string;
  score: number;
  source_file: string;
  text: string;
}

interface SearchApiResponse {
  answer: string;
  results: RawChunkResult[];
}

interface CandidateResult {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  matchScore?: number;
  filename?: string;
  rawText?: string;
  highlights?: string[];
}

// Props interface
interface ResumeSearchProps {
  onSearchResults: (results: CandidateResult[]) => void;
}

// Skeleton Loading Component
const SearchResultSkeleton = () => (
  <Card
    sx={{
      borderRadius: 2,
      border: `1px solid ${AppColors.border.light}`,
      backgroundColor: AppColors.background.paper,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      {/* Header skeleton */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width="60%" height={28} />
      </Box>

      {/* Highlights skeleton */}
      <Box sx={{ mb: 3 }}>
        {[1, 2, 3].map((index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              sx={{ mt: 0.2 }}
            />
            <Skeleton
              variant="text"
              width={`${Math.random() * 40 + 60}%`}
              height={20}
            />
          </Box>
        ))}
      </Box>

      {/* Button skeleton */}
      <Skeleton variant="rounded" width={140} height={40} />
    </CardContent>
  </Card>
);

const ResumeSearch = ({ onSearchResults }: ResumeSearchProps) => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CandidateResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to extract meaningful highlights from resume text
  const extractHighlights = (text: string): string[] => {
    const highlights: string[] = [];
    const lines = text.split("\n").filter((line) => line.trim());

    // Look for lines that start with bullets, dashes, or are in bullet point format
    const bulletPatterns = [
      /^[-•·*]\s*(.+)/, // Lines starting with bullet points
      /^-\s*(.+)/, // Lines starting with dashes
      /^(.+using\s+.+)/i, // Lines mentioning "using" (technical implementations)
      /^(.+developed?\s+.+)/i, // Lines mentioning development
      /^(.+implemented?\s+.+)/i, // Lines mentioning implementation
      /^(.+built?\s+.+)/i, // Lines mentioning building
      /^(.+created?\s+.+)/i, // Lines mentioning creation
    ];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 20 && trimmedLine.length < 200) {
        for (const pattern of bulletPatterns) {
          const match = trimmedLine.match(pattern);
          if (match) {
            const highlight = match[1] || match[0];
            if (highlight && !highlights.includes(highlight)) {
              highlights.push(highlight);
              break; // Only match one pattern per line
            }
          }
        }
      }
    }

    // If no bullet points found, extract meaningful sentences
    if (highlights.length === 0) {
      const sentences = text
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 30);
      for (const sentence of sentences.slice(0, 3)) {
        const cleanSentence = sentence.trim();
        if (cleanSentence.length > 20 && cleanSentence.length < 150) {
          highlights.push(cleanSentence);
        }
      }
    }

    return highlights.slice(0, 3); // Return max 3 highlights
  };

  // Helper function to parse candidate information from raw text
  const parseCandidateFromText = (chunk: RawChunkResult): CandidateResult => {
    const text = chunk.text;

    // Extract email using regex
    const emailMatch = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    );
    const email = emailMatch ? emailMatch[0] : undefined;

    // Extract phone using regex (various formats)
    const phoneMatch = text.match(
      /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}|\+?[0-9]{10,15}/
    );
    const phone = phoneMatch ? phoneMatch[0] : undefined;

    // Extract location (look for city, state patterns)
    const locationMatch = text.match(
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z]{2}|[A-Z][a-z]+)/
    );
    const location = locationMatch
      ? `${locationMatch[1]}, ${locationMatch[2]}`
      : undefined;

    // Extract name (usually appears at the beginning or after contact info)
    const lines = text.split("\n").filter((line) => line.trim());
    let name = "Unknown Candidate";

    // Look for name patterns - typically first line or after contact info
    for (const line of lines.slice(0, 5)) {
      const trimmedLine = line.trim();
      // Skip lines with common resume sections
      if (
        trimmedLine &&
        !trimmedLine.includes("@") &&
        !trimmedLine.match(/^\d/) &&
        !trimmedLine.toUpperCase().includes("EDUCATION") &&
        !trimmedLine.toUpperCase().includes("EXPERIENCE") &&
        !trimmedLine.toUpperCase().includes("SKILLS") &&
        !trimmedLine.includes("linkedin") &&
        trimmedLine.length > 3 &&
        trimmedLine.length < 50
      ) {
        // Check if it looks like a name (contains letters and possibly spaces)
        if (/^[a-zA-Z\s.]+$/.test(trimmedLine)) {
          name = trimmedLine;
          break;
        }
      }
    }

    // Extract skills - look for common tech skills
    const skillsText = text.toLowerCase();
    const commonSkills = [
      "react",
      "javascript",
      "python",
      "java",
      "node",
      "nodejs",
      "angular",
      "vue",
      "typescript",
      "html",
      "css",
      "sql",
      "mongodb",
      "postgresql",
      "mysql",
      "aws",
      "docker",
      "kubernetes",
      "git",
      "linux",
      "tensorflow",
      "pytorch",
      "machine learning",
      "data science",
      "artificial intelligence",
      "ai",
      "streamlit",
      "flask",
      "django",
      "express",
      "spring",
      "bootstrap",
      "tailwind",
      "sass",
      "graphql",
      "rest api",
      "microservices",
      "devops",
      "ci/cd",
      "jenkins",
      "github",
      "gitlab",
      "figma",
      "photoshop",
    ];

    const foundSkills = commonSkills.filter((skill) =>
      skillsText.includes(skill.toLowerCase())
    );

    // Extract current role/position
    const roleKeywords = [
      "developer",
      "engineer",
      "manager",
      "analyst",
      "scientist",
      "architect",
      "consultant",
    ];
    let currentRole = undefined;

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (roleKeywords.some((keyword) => lowerLine.includes(keyword))) {
        currentRole = line.trim();
        break;
      }
    }

    // Use the original source_file name as stored on the server
    // Don't modify the filename as it needs to match the server's file storage
    const filename = chunk.source_file;

    // Extract highlights
    const highlights = extractHighlights(text);

    return {
      id: chunk.id,
      name,
      email,
      phone,
      location,
      currentRole,
      skills: foundSkills.length > 0 ? foundSkills : undefined,
      matchScore: chunk.score ? Math.min(chunk.score / 2, 1) : undefined, // Normalize score
      filename,
      rawText: text,
      highlights,
    };
  };

  // API search handler with POST method
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/search_api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
          limit: 50,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Search failed: ${response.status} ${response.statusText}`
        );
      }

      const data: SearchApiResponse = await response.json();

      // Check if the answer contains "sorry" which indicates no matches
      if (data.answer && data.answer.toLowerCase().includes("sorry")) {
        setSearchResults([]);
        onSearchResults([]);
      } else if (data.results && data.results.length > 0) {
        // Parse raw chunks into candidate objects
        const candidates = data.results.map((chunk) =>
          parseCandidateFromText(chunk)
        );

        // Group by source file to avoid duplicates
        const uniqueCandidates = candidates.reduce((acc, candidate) => {
          const existingIndex = acc.findIndex(
            (c) => c.filename === candidate.filename
          );
          if (existingIndex >= 0) {
            // Merge skills and keep the one with better match score
            const existing = acc[existingIndex];
            const mergedSkills = [
              ...(existing.skills || []),
              ...(candidate.skills || []),
            ];
            const uniqueSkills = Array.from(new Set(mergedSkills));

            if (
              !candidate.matchScore ||
              (existing.matchScore &&
                existing.matchScore >= candidate.matchScore)
            ) {
              existing.skills = uniqueSkills;
            } else {
              candidate.skills = uniqueSkills;
              acc[existingIndex] = candidate;
            }
          } else {
            acc.push(candidate);
          }
          return acc;
        }, [] as CandidateResult[]);

        setSearchResults(uniqueCandidates);
        onSearchResults(uniqueCandidates);
      } else {
        setSearchResults([]);
        onSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Search failed. Please try again."
      );
      setSearchResults([]);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, onSearchResults]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    onSearchResults([]);
  }, [onSearchResults]);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSearching) {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: AppColors.background.default,
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <HeroSection elevation={0}>
          <Box sx={{ textAlign: "center", maxWidth: 700, mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <AutoAwesome
                sx={{
                  fontSize: "2.5rem",
                  mr: 2,
                  color: AppColors.primary.contrast,
                }}
              />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  color: AppColors.primary.contrast,
                }}
              >
                AI Resume Search
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: AppColors.primary.contrast,
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Discover the perfect candidates with intelligent semantic search.
              <br />
              Try queries like "React developer with 5+ years" or "Python data
              scientist".
            </Typography>

            {/* Enhanced Search Input */}
            <SearchContainer>
              <Search
                sx={{
                  color: AppColors.text.secondary,
                  ml: 2,
                  fontSize: "1.4rem",
                }}
              />
              <StyledTextField
                fullWidth
                placeholder="Search for candidates by skills, experience, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
              />
              {searchQuery && (
                <Tooltip title="Clear search">
                  <IconButton
                    onClick={() => setSearchQuery("")}
                    sx={{
                      color: AppColors.text.secondary,
                      cursor: "pointer !important",
                      "&:hover": {
                        cursor: "pointer !important",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Clear />
                  </IconButton>
                </Tooltip>
              )}
              <SearchButton
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                startIcon={
                  isSearching ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <TrendingUp />
                  )
                }
              >
                {isSearching ? "Searching..." : "Search"}
              </SearchButton>
            </SearchContainer>
          </Box>
        </HeroSection>

        {/* Error Display */}
        <Fade in={!!error}>
          <Box>
            {error && (
              <StyledAlert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </StyledAlert>
            )}
          </Box>
        </Fade>

        {/* Loading Skeletons */}
        {isSearching && (
          <Fade in timeout={300}>
            <Card
              sx={{
                minHeight: 400,
                borderRadius: 2,
                backgroundColor: AppColors.background.paper,
                border: `1px solid ${AppColors.border.light}`,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                    pb: 3,
                    borderBottom: `1px solid ${AppColors.border.light}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={200} height={32} />
                    <Skeleton variant="rounded" width={80} height={24} />
                  </Box>
                  <Skeleton variant="rounded" width={120} height={36} />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[1, 2, 3, 4].map((index) => (
                    <SearchResultSkeleton key={index} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Search Results */}
        {hasSearched && !isSearching && (
          <Fade in timeout={500}>
            <Card
              sx={{
                minHeight: 400,
                borderRadius: 2,
                backgroundColor: AppColors.background.paper,
                border: `1px solid ${AppColors.border.light}`,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {searchResults.length > 0 ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                        pb: 3,
                        borderBottom: `1px solid ${AppColors.border.light}`,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <FilterList
                          sx={{
                            color: AppColors.primary.main,
                            fontSize: "1.5rem",
                          }}
                        />
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: AppColors.text.primary,
                          }}
                        >
                          Search Results
                        </Typography>
                        <MatchScoreChip
                          label={`${searchResults.length} matches`}
                          size="small"
                        />
                      </Box>
                      <Button
                        onClick={clearSearch}
                        startIcon={<Clear />}
                        sx={{
                          color: AppColors.text.secondary,
                          textTransform: "none",
                          fontWeight: 500,
                          cursor: "pointer !important",
                          "&:hover": {
                            backgroundColor: AppColors.border.light,
                            cursor: "pointer !important",
                          },
                        }}
                      >
                        Clear Search
                      </Button>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {searchResults.map((candidate, index) => (
                        <Zoom
                          in
                          timeout={300 + index * 100}
                          key={candidate.id || index}
                        >
                          <Card
                            sx={{
                              borderRadius: 2,
                              border: `1px solid ${AppColors.border.light}`,
                              backgroundColor: "#ffffff",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              {/* Header with person icon and filename */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  mb: 3,
                                }}
                              >
                                <Person
                                  sx={{
                                    fontSize: "1.5rem",
                                    color: "#64748b",
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: "#334155",
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  Candidate from file:{" "}
                                  {candidate.filename || "Unknown file"}
                                </Typography>
                              </Box>

                              {/* Key highlights with checkmarks */}
                              <Box sx={{ mb: 3 }}>
                                {candidate.highlights &&
                                candidate.highlights.length > 0 ? (
                                  candidate.highlights.map(
                                    (highlight, highlightIndex) => (
                                      <Box
                                        key={highlightIndex}
                                        sx={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          gap: 1.5,
                                          mb: 1.5,
                                        }}
                                      >
                                        <CheckCircle
                                          sx={{
                                            color: "#10b981",
                                            fontSize: "16px",
                                            flexShrink: 0,
                                            mt: 0.2,
                                          }}
                                        />
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: "#64748b",
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          {highlight}
                                        </Typography>
                                      </Box>
                                    )
                                  )
                                ) : (
                                  // Fallback to skills and role if no highlights
                                  <>
                                    {candidate.skills &&
                                      candidate.skills.length > 0 && (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 1.5,
                                            mb: 1.5,
                                          }}
                                        >
                                          <CheckCircle
                                            sx={{
                                              color: "#10b981",
                                              fontSize: "16px",
                                              flexShrink: 0,
                                              mt: 0.2,
                                            }}
                                          />
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: "#64748b",
                                              lineHeight: 1.5,
                                            }}
                                          >
                                            Skilled in{" "}
                                            {candidate.skills
                                              .slice(0, 5)
                                              .join(", ")}
                                            {candidate.skills.length > 5 &&
                                              ` and ${
                                                candidate.skills.length - 5
                                              } more technologies`}
                                          </Typography>
                                        </Box>
                                      )}

                                    {candidate.currentRole && (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          gap: 1.5,
                                          mb: 1.5,
                                        }}
                                      >
                                        <CheckCircle
                                          sx={{
                                            color: "#10b981",
                                            fontSize: "16px",
                                            flexShrink: 0,
                                            mt: 0.2,
                                          }}
                                        />
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: "#64748b",
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          {candidate.currentRole}
                                        </Typography>
                                      </Box>
                                    )}

                                    {(!candidate.skills ||
                                      candidate.skills.length === 0) &&
                                      !candidate.currentRole &&
                                      candidate.rawText && (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 1.5,
                                            mb: 1.5,
                                          }}
                                        >
                                          <CheckCircle
                                            sx={{
                                              color: "#10b981",
                                              fontSize: "16px",
                                              flexShrink: 0,
                                              mt: 0.2,
                                            }}
                                          />
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: "#64748b",
                                              lineHeight: 1.5,
                                            }}
                                          >
                                            {candidate.rawText.substring(
                                              0,
                                              120
                                            )}
                                            ...
                                          </Typography>
                                        </Box>
                                      )}
                                  </>
                                )}
                              </Box>

                              {/* Action Buttons */}
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  variant="contained"
                                  startIcon={
                                    <Visibility sx={{ fontSize: "16px" }} />
                                  }
                                  sx={{
                                    backgroundColor: "#10b981",
                                    color: "white",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 2.5,
                                    py: 1,
                                    fontSize: "0.9rem",
                                    cursor: "pointer !important",
                                    "&:hover": {
                                      backgroundColor: "#059669",
                                      cursor: "pointer !important",
                                    },
                                  }}
                                  onClick={() => {
                                    try {
                                      // Use original filename without modification
                                      const originalFilename =
                                        candidate.filename || candidate.id;

                                      if (!originalFilename) {
                                        console.error(
                                          "No filename available for viewing"
                                        );
                                        alert(
                                          "Unable to view CV: Filename not available"
                                        );
                                        return;
                                      }

                                      const viewUrl = `${API_CONFIG.baseURL}/uploads/${originalFilename}`;
                                      console.log(
                                        "Opening CV viewer with URL:",
                                        viewUrl
                                      );
                                      window.open(viewUrl, "_blank");
                                    } catch (error) {
                                      console.error("Error viewing CV:", error);
                                      alert(
                                        "Failed to open CV viewer. Please try again."
                                      );
                                    }
                                  }}
                                >
                                  View CV
                                </Button>

                                <Button
                                  variant="outlined"
                                  startIcon={
                                    <Box
                                      component="span"
                                      sx={{ fontSize: "16px" }}
                                    >
                                      📥
                                    </Box>
                                  }
                                  sx={{
                                    borderColor: "#10b981",
                                    color: "#10b981",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 2.5,
                                    py: 1,
                                    fontSize: "0.9rem",
                                    cursor: "pointer !important",
                                    "&:hover": {
                                      backgroundColor: "#10b981",
                                      color: "white",
                                      cursor: "pointer !important",
                                    },
                                  }}
                                  onClick={async () => {
                                    try {
                                      // Use original source_file name without modification
                                      // This matches the actual filename stored on the server
                                      const originalFilename =
                                        candidate.filename || candidate.id;

                                      if (!originalFilename) {
                                        throw new Error(
                                          "Filename not available for download"
                                        );
                                      }

                                      console.log(
                                        "Attempting to download file:",
                                        originalFilename
                                      );
                                      console.log(
                                        "Download URL:",
                                        `${API_CONFIG.baseURL}/uploads/${originalFilename}`
                                      );

                                      // Fetch the file for download
                                      const response = await fetch(
                                        `${API_CONFIG.baseURL}/uploads/${originalFilename}`,
                                        {
                                          method: "GET",
                                          headers: {
                                            Accept:
                                              "application/pdf,application/octet-stream,*/*",
                                          },
                                        }
                                      );

                                      console.log(
                                        "Download response status:",
                                        response.status
                                      );

                                      if (response.ok) {
                                        // Get the file as a blob
                                        const blob = await response.blob();
                                        const url =
                                          window.URL.createObjectURL(blob);

                                        // Create a temporary link element and trigger download
                                        const link =
                                          document.createElement("a");
                                        link.href = url;
                                        // Use original filename for download (no modifications)
                                        link.download = originalFilename;
                                        // Ensure the link is not visible
                                        link.style.display = "none";
                                        document.body.appendChild(link);
                                        link.click();

                                        // Clean up
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);

                                        console.log(
                                          "Download initiated successfully"
                                        );
                                      } else {
                                        // Log detailed error information
                                        const errorText = await response
                                          .text()
                                          .catch(() => "Unknown error");
                                        console.error("Download failed:", {
                                          status: response.status,
                                          statusText: response.statusText,
                                          url: response.url,
                                          errorBody: errorText,
                                        });
                                        throw new Error(
                                          `Download failed: ${response.status} ${response.statusText}`
                                        );
                                      }
                                    } catch (error) {
                                      console.error(
                                        "Error downloading CV:",
                                        error
                                      );
                                      // Enhanced error message with debugging info
                                      const errorMessage =
                                        error instanceof Error
                                          ? error.message
                                          : "Unknown error occurred";
                                      alert(
                                        `Failed to download CV: ${errorMessage}\n\nPlease check the browser console for more details.`
                                      );
                                    }
                                  }}
                                >
                                  Download
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Zoom>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        backgroundColor: AppColors.border.light,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SearchOff
                        sx={{
                          fontSize: "3rem",
                          color: AppColors.text.secondary,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: AppColors.text.primary,
                        mb: 1,
                      }}
                    >
                      No Matches Found
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        maxWidth: 500,
                        lineHeight: 1.6,
                        color: AppColors.text.secondary,
                      }}
                    >
                      No candidates match your search criteria.
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: 600,
                        lineHeight: 1.8,
                        fontSize: "1rem",
                        color: AppColors.text.secondary,
                      }}
                    >
                      Try using different keywords, skills, or requirements.
                      Consider broadening your search terms or checking for
                      typos.
                    </Typography>

                    <Button
                      variant="outlined"
                      onClick={clearSearch}
                      startIcon={<Clear />}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderColor: AppColors.primary.main,
                        color: AppColors.primary.main,
                        cursor: "pointer !important",
                        "&:hover": {
                          backgroundColor: AppColors.primary.main,
                          color: AppColors.primary.contrast,
                          cursor: "pointer !important",
                        },
                      }}
                    >
                      Start New Search
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Fade>
        )}

        {/* Initial State */}
        {!hasSearched && !isSearching && (
          <Fade in timeout={800}>
            <Card
              sx={{
                minHeight: 350,
                borderRadius: 2,
                backgroundColor: AppColors.background.paper,
                border: `1px solid ${AppColors.border.light}`,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      backgroundColor: AppColors.primary.main,
                      color: AppColors.primary.contrast,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Search sx={{ fontSize: "3rem" }} />
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: AppColors.text.primary,
                      mb: 1,
                    }}
                  >
                    Ready to Search
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      maxWidth: 500,
                      lineHeight: 1.8,
                      fontSize: "1.1rem",
                      color: AppColors.text.secondary,
                    }}
                  >
                    Enter your search criteria above to find matching candidates
                    from our comprehensive resume database.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 2,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {[
                      "React Developer",
                      "Python Engineer",
                      "Data Scientist",
                      "Full Stack",
                    ].map((example, index) => (
                      <Chip
                        key={index}
                        label={`Try: "${example}"`}
                        onClick={() => setSearchQuery(example)}
                        sx={{
                          cursor: "pointer !important",
                          backgroundColor: AppColors.border.light,
                          color: AppColors.text.primary,
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: AppColors.primary.main,
                            color: AppColors.primary.contrast,
                            cursor: "pointer !important",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default ResumeSearch;
