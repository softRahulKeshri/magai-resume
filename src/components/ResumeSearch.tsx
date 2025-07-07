import React, { useState, useCallback, useRef, useEffect } from "react";
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
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab,
  Skeleton,
} from "@mui/material";
import {
  Person,
  SearchOff,
  Clear,
  AutoAwesome,
  TrendingUp,
  FilterList,
  CheckCircle,
  Folder as FolderIcon,
  Upload,
  Search,
  TextFields,
  Description,
  Download,
  Visibility,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Internal imports
import { API_CONFIG } from "../theme/constants";
import { useGroups } from "../hooks/useGroups";

// Dark theme color palette for the entire application
const AppColors = {
  primary: {
    main: "#3077F3", // Primary UI Blue p500
    dark: "#1E50A8", // Primary UI Blue p600
    light: "#94BAFD", // Primary UI Blue p400
    contrast: "#FFFFFF", // n_white
  },
  secondary: {
    main: "#FDA052", // Brand gradient orange
    dark: "#B96AF7", // Brand gradient purple
    light: "#41E6F8", // Brand gradient cyan
    contrast: "#FFFFFF", // n_white
  },
  success: {
    main: "#3077F3", // Primary UI Blue p500
    light: "#94BAFD", // Primary UI Blue p400
    contrast: "#FFFFFF", // n_white
  },
  background: {
    default: "#FFFFFF", // n_white
    paper: "#F5F5F5", // n100
    elevated: "#EAEAEC", // n150
  },
  text: {
    primary: "#171921", // n3000
    secondary: "#434654", // n900
    disabled: "#82838D", // n600
  },
  border: {
    light: "#D5D6D9", // n200
    main: "#9698A0", // n500
    dark: "#6D6F7A", // n700
  },
  neutral_palette: {
    n900: "#434654",
    n800: "#585A67",
    n_white: "#FFFFFF",
    n_black: "#050507",
    n3000: "#171921",
    n300: "#C0C1C6",
    n400: "#ABADB3", // Adding missing n400 color
    n100: "#F5F5F5",
  },
  brand_gradient: {
    orange: "#FDA052",
    purple: "#B96AF7",
    blue: "#3077F3",
    cyan: "#41E6F8",
  },
  primary_ui_blue: {
    p700: "#11397E",
    p600: "#1E50A8",
    p500: "#3077F3",
    p400: "#94BAFD",
    p300: "#BFD6FF",
    p200: "#E3EDFF",
    p100: "#EFF5FF",
  },
};

// Simplified HeroSection with solid background
const HeroSection = styled(Paper)(({ theme }) => ({
  background: "#8B5CF6", // Solid purple background
  color: "#FFFFFF",
  padding: theme.spacing(8, 4),
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(4),
  position: "relative",
  textAlign: "center",
}));

// Simplified title styling
const HeroTitle = styled(Typography)`
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  font-family: "SF Pro Display", -apple-system, system-ui, sans-serif;
`;

// Simplified subtitle styling
const HeroSubtitle = styled(Typography)`
  font-size: 1.125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

// Enhanced search container for full width
const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  backgroundColor: "#FFFFFF",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  maxWidth: "100%", // Full width
  width: "100%", // Ensure full width
  margin: "0 auto",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
}));

// Simplified tabs styling
const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(0.5),
  width: "fit-content",
  margin: "0 auto",
  marginBottom: theme.spacing(4),
  "& .MuiTabs-indicator": {
    height: "100%",
    borderRadius: theme.spacing(1.5),
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.95rem",
  padding: theme.spacing(1.2, 3),
  color: "rgba(255, 255, 255, 0.8)",
  borderRadius: theme.spacing(1.5),
  minHeight: "unset",
  "&.Mui-selected": {
    color: "#FFFFFF",
    fontWeight: 600,
  },
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1),
    fontSize: "1.1rem",
  },
}));

const SearchOptionsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

// Update the GroupSelectContainer for better contrast
const GroupSelectContainer = styled(FormControl)(({ theme }) => ({
  minWidth: 160,
  backgroundColor: "#FFFFFF",
  borderRadius: theme.spacing(1),
  "& .MuiOutlinedInput-root": {
    backgroundColor: "transparent",
    "& fieldset": {
      border: "none",
    },
  },
}));

// Update the StyledTextField for better contrast
const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "transparent",
    fontSize: "1rem",
    height: "44px",
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5),
    "&::placeholder": {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
}));

// Update the SearchButton for better contrast
const SearchButton = styled(Button)(({ theme }) => ({
  height: 44,
  minWidth: 120,
  backgroundColor: "#8B5CF6",
  color: "#FFFFFF",
  borderRadius: theme.spacing(1),
  fontSize: "0.95rem",
  fontWeight: 600,
  textTransform: "none",
  padding: "0 24px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#7C3AED",
    transform: "translateY(-1px)",
  },
  "&:disabled": {
    backgroundColor: "#E5E7EB",
    color: "#9CA3AF",
    transform: "none",
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  height: 44,
  minWidth: 120,
  borderRadius: theme.spacing(1.5),
  fontSize: "0.95rem",
  fontWeight: 600,
  backgroundColor: AppColors.primary_ui_blue.p100,
  color: AppColors.primary_ui_blue.p500,
  textTransform: "none",
  padding: "0 24px",
  border: `1px solid ${AppColors.primary_ui_blue.p200}`,
  "&:hover": {
    backgroundColor: AppColors.primary_ui_blue.p200,
    borderColor: AppColors.primary_ui_blue.p300,
  },
}));

const ControlsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  flexWrap: "wrap",
  backgroundColor: AppColors.background.paper,
  borderRadius: theme.spacing(2),
  border: `1px solid ${AppColors.border.light}`,
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
    alignItems: "stretch",
  },
}));

const MatchScoreChip = styled(Chip)(({ theme }) => ({
  backgroundColor: AppColors.primary.main,
  color: AppColors.primary.contrast,
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
        bg: `linear-gradient(135deg, ${AppColors.brand_gradient.blue} 0%, ${AppColors.brand_gradient.purple} 100%)`,
        text: AppColors.neutral_palette.n_white,
        shadow: "0 8px 32px rgba(48, 119, 243, 0.2)",
        border: AppColors.brand_gradient.blue,
      };
    if (score >= 6)
      return {
        bg: `linear-gradient(135deg, ${AppColors.brand_gradient.purple} 0%, ${AppColors.brand_gradient.orange} 100%)`,
        text: AppColors.neutral_palette.n_white,
        shadow: "0 8px 32px rgba(185, 106, 247, 0.2)",
        border: AppColors.brand_gradient.purple,
      };
    if (score >= 4)
      return {
        bg: `linear-gradient(135deg, ${AppColors.brand_gradient.orange} 0%, ${AppColors.brand_gradient.cyan} 100%)`,
        text: AppColors.neutral_palette.n_white,
        shadow: "0 8px 32px rgba(253, 160, 82, 0.2)",
        border: AppColors.brand_gradient.orange,
      };
    return {
      bg: `linear-gradient(135deg, ${AppColors.brand_gradient.cyan} 0%, ${AppColors.primary_ui_blue.p300} 100%)`,
      text: AppColors.neutral_palette.n_white,
      shadow: "0 8px 32px rgba(65, 230, 248, 0.2)",
      border: AppColors.brand_gradient.cyan,
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
    border: `2px solid ${colors.border}40`,
    position: "relative",
    overflow: "hidden",
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
      boxShadow: `${colors.shadow.replace("0.2", "0.3")}`,
    },
    "&:hover::before": {
      left: "100%",
    },
  };
});

// Elegant Score Metrics Section
const ScoreMetricsSection = styled(Box)(({ theme }) => ({
  background: AppColors.neutral_palette.n_white,
  borderRadius: 16,
  padding: theme.spacing(3),
  border: `1px solid ${AppColors.primary_ui_blue.p100}`,
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
    background: `linear-gradient(90deg, ${AppColors.brand_gradient.blue} 0%, ${AppColors.brand_gradient.purple} 100%)`,
    borderRadius: "16px 16px 0 0",
  },
  "&:hover": {
    borderColor: AppColors.primary_ui_blue.p200,
    boxShadow: "0 4px 20px rgba(48, 119, 243, 0.08)",
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
    if (score >= 8) return AppColors.brand_gradient.blue;
    if (score >= 6) return AppColors.brand_gradient.purple;
    if (score >= 4) return AppColors.brand_gradient.orange;
    return AppColors.brand_gradient.cyan;
  };

  const color = getScoreColor(score);

  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2, 1.5),
    backgroundColor: AppColors.primary_ui_blue.p100,
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
      backgroundColor: AppColors.primary_ui_blue.p200,
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
const ResultCard = styled(Card)(({ theme }) => ({
  position: "relative",
  borderRadius: 16,
  backgroundColor: AppColors.background.paper,
  border: `1px solid ${AppColors.border.light}`,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
    borderColor: AppColors.primary.main,
    "&::before": {
      opacity: 1,
      transform: "scaleX(1)",
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: -1,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
    borderRadius: "8px 8px 0 0",
    opacity: 0,
    transform: "scaleX(0.6)",
    transition: "all 0.3s ease",
    transformOrigin: "center",
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${AppColors.secondary.main}`,
  backgroundColor: AppColors.background.paper,
  color: AppColors.text.primary,
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
  score_card: ScoreCard;
}

interface ScoreCard {
  clarity_score: number;
  experience_score: number;
  loyalty_score: number;
  reputation_score: number;
}

interface SearchApiResponse {
  answer: {
    candidate_details: CandidateDetail[];
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
  // Updated score field names to match API response
  clarityScore?: number;
  experienceScore?: number;
  loyaltyScore?: number;
  reputationScore?: number;
  averageScore?: number;
  details?: string;
  group?: string;
}

// Add new interface for JD upload response
interface JDUploadResponse {
  candidate_details: CandidateDetail[];
  summary: string;
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

const InitialStateCard = styled(Card)(({ theme }) => ({
  minHeight: 300, // Reduced height
  borderRadius: theme.spacing(3),
  background: `linear-gradient(135deg, rgba(185, 106, 247, 0.08) 0%, rgba(48, 119, 243, 0.08) 50%, rgba(65, 230, 248, 0.08) 100%)`,
  padding: theme.spacing(8, 6), // Reduced padding
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
  position: "relative",
  overflow: "hidden",
  border: `1px solid rgba(185, 106, 247, 0.1)`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
    pointerEvents: "none",
  },
}));

const CircleIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: AppColors.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  "& svg": {
    fontSize: 32,
    color: AppColors.primary.contrast,
  },
}));

// Add styled component for the upload area with drag state
const UploadArea = styled(Box)<{ isDragging?: boolean }>(
  ({ theme, isDragging }) => ({
    backgroundColor: isDragging
      ? `${AppColors.primary.main}08`
      : AppColors.background.paper,
    borderRadius: theme.spacing(2),
    border: `2px dashed ${
      isDragging ? AppColors.primary.main : AppColors.border.main
    }`,
    padding: theme.spacing(6),
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    minHeight: "300px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: AppColors.background.elevated,
      borderColor: AppColors.primary.main,
    },
  })
);

// Helper function to clean up filename for display
const getDisplayFilename = (originalFilename: string): string => {
  if (!originalFilename) return "Unknown file";
  const cleaned = originalFilename.replace(/^[a-zA-Z0-9]+_[a-zA-Z0-9]+_/, "");
  return cleaned.length < 5 ? originalFilename : cleaned;
};

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
  const { groups, error: groupsError } = useGroups();

  // Add new state for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Add tab state
  const [activeTab, setActiveTab] = useState(0);

  // Auto-focus effect
  useEffect(() => {
    if (activeTab === 0) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [activeTab]);

  // Add drag state
  const [isDragging, setIsDragging] = useState(false);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Clear previous search/upload state
    setSearchQuery("");
    setSelectedFile(null);
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Auto focus search input when switching to search tab
    if (newValue === 0) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
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

        // Calculate average score from all score categories
        // Formula: (Clarity + Experience + Loyalty + Reputation) ÷ 4
        // Each score is rated 1-10, so average will also be 1-10
        const calculateAverageScore = (scores: ScoreCard | null) => {
          if (!scores) return 0;
          const total =
            scores.clarity_score +
            scores.experience_score +
            scores.loyalty_score +
            scores.reputation_score;
          return total / 4;
        };

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

            // Add null check for score_card
            const scoreCard = detail.score_card || null;
            const averageScore = scoreCard
              ? ((scoreCard.clarity_score || 0) +
                  (scoreCard.experience_score || 0) +
                  (scoreCard.loyalty_score || 0) +
                  (scoreCard.reputation_score || 0)) /
                4
              : 0;

            return {
              id: matchingChunk?.id || `candidate-${index}`,
              name: detail.candidate_name,
              filename: detail.file_name,
              details: detail.details,
              // Include all individual scores with null checks
              clarityScore: scoreCard?.clarity_score || 0,
              experienceScore: scoreCard?.experience_score || 0,
              loyaltyScore: scoreCard?.loyalty_score || 0,
              reputationScore: scoreCard?.reputation_score || 0,
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

  // Handle JD upload and search
  const handleJDUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (selectedGroup) {
        formData.append("group", selectedGroup);
      }

      const response = await fetch(`${API_CONFIG.baseURL}/upload_jd`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      const data: SearchApiResponse = await response.json();
      console.log("JD Upload Response:", data);

      // Use the same logic as text search
      if (
        data.answer &&
        data.answer.candidate_details &&
        data.answer.candidate_details.length > 0
      ) {
        const candidateDetails = data.answer.candidate_details;

        // Calculate average score from all score categories
        const candidates: CandidateResult[] = candidateDetails.map(
          (detail, index) => {
            const scoreCard = detail.score_card;
            const averageScore = scoreCard
              ? (scoreCard.clarity_score +
                  scoreCard.experience_score +
                  scoreCard.loyalty_score +
                  scoreCard.reputation_score) /
                4
              : 0;

            // Extract name from filename if candidate_name is "Name not found"
            let displayName = detail.candidate_name;
            if (displayName === "Name not found" && detail.file_name) {
              const nameParts = detail.file_name.split("_");
              if (nameParts.length > 1) {
                displayName = nameParts
                  .slice(1, -1)
                  .join(" ")
                  .replace(/\.pdf$|\.docx$/i, "");
              }
            }

            return {
              id: detail.file_name || `candidate-${index}`,
              name: displayName || "Unknown Candidate",
              filename: detail.file_name,
              details: detail.details,
              clarityScore: scoreCard.clarity_score,
              experienceScore: scoreCard.experience_score,
              loyaltyScore: scoreCard.loyalty_score,
              reputationScore: scoreCard.reputation_score,
              averageScore,
              matchScore: scoreCard.clarity_score / 10,
              highlights: detail.details
                .split("\n")
                .map((line) => line.trim().replace(/^[-•]\s*/, ""))
                .filter((line) => line.length > 0),
              rawText: detail.details,
            };
          }
        );

        // Sort candidates by average score in descending order
        const sortedCandidates = candidates.sort(
          (a, b) => (b.averageScore || 0) - (a.averageScore || 0)
        );

        setSearchResults(sortedCandidates);
        setSearchSummary(data.answer.summary);
        onSearchResults(sortedCandidates);
      } else {
        setSearchResults([]);
        setSearchSummary(null);
        onSearchResults([]);
      }

      // Clear the file input
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again."
      );
      setSearchResults([]);
      setSearchSummary(null);
      onSearchResults([]);
    } finally {
      setIsUploading(false);
      setIsSearching(false);
    }
  };

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

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please upload a PDF or DOCX file only");
      }
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please upload a PDF or DOCX file only");
      }
    }
  };

  // Handle manual file upload click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
        {/* Enhanced Hero Section */}
        <HeroSection elevation={0}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Animated Icon */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                "& svg": {
                  fontSize: "2.5rem",
                  color: "white",
                  animation: "float 3s ease-in-out infinite",
                },
                "@keyframes float": {
                  "0%, 100%": {
                    transform: "translateY(0)",
                  },
                  "50%": {
                    transform: "translateY(-10px)",
                  },
                },
              }}
            >
              <AutoAwesome />
            </Box>

            {/* Enhanced Title */}
            <HeroTitle variant="h1">AI-Powered Resume Matching</HeroTitle>

            {/* Enhanced Subtitle */}
            <HeroSubtitle>
              Let our advanced AI find your perfect candidates. We analyze
              skills, experience, and potential matches using state-of-the-art
              language models to deliver precise results.
            </HeroSubtitle>

            <SearchOptionsContainer>
              {/* Enhanced Tabs */}
              <StyledTabs value={activeTab} onChange={handleTabChange} centered>
                <StyledTab
                  icon={<TextFields />}
                  label="Search by Text"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                />
                <StyledTab
                  icon={<Description />}
                  label="Upload JD"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                />
              </StyledTabs>

              {/* Search Input Area */}
              {activeTab === 0 ? (
                <Fade in timeout={500}>
                  <SearchContainer>
                    {/* Group Selection */}
                    <GroupSelectContainer>
                      <Select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        displayEmpty
                        renderValue={(value) => (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <FolderIcon
                              sx={{
                                fontSize: "20px",
                                color: AppColors.primary_ui_blue.p500,
                              }}
                            />
                            {value || "All Groups"}
                          </Box>
                        )}
                      >
                        <MenuItem value="">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <FolderIcon
                              sx={{
                                fontSize: "20px",
                                color: AppColors.primary_ui_blue.p500,
                              }}
                            />
                            All Groups
                          </Box>
                        </MenuItem>
                        {(groups || []).map((group) => (
                          <MenuItem key={group.name} value={group.name}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <FolderIcon
                                sx={{
                                  fontSize: "20px",
                                  color: AppColors.primary_ui_blue.p500,
                                }}
                              />
                              {group.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </GroupSelectContainer>

                    {/* Text Search Input */}
                    <StyledTextField
                      fullWidth
                      inputRef={searchInputRef}
                      placeholder="Describe your ideal candidate or paste job requirements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      variant="outlined"
                    />

                    {/* Search Button */}
                    <SearchButton
                      onClick={handleSearch}
                      disabled={
                        isSearching ||
                        !searchQuery.trim() ||
                        searchQuery.trim().length < 5
                      }
                      startIcon={
                        isSearching ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Search />
                        )
                      }
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </SearchButton>
                  </SearchContainer>
                </Fade>
              ) : (
                // Upload JD Interface
                <Box sx={{ maxWidth: "800px", mx: "auto" }}>
                  {/* Group Selection for Upload */}
                  <GroupSelectContainer
                    sx={{ mb: 3, width: "100%", minWidth: "600px" }}
                  >
                    <Select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      displayEmpty
                      fullWidth
                      renderValue={(value) => (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FolderIcon
                            sx={{
                              fontSize: "20px",
                              color: AppColors.primary_ui_blue.p500,
                            }}
                          />
                          {value || "All Groups"}
                        </Box>
                      )}
                    >
                      <MenuItem value="">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FolderIcon
                            sx={{
                              fontSize: "20px",
                              color: AppColors.primary_ui_blue.p500,
                            }}
                          />
                          All Groups
                        </Box>
                      </MenuItem>
                      {(groups || []).map((group) => (
                        <MenuItem key={group.name} value={group.name}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <FolderIcon
                              sx={{
                                fontSize: "20px",
                                color: AppColors.primary_ui_blue.p500,
                              }}
                            />
                            {group.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </GroupSelectContainer>

                  {/* Upload Area */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.docx"
                    style={{ display: "none" }}
                  />

                  <UploadArea
                    isDragging={isDragging}
                    onClick={handleUploadClick}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        position: "relative",
                        "&::after": isDragging
                          ? {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              borderRadius: 1,
                            }
                          : {},
                      }}
                    >
                      {selectedFile ? (
                        <>
                          <Description
                            sx={{
                              fontSize: "3rem",
                              color: isDragging
                                ? AppColors.primary.main
                                : AppColors.primary.main,
                              transition: "all 0.3s ease",
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              color: AppColors.text.primary,
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                            }}
                          >
                            {selectedFile.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isDragging
                                ? AppColors.primary.main
                                : AppColors.text.secondary,
                              transition: "all 0.3s ease",
                            }}
                          >
                            {isDragging
                              ? "Drop to replace file"
                              : "Click to change file"}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Upload
                            sx={{
                              fontSize: "3rem",
                              color: isDragging
                                ? AppColors.primary.main
                                : AppColors.text.secondary,
                              transition: "all 0.3s ease",
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              color: AppColors.text.primary,
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                            }}
                          >
                            {isDragging
                              ? "Drop your file here"
                              : "Drop your JD file here or click to browse"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isDragging
                                ? AppColors.primary.main
                                : AppColors.text.secondary,
                              transition: "all 0.3s ease",
                            }}
                          >
                            Supports PDF and DOCX files
                          </Typography>
                        </>
                      )}
                    </Box>
                  </UploadArea>

                  {/* Upload Button */}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <SearchButton
                      onClick={handleJDUpload}
                      disabled={isUploading || !selectedFile}
                      startIcon={
                        isUploading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Search />
                        )
                      }
                      sx={{
                        minWidth: "200px",
                        opacity: selectedFile ? 1 : 0.7,
                        border: "1px solidrgb(222, 228, 238)",
                        transform: selectedFile ? "scale(1)" : "scale(0.95)",
                        transition: "all 0.3s ease",
                        color: selectedFile ? "#000" : "#fff",
                        backgroundColor: selectedFile ? "#fff" : "#A78BFA",
                        "&:hover": {
                          backgroundColor: selectedFile ? "#fff" : "#9333EA",
                          transform: selectedFile
                            ? "translateY(-2px)"
                            : "scale(0.95)",
                        },
                      }}
                    >
                      {isUploading ? "Searching..." : "Search with JD"}
                    </SearchButton>
                  </Box>
                </Box>
              )}
            </SearchOptionsContainer>
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

        {/* Loading Skeletons - Show for both search types */}
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

        {/* Initial State - Show when no search has been performed */}
        {!hasSearched && !isSearching && (
          <Fade in timeout={500}>
            <InitialStateCard>
              <Typography
                variant="h4"
                sx={{
                  color: AppColors.text.primary,
                  fontWeight: 600,
                  textAlign: "center",
                  fontSize: "1.75rem",
                  mb: 2,
                  position: "relative",
                  fontFamily:
                    '"SF Pro Display", -apple-system, system-ui, sans-serif',
                  letterSpacing: "-0.02em",
                }}
              >
                Ready to Find Your Perfect Match?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: AppColors.text.secondary,
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.6,
                  fontSize: "1rem",
                  textAlign: "center",
                  position: "relative",
                  "& .emphasis": {
                    color: AppColors.primary.main,
                    fontWeight: 500,
                  },
                }}
              >
                Start by entering your desired{" "}
                <span className="emphasis">skills</span>,{" "}
                <span className="emphasis">experience</span>, or{" "}
                <span className="emphasis">job requirements</span> above to
                discover candidates that perfectly align with your needs.
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "20%",
                  background:
                    "linear-gradient(0deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </InitialStateCard>
          </Fade>
        )}

        {/* Search Results - Show for both search types */}
        {hasSearched && !isSearching && (
          <Fade in timeout={500}>
            <Card
              sx={{
                minHeight: 400,
                borderRadius: 3,
                backgroundColor: AppColors.background.paper,
                border: `1px solid ${AppColors.border.light}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
                  transform: "translateY(-2px)",
                },
                position: "relative",
                overflow: "visible",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {isSearching ? (
                  // Loading State
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "300px",
                      gap: 3,
                    }}
                  >
                    <CircularProgress
                      size={40}
                      sx={{ color: AppColors.primary.main }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: AppColors.text.secondary }}
                    >
                      Searching through resumes...
                    </Typography>
                  </Box>
                ) : searchResults.length > 0 ? (
                  // Results Found
                  <>
                    {/* Search Summary Section */}
                    {searchSummary && (
                      <Box
                        sx={{
                          mb: 4,
                          p: 3,
                          backgroundColor: `${AppColors.primary.main}08`,
                          borderRadius: 3,
                          border: `1px solid ${AppColors.primary.main}20`,
                          borderLeft: `4px solid ${AppColors.primary.main}`,
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 24px rgba(37, 99, 235, 0.15)",
                            transform: "translateY(-1px)",
                            borderColor: `${AppColors.primary.main}40`,
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: AppColors.primary.main,
                            fontWeight: 700,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            fontSize: "1.25rem",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          <AutoAwesome
                            sx={{
                              fontSize: "1.4rem",
                              filter:
                                "drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))",
                            }}
                          />
                          AI Analysis Summary
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: AppColors.text.primary,
                            lineHeight: 1.8,
                            fontSize: "1.05rem",
                            pl: 0.5,
                            "& strong": {
                              color: AppColors.primary.main,
                              fontWeight: 600,
                            },
                          }}
                        >
                          {searchSummary}
                        </Typography>
                      </Box>
                    )}

                    {/* Results Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                        pb: 3,
                        borderBottom: `1px solid ${AppColors.border.light}`,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: -1,
                          left: 0,
                          width: "15%",
                          height: "2px",
                          backgroundColor: AppColors.primary.main,
                          borderRadius: "2px",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <FilterList
                          sx={{
                            color: AppColors.primary.main,
                            fontSize: "1.75rem",
                            filter:
                              "drop-shadow(0 2px 4px rgba(37, 99, 235, 0.2))",
                          }}
                        />
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: AppColors.text.primary,
                            letterSpacing: "-0.02em",
                            fontSize: "1.75rem",
                          }}
                        >
                          Search Results
                          {selectedGroup && (
                            <Typography
                              component="span"
                              variant="h6"
                              sx={{
                                ml: 1.5,
                                fontWeight: 500,
                                color: AppColors.text.secondary,
                                fontSize: "1.1rem",
                                backgroundColor: `${AppColors.primary.main}10`,
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <FolderIcon
                                sx={{
                                  fontSize: "1.1rem",
                                  color: AppColors.primary.main,
                                }}
                              />
                              {selectedGroup}
                            </Typography>
                          )}
                        </Typography>
                        <MatchScoreChip
                          label={`${searchResults.length} candidate${
                            searchResults.length === 1 ? "" : "s"
                          } found`}
                          size="small"
                          sx={{
                            ml: 2,
                            backgroundColor: `${AppColors.success.main}15`,
                            color: AppColors.success.main,
                            border: `1px solid ${AppColors.success.main}30`,
                            fontWeight: 600,
                            px: 2,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Results Grid */}
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      {searchResults.map((candidate, index) => (
                        <Zoom
                          in
                          timeout={300 + index * 100}
                          key={candidate.id || index}
                        >
                          <ResultCard>
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
                                  {/* Score Label */}
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
                                    {candidate.clarityScore ||
                                    candidate.experienceScore ||
                                    candidate.loyaltyScore ||
                                    candidate.reputationScore
                                      ? "Overall Score"
                                      : "No Score Available"}
                                  </ScoreLabel>
                                  <ScoreBadge
                                    score={candidate.averageScore || 0}
                                  >
                                    {candidate.clarityScore ||
                                    candidate.experienceScore ||
                                    candidate.loyaltyScore ||
                                    candidate.reputationScore ? (
                                      <>
                                        {(candidate.averageScore || 0).toFixed(
                                          1
                                        )}
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
                                      </>
                                    ) : (
                                      "N/A"
                                    )}
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
                                    {candidate.clarityScore ||
                                    candidate.experienceScore ||
                                    candidate.loyaltyScore ||
                                    candidate.reputationScore
                                      ? "Performance Metrics"
                                      : "Performance Metrics Not Available"}
                                  </Typography>

                                  {candidate.clarityScore ||
                                  candidate.experienceScore ||
                                  candidate.loyaltyScore ||
                                  candidate.reputationScore ? (
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
                                  ) : (
                                    <Box
                                      sx={{
                                        textAlign: "center",
                                        py: 4,
                                        color: AppColors.text.secondary,
                                        backgroundColor:
                                          "rgba(255, 255, 255, 0.03)",
                                        borderRadius: 2,
                                        border:
                                          "1px solid rgba(255, 255, 255, 0.1)",
                                      }}
                                    >
                                      <Typography variant="body1">
                                        Performance metrics are not available
                                        for this candidate.
                                      </Typography>
                                    </Box>
                                  )}
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
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    mt: 4,
                                    pt: 3,
                                    borderTop: `1px solid ${AppColors.border.light}`,
                                    position: "relative",
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      top: -1,
                                      right: 0,
                                      width: "30%",
                                      height: "2px",
                                      background:
                                        "linear-gradient(90deg, transparent, #3b82f6)",
                                      borderRadius: "2px",
                                    },
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    startIcon={<Download />}
                                    onClick={async () => {
                                      try {
                                        const originalFilename =
                                          candidate.filename || candidate.id;
                                        if (!originalFilename) {
                                          throw new Error(
                                            "Filename not available for download"
                                          );
                                        }
                                        const downloadUrl = `${API_CONFIG.baseURL}/uploads/${originalFilename}`;

                                        // Fetch the file
                                        const response = await fetch(
                                          downloadUrl
                                        );
                                        if (!response.ok)
                                          throw new Error("Download failed");

                                        // Get the blob from response
                                        const blob = await response.blob();

                                        // Create a temporary URL for the blob
                                        const url =
                                          window.URL.createObjectURL(blob);

                                        // Create a temporary link element
                                        const link =
                                          document.createElement("a");
                                        link.href = url;
                                        link.download = originalFilename; // Set the download filename

                                        // Append to document, click, and cleanup
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                      } catch (error) {
                                        console.error(
                                          "Error downloading CV:",
                                          error
                                        );
                                        alert(
                                          "Failed to download CV. Please try again."
                                        );
                                      }
                                    }}
                                    sx={{
                                      borderColor: AppColors.primary.main,
                                      color: AppColors.primary.main,
                                      backgroundColor: `${AppColors.primary.main}08`,
                                      "&:hover": {
                                        backgroundColor: `${AppColors.primary.main}15`,
                                        borderColor: AppColors.primary.main,
                                        transform: "translateY(-1px)",
                                      },
                                      textTransform: "none",
                                      fontWeight: 600,
                                      px: 3,
                                      py: 1,
                                      borderRadius: "12px",
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    Download CV
                                  </Button>
                                  <Button
                                    variant="contained"
                                    startIcon={<Visibility />}
                                    onClick={() => {
                                      try {
                                        const originalFilename =
                                          candidate.filename || candidate.id;
                                        if (!originalFilename) {
                                          throw new Error(
                                            "Filename not available for viewing"
                                          );
                                        }
                                        const viewUrl = `${API_CONFIG.baseURL}/uploads/${originalFilename}`;
                                        window.open(viewUrl, "_blank");
                                      } catch (error) {
                                        console.error(
                                          "Error viewing CV:",
                                          error
                                        );
                                        alert(
                                          "Failed to view CV. Please try again."
                                        );
                                      }
                                    }}
                                    sx={{
                                      backgroundColor: AppColors.primary.main,
                                      color: "white",
                                      "&:hover": {
                                        backgroundColor: AppColors.primary.dark,
                                        transform: "translateY(-1px)",
                                      },
                                      textTransform: "none",
                                      fontWeight: 600,
                                      px: 3,
                                      py: 1,
                                      borderRadius: "12px",
                                      transition: "all 0.2s ease",
                                      boxShadow:
                                        "0 4px 12px rgba(37, 99, 235, 0.2)",
                                    }}
                                  >
                                    View Resume
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
                  // No Results Found
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
                        backgroundColor: AppColors.background.elevated,
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
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: `${AppColors.primary.main}08`,
                          borderColor: AppColors.primary.main,
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
      </Container>
    </Box>
  );
};

export default ResumeSearch;
