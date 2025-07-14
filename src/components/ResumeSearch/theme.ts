import { styled } from "@mui/material/styles";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  Tabs,
  Tab,
  Chip,
  Alert,
  Card,
} from "@mui/material";

// Dark theme color palette for the entire application
export const AppColors = {
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
export const HeroSection = styled(Paper)(({ theme }) => ({
  background: "#8B5CF6", // Solid purple background
  color: "#FFFFFF",
  padding: theme.spacing(8, 4),
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(4),
  position: "relative",
  textAlign: "center",
}));

// Simplified title styling
export const HeroTitle = styled(Typography)`
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  font-family: "SF Pro Display", -apple-system, system-ui, sans-serif;
`;

// Simplified subtitle styling
export const HeroSubtitle = styled(Typography)`
  font-size: 1.125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

// Enhanced search container for full width
export const SearchContainer = styled(Box)(({ theme }) => ({
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
export const StyledTabs = styled(Tabs)(({ theme }) => ({
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

export const StyledTab = styled(Tab)(({ theme }) => ({
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

export const SearchOptionsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

// Update the GroupSelectContainer for better contrast
export const GroupSelectContainer = styled(FormControl)(({ theme }) => ({
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
export const StyledTextField = styled(TextField)(({ theme }) => ({
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
export const SearchButton = styled(Button)(({ theme }) => ({
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

export const UploadButton = styled(Button)(({ theme }) => ({
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

export const ControlsSection = styled(Box)(({ theme }) => ({
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

export const MatchScoreChip = styled(Chip)(({ theme }) => ({
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
export const ScoreBadge = styled(Box)<{ score: number }>(({ theme, score }) => {
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
export const ScoreMetricsSection = styled(Box)(({ theme }) => ({
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

export const ScoreMetricsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const ScoreMetricItem = styled(Box)<{ score: number }>(
  ({ theme, score }) => {
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
  }
);

export const ScoreLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  fontWeight: 600,
  color: AppColors.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: theme.spacing(0.5),
}));

// Enhanced Result Card styling
export const ResultCard = styled(Card)(({ theme }) => ({
  position: "relative",
  borderRadius: 16,
  backgroundColor: AppColors.background.paper,
  border: `1px solid ${AppColors.border.light}`,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  overflow: "visible",
  // Removed hover border and shadow for a cleaner, less clickable look
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${AppColors.secondary.main}`,
  backgroundColor: AppColors.background.paper,
  color: AppColors.text.primary,
  "& .MuiAlert-icon": {
    color: AppColors.secondary.main,
  },
}));

export const InitialStateCard = styled(Card)(({ theme }) => ({
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

export const CircleIcon = styled(Box)(({ theme }) => ({
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
export const UploadArea = styled(Box)<{ isDragging?: boolean }>(
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
