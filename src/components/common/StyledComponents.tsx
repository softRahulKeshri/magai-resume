import {
  styled,
  Box,
  Paper,
  Button,
  Typography,
  Container,
} from "@mui/material";
import {
  BRAND_COLORS,
  SHADOWS,
  ANIMATION_DURATION,
  BLUR,
  Z_INDEX,
} from "../../theme/constants";
import { animations } from "../../theme/animations";

// Layout Components
export const FlexContainer = styled(Box)<{
  direction?: "row" | "column";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  gap?: number;
  wrap?: boolean;
}>(
  ({
    direction = "row",
    justify = "flex-start",
    align = "center",
    gap = 0,
    wrap = false,
  }) => ({
    display: "flex",
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    gap: gap ? `${gap}rem` : 0,
    flexWrap: wrap ? "wrap" : "nowrap",
  })
);

export const CenteredContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: theme.spacing(3),
  position: "relative",
  zIndex: Z_INDEX.content,
}));

// Glass Effect Components
export const GlassCard = styled(Paper)<{
  intensity?: "light" | "medium" | "strong";
}>(({ intensity = "medium" }) => ({
  background:
    intensity === "light"
      ? BRAND_COLORS.neutral.whiteAlpha[10]
      : intensity === "medium"
      ? BRAND_COLORS.neutral.whiteAlpha[15]
      : BRAND_COLORS.neutral.whiteAlpha[20],
  backdropFilter:
    intensity === "light"
      ? BLUR.sm
      : intensity === "medium"
      ? BLUR.md
      : BLUR.lg,
  border: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
  borderRadius: "16px",
  padding: "2rem",
  transition: `all ${ANIMATION_DURATION.normal} ease`,
  position: "relative",
  overflow: "hidden",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: SHADOWS.lg,
    background:
      intensity === "light"
        ? BRAND_COLORS.neutral.whiteAlpha[15]
        : intensity === "medium"
        ? BRAND_COLORS.neutral.whiteAlpha[20]
        : BRAND_COLORS.neutral.whiteAlpha[25],
  },

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${BRAND_COLORS.neutral.whiteAlpha[10]} 0%, transparent 50%, ${BRAND_COLORS.neutral.whiteAlpha[10]} 100%)`,
    pointerEvents: "none",
    zIndex: -1,
  },
}));

// Button Components
export const GradientButton = styled(Button)<{
  gradientVariant?: "primary" | "secondary";
}>(({ gradientVariant = "primary", ...props }) => ({
  background:
    gradientVariant === "primary"
      ? `linear-gradient(135deg, ${BRAND_COLORS.primary.blue} 0%, ${BRAND_COLORS.primary.blueDark} 100%)`
      : `linear-gradient(135deg, ${BRAND_COLORS.accent.red} 0%, ${BRAND_COLORS.accent.redDark} 100%)`,
  color: BRAND_COLORS.neutral.white,
  border: "none",
  borderRadius: "12px",
  padding: "12px 24px",
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  position: "relative",
  overflow: "hidden",
  transition: `all ${ANIMATION_DURATION.normal} ease`,
  boxShadow:
    gradientVariant === "primary" ? SHADOWS.glow.blue : SHADOWS.glow.red,

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: `linear-gradient(90deg, transparent, ${BRAND_COLORS.neutral.whiteAlpha[20]}, transparent)`,
    transition: `left ${ANIMATION_DURATION.slow} ease`,
  },

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      gradientVariant === "primary"
        ? `0 8px 32px ${BRAND_COLORS.primary.blue}80`
        : `0 8px 32px ${BRAND_COLORS.accent.red}80`,

    "&::before": {
      left: "100%",
    },
  },

  "&:active": {
    transform: "translateY(0)",
  },

  "&:disabled": {
    background: BRAND_COLORS.neutral.blackAlpha[50],
    color: BRAND_COLORS.neutral.whiteAlpha[50],
    transform: "none",
    boxShadow: "none",
  },
}));

export const IconButton = styled(Button)(({ theme }) => ({
  minWidth: "48px",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: BRAND_COLORS.neutral.whiteAlpha[10],
  backdropFilter: BLUR.sm,
  border: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
  color: BRAND_COLORS.neutral.white,
  transition: `all ${ANIMATION_DURATION.normal} ease`,

  "&:hover": {
    background: BRAND_COLORS.neutral.whiteAlpha[20],
    transform: "scale(1.1)",
    boxShadow: SHADOWS.md,
  },

  "&:active": {
    transform: "scale(0.95)",
  },
}));

// Typography Components
export const GradientText = styled(Typography)<{
  gradientVariant?: "primary" | "secondary";
}>(({ gradientVariant = "primary" }) => ({
  background:
    gradientVariant === "primary"
      ? `linear-gradient(135deg, ${BRAND_COLORS.primary.blue} 0%, ${BRAND_COLORS.primary.blueLight} 100%)`
      : `linear-gradient(135deg, ${BRAND_COLORS.accent.red} 0%, ${BRAND_COLORS.accent.redLight} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 700,
  position: "relative",

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "inherit",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    filter: "blur(20px)",
    opacity: 0.5,
    zIndex: -1,
  },
}));

export const AnimatedText = styled(Typography)<{ delay?: number }>(
  ({ delay = 0 }) => ({
    animation: `${animations.slideUp} ${ANIMATION_DURATION.slow} ease-out ${delay}s both`,
  })
);

// Loading Components
export const LoadingSpinner = styled(Box)<{
  size?: "small" | "medium" | "large";
}>(({ size = "medium" }) => {
  const sizeMap = { small: "24px", medium: "40px", large: "60px" };
  const spinnerSize = sizeMap[size];

  return {
    width: spinnerSize,
    height: spinnerSize,
    border: `4px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
    borderTop: `4px solid ${BRAND_COLORS.primary.blue}`,
    borderRadius: "50%",
    animation: `${animations.spin} 1s linear infinite`,
    margin: "0 auto",
  };
});

export const PulsingDot = styled(Box)<{
  color?: "primary" | "secondary";
  delay?: number;
}>(({ color = "primary", delay = 0 }) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor:
    color === "primary" ? BRAND_COLORS.primary.blue : BRAND_COLORS.accent.red,
  animation: `${animations.subtlePulse} 2s ease-in-out infinite ${delay}s`,
}));

// Particle and Background Components
export const ParticleContainer = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: Z_INDEX.particles,
  overflow: "hidden",
}));

export const FloatingParticle = styled(Box)<{
  size?: number;
  duration?: number;
  delay?: number;
  color?: string;
}>(
  ({
    size = 8,
    duration = 20,
    delay = 0,
    color = BRAND_COLORS.primary.blue,
  }) => ({
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, ${color}80 0%, ${color}40 50%, transparent 100%)`,
    borderRadius: "50%",
    animation: `${animations.floatingAnimation} ${duration}s linear infinite ${delay}s`,
    filter: "blur(1px)",
    opacity: 0.6,
  })
);

// Form Components
export const StyledInput = styled("input")(({ theme }) => ({
  width: "100%",
  padding: "12px 16px",
  background: BRAND_COLORS.neutral.whiteAlpha[10],
  border: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
  borderRadius: "8px",
  color: BRAND_COLORS.neutral.white,
  fontSize: "1rem",
  backdropFilter: BLUR.sm,
  transition: `all ${ANIMATION_DURATION.normal} ease`,

  "&::placeholder": {
    color: BRAND_COLORS.neutral.whiteAlpha[70],
  },

  "&:focus": {
    outline: "none",
    borderColor: BRAND_COLORS.primary.blue,
    boxShadow: `0 0 0 2px ${BRAND_COLORS.primary.blue}40`,
    background: BRAND_COLORS.neutral.whiteAlpha[15],
  },

  "&:hover": {
    borderColor: BRAND_COLORS.neutral.whiteAlpha[40],
  },
}));

// Card Components
export const HoverCard = styled(GlassCard)(() => ({
  cursor: "pointer",
  transition: `all ${ANIMATION_DURATION.normal} ease`,

  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: SHADOWS.xl,
  },
}));

export const StatCard = styled(GlassCard)<{ accentColor?: string }>(
  ({ accentColor = BRAND_COLORS.primary.blue }) => ({
    textAlign: "center",
    position: "relative",

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "60px",
      height: "3px",
      background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
      borderRadius: "0 0 3px 3px",
    },
  })
);

// Utility Components
export const Divider = styled(Box)<{
  orientation?: "horizontal" | "vertical";
  margin?: number;
}>(({ orientation = "horizontal", margin = 1 }) => ({
  background: `linear-gradient(${
    orientation === "horizontal" ? "90deg" : "0deg"
  }, transparent, ${BRAND_COLORS.neutral.whiteAlpha[20]}, transparent)`,
  height: orientation === "horizontal" ? "1px" : "100%",
  width: orientation === "horizontal" ? "100%" : "1px",
  margin: `${margin}rem 0`,
}));

export const Badge = styled(Box)<{
  variant?: "success" | "error" | "warning" | "info";
}>(({ variant = "info" }) => {
  const colorMap = {
    success: "#10B981",
    error: BRAND_COLORS.accent.red,
    warning: "#F59E0B",
    info: BRAND_COLORS.primary.blue,
  };

  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 600,
    background: `${colorMap[variant]}20`,
    color: colorMap[variant],
    border: `1px solid ${colorMap[variant]}40`,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };
});
