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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Person,
  SearchOff,
  Clear,
  AutoAwesome,
  TrendingUp,
  FilterList,
  CheckCircle,
  Visibility,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Internal imports
import { API_CONFIG } from "../theme/constants";
import { useGroups } from "../hooks/useGroups";

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
  alignItems: "flex-start",
  gap: theme.spacing(1),
  backgroundColor: AppColors.background.paper,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
  border: `2px solid ${AppColors.border.light}`,
  transition: "all 0.3s ease",
  minHeight: "140px",
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
    minHeight: "120px",
    alignItems: "flex-start",
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
    padding: theme.spacing(2, 2, 2, 1.5),
    color: AppColors.text.primary,
    minHeight: "80px !important",
    "&::placeholder": {
      color: AppColors.text.secondary,
      opacity: 1,
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  minWidth: 180,
  height: 56,
  borderRadius: 10,
  fontSize: "1rem",
  fontWeight: 700,
  backgroundColor: "#ffffff",
  color: "#1e293b",
  textTransform: "none",
  boxShadow: `0 4px 16px rgba(0, 0, 0, 0.12)`,
  transition: "all 0.2s ease",
  cursor: "pointer !important",
  position: "relative",
  overflow: "hidden",
  border: "2px solid #ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "0 24px",
  whiteSpace: "nowrap",
  "& .MuiButton-startIcon": {
    marginRight: 8,
    marginLeft: 0,
    display: "flex",
    alignItems: "center",
  },
  "&::before": {
    display: "none",
  },
  "&:hover": {
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    boxShadow: `0 6px 20px rgba(0, 0, 0, 0.18)`,
    borderColor: "#f8fafc",
  },
  "&:disabled": {
    backgroundColor: "#94a3b8",
    color: "#475569",
    borderColor: "#94a3b8",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const ControlsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
  padding: theme.spacing(2, 0),
  flexWrap: "wrap",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
    alignItems: "stretch",
  },
}));

const GroupSelectContainer = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    border: `2px solid #e2e8f0`,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "#f1f5f9",
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused": {
      backgroundColor: "#f1f5f9",
      borderColor: "#3b82f6",
      boxShadow: `0 0 0 2px #3b82f633`,
    },
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiInputLabel-root": {
    display: "none",
  },
  "& .MuiSelect-select": {
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontSize: "0.95rem",
    fontWeight: 600,
    padding: theme.spacing(1.5, 2),
    minHeight: "24px",
  },
  "& .MuiSelect-icon": {
    color: "#64748b",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
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

// Premium Score Badge Component
const ScoreBadge = styled(Box)<{ score: number }>(({ theme, score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8)
      return {
        bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        text: "#ffffff",
        shadow: "0 8px 32px rgba(16, 185, 129, 0.4)",
        border: "rgba(16, 185, 129, 0.3)",
      };
    if (score >= 6)
      return {
        bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        text: "#ffffff",
        shadow: "0 8px 32px rgba(59, 130, 246, 0.4)",
        border: "rgba(59, 130, 246, 0.3)",
      };
    if (score >= 4)
      return {
        bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        text: "#ffffff",
        shadow: "0 8px 32px rgba(245, 158, 11, 0.4)",
        border: "rgba(245, 158, 11, 0.3)",
      };
    return {
      bg: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      text: "#ffffff",
      shadow: "0 8px 32px rgba(100, 116, 139, 0.4)",
      border: "rgba(100, 116, 139, 0.3)",
    };
  };

  const colors = getScoreColor(score);

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100px",
    height: "48px",
    background: colors.bg,
    color: colors.text,
    borderRadius: "16px",
    fontWeight: 800,
    fontSize: "1.1rem",
    padding: theme.spacing(1, 2.5),
    boxShadow: colors.shadow,
    border: `2px solid ${colors.border}`,
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(20px)",
    fontFamily: '"SF Pro Display", -apple-system, system-ui, sans-serif',
    letterSpacing: "-0.02em",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      transition: "left 0.8s ease",
    },
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `${colors.shadow.replace("0.4", "0.6")}`,
    },
    "&:hover::before": {
      left: "100%",
    },
  };
});

// Elegant Score Metrics Section
const ScoreMetricsSection = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(145deg, rgba(248, 250, 252, 0.06) 0%, rgba(241, 245, 249, 0.03) 100%)",
  backdropFilter: "blur(20px)",
  borderRadius: 16,
  padding: theme.spacing(3),
  border: "1px solid rgba(203, 213, 225, 0.12)",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)",
    borderRadius: "16px 16px 0 0",
  },
}));

const ScoreMetricsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const ScoreMetricItem = styled(Box)<{ score: number }>(({ theme, score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "#10b981";
    if (score >= 6) return "#3b82f6";
    if (score >= 4) return "#f59e0b";
    return "#64748b";
  };

  const color = getScoreColor(score);

  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2, 1.5),
    backgroundColor: "rgba(248, 250, 252, 0.04)",
    borderRadius: 12,
    border: `1px solid ${color}20`,
    transition: "all 0.3s ease",
    position: "relative",
    "&:hover": {
      backgroundColor: `${color}08`,
      borderColor: `${color}40`,
      transform: "translateY(-2px)",
      boxShadow: `0 4px 20px ${color}20`,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background: color,
      borderRadius: "12px 12px 0 0",
    },
    "& .metric-label": {
      fontSize: "0.8rem",
      fontWeight: 600,
      color: AppColors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: theme.spacing(1),
      textAlign: "center",
    },
    "& .metric-value": {
      fontSize: "1.5rem",
      fontWeight: 800,
      color: color,
      fontFamily: '"SF Pro Display", -apple-system, system-ui, sans-serif',
      lineHeight: 1,
    },
    "& .metric-bar": {
      width: "100%",
      height: 4,
      backgroundColor: "rgba(100, 116, 139, 0.15)",
      borderRadius: 2,
      marginTop: theme.spacing(1.5),
      overflow: "hidden",
      "& .metric-fill": {
        height: "100%",
        backgroundColor: color,
        borderRadius: 2,
        width: `${(score / 10) * 100}%`,
        transition: "width 0.6s ease",
      },
    },
  };
});

const ScoreLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  fontWeight: 600,
  color: AppColors.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: theme.spacing(0.5),
}));

// Enhanced Result Card styling
const ResultCard = styled(Card)<{ score?: number }>(({ theme, score = 0 }) => {
  const getScoreAccent = (score: number) => {
    if (score >= 8) return "#10b981"; // Green for excellent matches
    if (score >= 6) return "#3b82f6"; // Blue for good matches
    if (score >= 4) return "#f59e0b"; // Orange for fair matches
    return "#64748b"; // Gray for lower matches
  };

  const getCardGlow = (score: number) => {
    const accent = getScoreAccent(score);
    return `0 0 0 1px ${accent}15, 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 16px ${accent}20`;
  };

  const getHoverGlow = (score: number) => {
    const accent = getScoreAccent(score);
    return `0 0 0 1px ${accent}25, 0 16px 48px rgba(0, 0, 0, 0.5), 0 4px 24px ${accent}30`;
  };

  return {
    borderRadius: 12,
    background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
    boxShadow: getCardGlow(score),
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    border: "none",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: getHoverGlow(score),
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: `linear-gradient(90deg, ${getScoreAccent(
        score
      )} 0%, ${getScoreAccent(score)}80 100%)`,
      borderRadius: "12px 12px 0 0",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
      borderRadius: 12,
      pointerEvents: "none",
    },
  };
});

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
  group?: string;
}

interface CandidateDetail {
  candidate_name: string;
  details: string;
  file_name: string;
}

interface ScoreCard {
  clarity_score: number;
  experience_score: number;
  loyality_score: number;
  reputation_score: number;
}

interface SearchApiResponse {
  answer: {
    candidate_details: CandidateDetail[];
    score_card: ScoreCard;
    summary: string;
  };
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
  // New score fields
  clarityScore?: number;
  experienceScore?: number;
  loyaltyScore?: number;
  reputationScore?: number;
  averageScore?: number;
  details?: string;
  group?: string;
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
  const [selectedGroup, setSelectedGroup] = useState("");
  const [searchSummary, setSearchSummary] = useState<string | null>(null);

  // Groups management
  const { groups, loading: groupsLoading, error: groupsError } = useGroups();

  // Helper function to clean up filename for display
  const getDisplayFilename = (originalFilename: string): string => {
    if (!originalFilename) return "Unknown file";

    // Remove common prefixes that might be added by the system
    // This handles cases like "4FT2I_4duwG_RAHUL_KESHRI_SDE.pdf" -> "RAHUL_KESHRI_SDE.pdf"
    const cleaned = originalFilename.replace(/^[a-zA-Z0-9]+_[a-zA-Z0-9]+_/, "");

    // If the cleaned version is too short, return the original
    if (cleaned.length < 5) {
      return originalFilename;
    }

    return cleaned;
  };

  // Helper function to get search suggestions based on selected group
  const getGroupBasedSuggestions = (groupName: string): string[] => {
    const defaultSuggestions = [
      "React Developer with 3+ years experience",
      "Senior Python Engineer with ML background",
      "Data Scientist with statistics expertise",
      "Full Stack Developer with cloud experience",
    ];

    if (!groupName) return defaultSuggestions;

    const lowerGroupName = groupName.toLowerCase();

    // Technology/Engineering groups
    if (
      lowerGroupName.includes("tech") ||
      lowerGroupName.includes("engineering") ||
      lowerGroupName.includes("software") ||
      lowerGroupName.includes("dev")
    ) {
      return [
        "React Developer",
        "Python Engineer",
        "Full Stack Developer",
        "Mobile Developer",
      ];
    }

    // Data/Analytics groups
    if (
      lowerGroupName.includes("data") ||
      lowerGroupName.includes("analytics") ||
      lowerGroupName.includes("ml") ||
      lowerGroupName.includes("ai")
    ) {
      return [
        "Data Scientist",
        "Machine Learning Engineer",
        "Data Analyst",
        "Python Developer",
      ];
    }

    // Marketing groups
    if (
      lowerGroupName.includes("marketing") ||
      lowerGroupName.includes("digital")
    ) {
      return [
        "Digital Marketing Specialist",
        "Content Creator",
        "SEO Specialist",
        "Social Media Manager",
      ];
    }

    // Sales groups
    if (
      lowerGroupName.includes("sales") ||
      lowerGroupName.includes("business")
    ) {
      return [
        "Sales Representative",
        "Account Manager",
        "Business Development",
        "Customer Success",
      ];
    }

    // Design groups
    if (
      lowerGroupName.includes("design") ||
      lowerGroupName.includes("creative") ||
      lowerGroupName.includes("ui") ||
      lowerGroupName.includes("ux")
    ) {
      return [
        "UI/UX Designer",
        "Graphic Designer",
        "Product Designer",
        "Creative Director",
      ];
    }

    // Finance groups
    if (
      lowerGroupName.includes("finance") ||
      lowerGroupName.includes("accounting")
    ) {
      return [
        "Financial Analyst",
        "Accountant",
        "Investment Analyst",
        "Risk Manager",
      ];
    }

    // HR/People groups
    if (
      lowerGroupName.includes("hr") ||
      lowerGroupName.includes("people") ||
      lowerGroupName.includes("human")
    ) {
      return [
        "HR Specialist",
        "Recruiter",
        "People Operations",
        "Training Manager",
      ];
    }

    // Operations groups
    if (
      lowerGroupName.includes("operations") ||
      lowerGroupName.includes("ops")
    ) {
      return [
        "Operations Manager",
        "Project Manager",
        "Supply Chain",
        "Process Improvement",
      ];
    }

    // Healthcare groups
    if (
      lowerGroupName.includes("health") ||
      lowerGroupName.includes("medical") ||
      lowerGroupName.includes("nurse") ||
      lowerGroupName.includes("doctor")
    ) {
      return [
        "Registered Nurse",
        "Medical Assistant",
        "Healthcare Administrator",
        "Clinical Researcher",
      ];
    }

    // Education groups
    if (
      lowerGroupName.includes("education") ||
      lowerGroupName.includes("teacher") ||
      lowerGroupName.includes("academic")
    ) {
      return [
        "Teacher",
        "Educational Coordinator",
        "Academic Advisor",
        "Training Specialist",
      ];
    }

    // Legal groups
    if (lowerGroupName.includes("legal") || lowerGroupName.includes("law")) {
      return [
        "Legal Advisor",
        "Paralegal",
        "Compliance Officer",
        "Contract Specialist",
      ];
    }

    // Default fallback with some variety
    return [
      "Senior Professional",
      "Team Lead",
      "Subject Matter Expert",
      "5+ years experience",
    ];
  };

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
  const parseCandidateFromText = useCallback(
    (chunk: RawChunkResult): CandidateResult => {
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
    },
    []
  );

  // API search handler with POST method
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    if (searchQuery.trim().length < 5) {
      setError(
        "Please enter at least 5 characters for your search query or job description."
      );
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      // Prepare the request body
      const requestBody: any = {
        query: searchQuery.trim(),
        group: selectedGroup && selectedGroup !== "" ? selectedGroup : null,
      };

      const response = await fetch(`${API_CONFIG.baseURL}/search_api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Search failed: ${response.status} ${response.statusText}`
        );
      }

      const data: SearchApiResponse = await response.json();

      // Check if we have candidate details in the answer
      if (
        data.answer &&
        data.answer.candidate_details &&
        data.answer.candidate_details.length > 0
      ) {
        const candidateDetails = data.answer.candidate_details;
        const scoreCard = data.answer.score_card;

        // Calculate average score from all score categories
        // Formula: (Clarity + Experience + Loyalty + Reputation) ÷ 4
        // Each score is rated 1-10, so average will also be 1-10
        const calculateAverageScore = (scores: ScoreCard) => {
          const total =
            scores.clarity_score +
            scores.experience_score +
            scores.loyality_score +
            scores.reputation_score;
          return total / 4;
        };

        const averageScore = calculateAverageScore(scoreCard);

        // Create candidate objects from the structured response
        const candidates: CandidateResult[] = candidateDetails.map(
          (detail, index) => {
            // Find corresponding chunk for additional text data
            const matchingChunk = data.results.find(
              (chunk) => chunk.source_file === detail.file_name
            );

            const parsedCandidate = matchingChunk
              ? parseCandidateFromText(matchingChunk)
              : null;

            return {
              id: matchingChunk?.id || `candidate-${index}`,
              name: detail.candidate_name,
              filename: detail.file_name,
              details: detail.details,
              // Include all individual scores
              clarityScore: scoreCard.clarity_score,
              experienceScore: scoreCard.experience_score,
              loyaltyScore: scoreCard.loyality_score,
              reputationScore: scoreCard.reputation_score,
              averageScore: averageScore,
              // Include chunk-based match score if available
              matchScore: matchingChunk?.score || averageScore / 10,
              // Include parsed data if available
              email: parsedCandidate?.email,
              phone: parsedCandidate?.phone,
              location: parsedCandidate?.location,
              currentRole: parsedCandidate?.currentRole,
              skills: parsedCandidate?.skills,
              rawText: matchingChunk?.text,
              highlights: detail.details
                .split("*")
                .filter((item) => item.trim())
                .map((item) => item.trim().replace(/^,\s*/, "")),
              group: matchingChunk?.group,
            };
          }
        );

        // Sort candidates by average score in descending order
        const sortedCandidates = candidates.sort((a, b) => {
          const scoreA = a.averageScore || 0;
          const scoreB = b.averageScore || 0;
          return scoreB - scoreA; // Descending order
        });

        setSearchResults(sortedCandidates);
        setSearchSummary(data.answer.summary);
        onSearchResults(sortedCandidates);
      } else {
        setSearchResults([]);
        setSearchSummary(null);
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
      setSearchSummary(null);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedGroup, onSearchResults, parseCandidateFromText]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSelectedGroup("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    setSearchSummary(null);
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
              Find the perfect candidates with AI-powered search. Search by
              keywords or paste a complete job description.
            </Typography>

            {/* Clean Search Input Area */}
            <SearchContainer>
              <StyledTextField
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                placeholder={`Enter search terms or paste a job description to find matching candidates${
                  selectedGroup ? ` in ${selectedGroup}` : ""
                }...

Examples:
• "React developer with 3+ years experience"
• "Senior Python engineer with machine learning background"
• Paste a complete job description here`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
              />

              {searchQuery && (
                <Tooltip title="Clear search query">
                  <IconButton
                    onClick={() => setSearchQuery("")}
                    sx={{
                      color: AppColors.text.secondary,
                      cursor: "pointer !important",
                      alignSelf: "flex-start",
                      mt: 1,
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
            </SearchContainer>

            {/* Controls Section - Group Selection & Search Button */}
            <ControlsSection>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                flexWrap: "wrap",
                flex: 1,
                minWidth: 0 
              }}>
                <GroupSelectContainer variant="outlined">
                  <Select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    disabled={groupsLoading}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: "#ffffff",
                          border: `1px solid #e2e8f0`,
                          borderRadius: 2,
                          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                          mt: 1,
                          padding: "8px",
                          "& .MuiList-root": {
                            padding: "4px",
                          },
                          "& .MuiMenuItem-root": {
                            borderRadius: 1,
                            margin: "2px 0",
                            padding: "8px 16px",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem
                      value=""
                      sx={{
                        backgroundColor: "#ffffff",
                        color: "#1e293b",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        padding: "12px 16px",
                        margin: "2px 0",
                        borderRadius: "10px",
                        minHeight: "44px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f1f5f9",
                          color: "#0f172a",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#e0f2fe",
                          color: "#0369a1",
                          boxShadow: "0 2px 8px rgba(14, 165, 233, 0.12)",
                          "&:hover": {
                            backgroundColor: "#bae6fd",
                            color: "#0c4a6e",
                            boxShadow:
                              "0 4px 12px rgba(14, 165, 233, 0.18)",
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AutoAwesome
                          sx={{
                            fontSize: "16px",
                            color: "#3b82f6",
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            color: "#1e293b",
                            fontWeight: 600,
                          }}
                        >
                          All Groups
                        </Typography>
                      </Box>
                    </MenuItem>
                    {groups.map((group) => (
                      <MenuItem
                        key={group.id}
                        value={group.name}
                        sx={{
                          backgroundColor: "#ffffff",
                          color: "#1e293b",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          padding: "12px 16px",
                          margin: "2px 0",
                          borderRadius: "10px",
                          minHeight: "44px",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#f1f5f9",
                            color: "#0f172a",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#e0f2fe",
                            color: "#0369a1",
                            boxShadow: "0 2px 8px rgba(14, 165, 233, 0.12)",
                            "&:hover": {
                              backgroundColor: "#bae6fd",
                              color: "#0c4a6e",
                              boxShadow: "0 4px 12px rgba(14, 165, 233, 0.18)",
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FolderIcon
                            sx={{
                              fontSize: "16px",
                              color: "#64748b",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.95rem",
                              color: "#1e293b",
                              fontWeight: 600,
                            }}
                          >
                            {group.name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </GroupSelectContainer>

                {selectedGroup && (
                  <Chip
                    icon={<FolderIcon sx={{ fontSize: "14px" }} />}
                    label={`Searching in: ${selectedGroup}`}
                    size="small"
                    variant="filled"
                    sx={{
                      backgroundColor: "#ffffff",
                      borderColor: "#ffffff",
                      color: "#1e293b",
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      "& .MuiChip-icon": {
                        color: "#64748b",
                      },
                      whiteSpace: "nowrap",
                    }}
                  />
                )}
              </Box>

              <SearchButton
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim() || searchQuery.trim().length < 5}
                startIcon={isSearching ? <CircularProgress size={20} color="inherit" /> : <TrendingUp />}
              >
                {isSearching
                  ? "Searching..."
                  : searchQuery.trim().length < 5
                  ? `${5 - searchQuery.trim().length} more chars`
                  : "Search Candidates"}
              </SearchButton>
            </ControlsSection>
          </Box>
        </HeroSection>

        {/* Error Display */}
        <Fade in={!!(error || groupsError)}>
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
            {groupsError && (
              <StyledAlert severity="warning" sx={{ mb: 3 }}>
                Failed to load groups: {groupsError}. Searching in all groups.
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
                    {/* Search Summary Section */}
                    {searchSummary && (
                      <Box
                        sx={{
                          mb: 4,
                          p: 3,
                          backgroundColor: "rgba(59, 130, 246, 0.08)",
                          borderRadius: 2,
                          border: `1px solid ${AppColors.primary.main}40`,
                          borderLeft: `4px solid ${AppColors.primary.main}`,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: AppColors.primary.light,
                            fontWeight: 600,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <AutoAwesome sx={{ fontSize: "1.2rem" }} />
                          Summary
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: AppColors.text.primary,
                            lineHeight: 1.7,
                            fontSize: "1rem",
                          }}
                        >
                          {searchSummary}
                        </Typography>
                      </Box>
                    )}

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
                          {selectedGroup && (
                            <Typography
                              component="span"
                              variant="h6"
                              sx={{
                                ml: 1,
                                fontWeight: 500,
                                color: AppColors.text.secondary,
                                fontSize: "1rem",
                              }}
                            >
                              in "{selectedGroup}"
                            </Typography>
                          )}
                        </Typography>
                        <MatchScoreChip
                          label={`${searchResults.length} candidate${
                            searchResults.length === 1 ? "" : "s"
                          } found`}
                          size="small"
                        />
                        {selectedGroup && (
                          <Chip
                            icon={<FolderIcon sx={{ fontSize: "14px" }} />}
                            label={selectedGroup}
                            size="small"
                            sx={{
                              backgroundColor: AppColors.primary.light,
                              color: AppColors.primary.contrast,
                              fontWeight: 500,
                              "& .MuiChip-icon": {
                                color: AppColors.primary.contrast,
                              },
                            }}
                          />
                        )}
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
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      {searchResults.map((candidate, index) => (
                        <Zoom
                          in
                          timeout={300 + index * 100}
                          key={candidate.id || index}
                        >
                          <ResultCard score={candidate.averageScore || 0}>
                            <CardContent sx={{ p: 0 }}>
                              {/* Enhanced Header with Score */}
                              <Box
                                sx={{
                                  background:
                                    "linear-gradient(135deg, rgba(248, 250, 252, 0.06) 0%, rgba(241, 245, 249, 0.02) 100%)",
                                  backdropFilter: "blur(20px)",
                                  p: 4,
                                  borderRadius: "12px 12px 0 0",
                                  position: "relative",
                                  borderBottom:
                                    "1px solid rgba(203, 213, 225, 0.08)",
                                }}
                              >
                                {/* Compact Score Display - Top Right */}
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 20,
                                    right: 20,
                                    textAlign: "center",
                                  }}
                                >
                                  <ScoreLabel
                                    sx={{
                                      color: AppColors.text.secondary,
                                      fontSize: "0.75rem",
                                      mb: 1,
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      letterSpacing: "1px",
                                    }}
                                  >
                                    Overall Score
                                  </ScoreLabel>
                                  <ScoreBadge
                                    score={candidate.averageScore || 0}
                                  >
                                    {(candidate.averageScore || 0).toFixed(1)}
                                    <Typography
                                      component="span"
                                      sx={{
                                        fontSize: "0.8rem",
                                        opacity: 0.8,
                                        ml: 0.3,
                                      }}
                                    >
                                      /10
                                    </Typography>
                                  </ScoreBadge>
                                </Box>

                                {/* Candidate Info */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                    mr: 14, // Make room for score badge
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 56,
                                      height: 56,
                                      borderRadius: "12px",
                                      background:
                                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow:
                                        "0 8px 24px rgba(59, 130, 246, 0.3)",
                                      border:
                                        "2px solid rgba(59, 130, 246, 0.2)",
                                      position: "relative",
                                      "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "10px",
                                        background:
                                          "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
                                      },
                                    }}
                                  >
                                    <Person
                                      sx={{
                                        fontSize: "2rem",
                                        color: "white",
                                        position: "relative",
                                        zIndex: 1,
                                      }}
                                    />
                                  </Box>
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                      variant="h4"
                                      sx={{
                                        fontWeight: 800,
                                        color: AppColors.text.primary,
                                        fontSize: "1.5rem",
                                        mb: 1,
                                        wordBreak: "break-word",
                                        lineHeight: 1.2,
                                        fontFamily:
                                          '"SF Pro Display", -apple-system, system-ui, sans-serif',
                                        letterSpacing: "-0.02em",
                                      }}
                                    >
                                      {candidate.name ||
                                        getDisplayFilename(
                                          candidate.filename || ""
                                        )}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        color: AppColors.text.secondary,
                                        fontSize: "1.1rem",
                                        fontWeight: 600,
                                        opacity: 0.9,
                                        letterSpacing: "0.5px",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {candidate.group
                                        ? `${candidate.group} • `
                                        : ""}
                                      Candidate Profile
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              {/* Content Section */}
                              <Box sx={{ p: 4 }}>
                                {/* Performance Metrics Section */}
                                <ScoreMetricsSection>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: AppColors.text.primary,
                                      fontWeight: 700,
                                      fontSize: "1.1rem",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                      mb: 1,
                                    }}
                                  >
                                    <TrendingUp
                                      sx={{
                                        fontSize: "1.2rem",
                                        color: AppColors.primary.main,
                                      }}
                                    />
                                    Performance Metrics
                                  </Typography>

                                  <ScoreMetricsGrid>
                                    <ScoreMetricItem
                                      score={candidate.clarityScore || 0}
                                    >
                                      <Typography className="metric-label">
                                        Clarity
                                      </Typography>
                                      <Typography className="metric-value">
                                        {candidate.clarityScore || 0}
                                      </Typography>
                                      <Box className="metric-bar">
                                        <Box className="metric-fill" />
                                      </Box>
                                    </ScoreMetricItem>

                                    <ScoreMetricItem
                                      score={candidate.experienceScore || 0}
                                    >
                                      <Typography className="metric-label">
                                        Experience
                                      </Typography>
                                      <Typography className="metric-value">
                                        {candidate.experienceScore || 0}
                                      </Typography>
                                      <Box className="metric-bar">
                                        <Box className="metric-fill" />
                                      </Box>
                                    </ScoreMetricItem>

                                    <ScoreMetricItem
                                      score={candidate.loyaltyScore || 0}
                                    >
                                      <Typography className="metric-label">
                                        Loyalty
                                      </Typography>
                                      <Typography className="metric-value">
                                        {candidate.loyaltyScore || 0}
                                      </Typography>
                                      <Box className="metric-bar">
                                        <Box className="metric-fill" />
                                      </Box>
                                    </ScoreMetricItem>

                                    <ScoreMetricItem
                                      score={candidate.reputationScore || 0}
                                    >
                                      <Typography className="metric-label">
                                        Reputation
                                      </Typography>
                                      <Typography className="metric-value">
                                        {candidate.reputationScore || 0}
                                      </Typography>
                                      <Box className="metric-bar">
                                        <Box className="metric-fill" />
                                      </Box>
                                    </ScoreMetricItem>
                                  </ScoreMetricsGrid>
                                </ScoreMetricsSection>

                                {/* Premium highlights section */}
                                <Box sx={{ mb: 3 }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: AppColors.text.primary,
                                      fontWeight: 700,
                                      mb: 3,
                                      fontSize: "1.2rem",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                    }}
                                  >
                                    <CheckCircle
                                      sx={{
                                        fontSize: "1.3rem",
                                        color: "#10b981",
                                      }}
                                    />
                                    Profile Summary
                                  </Typography>

                                  {candidate.highlights &&
                                  candidate.highlights.length > 0 ? (
                                    <Box
                                      sx={{
                                        background:
                                          "linear-gradient(145deg, rgba(248, 250, 252, 0.06) 0%, rgba(241, 245, 249, 0.03) 100%)",
                                        backdropFilter: "blur(20px)",
                                        borderRadius: 2,
                                        padding: 3,
                                        border:
                                          "1px solid rgba(203, 213, 225, 0.12)",
                                        position: "relative",
                                        overflow: "hidden",
                                        "&::before": {
                                          content: '""',
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          height: "2px",
                                          background:
                                            "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                                          borderRadius: "16px 16px 0 0",
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 2,
                                        }}
                                      >
                                        {candidate.highlights.map(
                                          (highlight, highlightIndex) => (
                                            <Box
                                              key={highlightIndex}
                                              sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 2,
                                                position: "relative",
                                                pl: 1,
                                                "&::before": {
                                                  content: '""',
                                                  position: "absolute",
                                                  left: 0,
                                                  top: "50%",
                                                  transform: "translateY(-50%)",
                                                  width: 4,
                                                  height: 4,
                                                  backgroundColor: "#10b981",
                                                  borderRadius: "50%",
                                                  boxShadow:
                                                    "0 0 0 2px rgba(16, 185, 129, 0.2)",
                                                },
                                              }}
                                            >
                                              <Typography
                                                variant="body1"
                                                sx={{
                                                  color: AppColors.text.primary,
                                                  lineHeight: 1.6,
                                                  fontSize: "1rem",
                                                  fontWeight: 500,
                                                  pl: 2,
                                                }}
                                              >
                                                {highlight}
                                              </Typography>
                                            </Box>
                                          )
                                        )}
                                      </Box>
                                    </Box>
                                  ) : candidate.details ? (
                                    // Show structured details if no highlights
                                    <Box
                                      sx={{
                                        background:
                                          "linear-gradient(145deg, rgba(248, 250, 252, 0.06) 0%, rgba(241, 245, 249, 0.03) 100%)",
                                        backdropFilter: "blur(20px)",
                                        borderRadius: 2,
                                        padding: 3,
                                        border:
                                          "1px solid rgba(203, 213, 225, 0.12)",
                                        position: "relative",
                                        overflow: "hidden",
                                        "&::before": {
                                          content: '""',
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          height: "2px",
                                          background:
                                            "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                                          borderRadius: "16px 16px 0 0",
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          gap: 2,
                                          position: "relative",
                                          pl: 1,
                                          "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            left: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: 4,
                                            height: 4,
                                            backgroundColor: "#10b981",
                                            borderRadius: "50%",
                                            boxShadow:
                                              "0 0 0 2px rgba(16, 185, 129, 0.2)",
                                          },
                                        }}
                                      >
                                        <Typography
                                          variant="body1"
                                          sx={{
                                            color: AppColors.text.primary,
                                            lineHeight: 1.6,
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            pl: 2,
                                          }}
                                        >
                                          {candidate.details
                                            .replace(/\*/g, "")
                                            .trim()}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  ) : (
                                    // Fallback to skills and role if no highlights
                                    <>
                                      {candidate.skills &&
                                        candidate.skills.length > 0 && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "flex-start",
                                              gap: 2.5,
                                              mb: 3,
                                              p: 3,
                                              backgroundColor:
                                                "rgba(248, 250, 252, 0.04)",
                                              borderRadius: 2,
                                              border:
                                                "1px solid rgba(203, 213, 225, 0.08)",
                                              transition: "all 0.3s ease",
                                              "&:hover": {
                                                backgroundColor:
                                                  "rgba(248, 250, 252, 0.07)",
                                                borderColor:
                                                  "rgba(203, 213, 225, 0.15)",
                                                transform: "translateX(8px)",
                                                boxShadow:
                                                  "0 4px 16px rgba(0, 0, 0, 0.1)",
                                              },
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: "50%",
                                                backgroundColor: "#10b981",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                mt: 0.2,
                                                boxShadow:
                                                  "0 2px 8px rgba(16, 185, 129, 0.3)",
                                              }}
                                            >
                                              <CheckCircle
                                                sx={{
                                                  color: "white",
                                                  fontSize: "14px",
                                                }}
                                              />
                                            </Box>
                                            <Typography
                                              variant="body1"
                                              sx={{
                                                color: AppColors.text.primary,
                                                lineHeight: 1.6,
                                                fontSize: "1rem",
                                                fontWeight: 500,
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
                                            gap: 2.5,
                                            mb: 3,
                                            p: 3,
                                            backgroundColor:
                                              "rgba(248, 250, 252, 0.04)",
                                            borderRadius: 2,
                                            border:
                                              "1px solid rgba(203, 213, 225, 0.08)",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(248, 250, 252, 0.07)",
                                              borderColor:
                                                "rgba(203, 213, 225, 0.15)",
                                              transform: "translateX(8px)",
                                              boxShadow:
                                                "0 4px 16px rgba(0, 0, 0, 0.1)",
                                            },
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              width: 24,
                                              height: 24,
                                              borderRadius: "50%",
                                              backgroundColor: "#10b981",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              flexShrink: 0,
                                              mt: 0.2,
                                              boxShadow:
                                                "0 2px 8px rgba(16, 185, 129, 0.3)",
                                            }}
                                          >
                                            <CheckCircle
                                              sx={{
                                                color: "white",
                                                fontSize: "14px",
                                              }}
                                            />
                                          </Box>
                                          <Typography
                                            variant="body1"
                                            sx={{
                                              color: AppColors.text.primary,
                                              lineHeight: 1.6,
                                              fontSize: "1rem",
                                              fontWeight: 500,
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
                                              gap: 2.5,
                                              mb: 3,
                                              p: 3,
                                              backgroundColor:
                                                "rgba(248, 250, 252, 0.04)",
                                              borderRadius: 2,
                                              border:
                                                "1px solid rgba(203, 213, 225, 0.08)",
                                              transition: "all 0.3s ease",
                                              "&:hover": {
                                                backgroundColor:
                                                  "rgba(248, 250, 252, 0.07)",
                                                borderColor:
                                                  "rgba(203, 213, 225, 0.15)",
                                                transform: "translateX(8px)",
                                                boxShadow:
                                                  "0 4px 16px rgba(0, 0, 0, 0.1)",
                                              },
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: "50%",
                                                backgroundColor: "#10b981",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                mt: 0.2,
                                                boxShadow:
                                                  "0 2px 8px rgba(16, 185, 129, 0.3)",
                                              }}
                                            >
                                              <CheckCircle
                                                sx={{
                                                  color: "white",
                                                  fontSize: "14px",
                                                }}
                                              />
                                            </Box>
                                            <Typography
                                              variant="body1"
                                              sx={{
                                                color: AppColors.text.primary,
                                                lineHeight: 1.6,
                                                fontSize: "1rem",
                                                fontWeight: 500,
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

                                {/* Premium Action Buttons */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 3,
                                    pt: 4,
                                    borderTop:
                                      "1px solid rgba(203, 213, 225, 0.15)",
                                    mt: 2,
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    startIcon={
                                      <Visibility sx={{ fontSize: "20px" }} />
                                    }
                                    sx={{
                                      background:
                                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                      color: "white",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      px: 4,
                                      py: 2,
                                      fontSize: "1rem",
                                      boxShadow:
                                        "0 6px 20px rgba(59, 130, 246, 0.4)",
                                      border:
                                        "1px solid rgba(59, 130, 246, 0.3)",
                                      cursor: "pointer !important",
                                      position: "relative",
                                      overflow: "hidden",
                                      "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: "-100%",
                                        width: "100%",
                                        height: "100%",
                                        background:
                                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                                        transition: "left 0.6s ease",
                                      },
                                      "&:hover": {
                                        background:
                                          "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                        cursor: "pointer !important",
                                        boxShadow:
                                          "0 8px 28px rgba(59, 130, 246, 0.6)",
                                        transform: "translateY(-3px)",
                                      },
                                      "&:hover::before": {
                                        left: "100%",
                                      },
                                    }}
                                    onClick={() => {
                                      try {
                                        // Use original filename for API calls (not display version)
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
                                        console.error(
                                          "Error viewing CV:",
                                          error
                                        );
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
                                        sx={{ fontSize: "20px" }}
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
                                      px: 4,
                                      py: 2,
                                      fontSize: "1rem",
                                      borderWidth: "2px",
                                      cursor: "pointer !important",
                                      background: "rgba(16, 185, 129, 0.08)",
                                      position: "relative",
                                      overflow: "hidden",
                                      "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: "-100%",
                                        width: "100%",
                                        height: "100%",
                                        background:
                                          "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent)",
                                        transition: "left 0.6s ease",
                                      },
                                      "&:hover": {
                                        backgroundColor: "#10b981",
                                        color: "white",
                                        cursor: "pointer !important",
                                        borderColor: "#10b981",
                                        transform: "translateY(-3px)",
                                        boxShadow:
                                          "0 8px 28px rgba(16, 185, 129, 0.4)",
                                      },
                                      "&:hover::before": {
                                        left: "100%",
                                      },
                                    }}
                                    onClick={async () => {
                                      try {
                                        // Use original source_file name for API calls (not display version)
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
                              </Box>
                            </CardContent>
                          </ResultCard>
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
                      No candidates found. Try different keywords or broaden
                      your search.
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
                    <TrendingUp sx={{ fontSize: "3rem" }} />
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
                    {selectedGroup ? (
                      <>
                        Search in{" "}
                        <Typography
                          component="span"
                          sx={{
                            color: AppColors.primary.light,
                            fontWeight: 600,
                          }}
                        >
                          {selectedGroup}
                        </Typography>
                      </>
                    ) : (
                      "Search for candidates by skills, role, experience, or paste a complete job description to find the best matches."
                    )}
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
                    {getGroupBasedSuggestions(selectedGroup)
                      .slice(0, 3)
                      .map((example, index) => (
                        <Chip
                          key={index}
                          label={example}
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
