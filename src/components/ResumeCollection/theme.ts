import { LightTheme, ColorTheme } from "./types";

// Brand theme colors for premium, elegant look
export const lightTheme: LightTheme = {
  background: "#FFFFFF", // n_white
  surface: "#F5F5F5", // n100
  surfaceLight: "#EAEAEC", // n150
  primary: "#3077F3", // brand blue
  success: "#41E6F8", // brand cyan
  warning: "#FDA052", // brand orange
  error: "#B96AF7", // brand purple
  text: "#050507", // n_black
  textSecondary: "#2E3141", // primary charcoal_slate
  textMuted: "#6D6F7A", // n700
  border: "#D5D6D9", // n200
};

// Brand color palette for groups with premium gradients
export const colorPalette: ColorTheme[] = [
  {
    primary: "#3077F3", // Brand blue
    secondary: "#94BAFD",
    gradient: "linear-gradient(135deg, #3077F3 0%, #94BAFD 100%)",
    shadowColor: "rgba(48, 119, 243, 0.15)",
    hoverShadowColor: "rgba(48, 119, 243, 0.25)",
    background: "#FFFFFF",
    border: "#3077F3",
  },
  {
    primary: "#41E6F8", // Brand cyan
    secondary: "#94BAFD",
    gradient: "linear-gradient(135deg, #41E6F8 0%, #94BAFD 100%)",
    shadowColor: "rgba(65, 230, 248, 0.15)",
    hoverShadowColor: "rgba(65, 230, 248, 0.25)",
    background: "#FFFFFF",
    border: "#41E6F8",
  },
  {
    primary: "#B96AF7", // Brand purple
    secondary: "#FDA052",
    gradient: "linear-gradient(135deg, #B96AF7 0%, #FDA052 100%)",
    shadowColor: "rgba(185, 106, 247, 0.15)",
    hoverShadowColor: "rgba(185, 106, 247, 0.25)",
    background: "#FFFFFF",
    border: "#B96AF7",
  },
  {
    primary: "#FDA052", // Brand orange
    secondary: "#B96AF7",
    gradient: "linear-gradient(135deg, #FDA052 0%, #B96AF7 100%)",
    shadowColor: "rgba(253, 160, 82, 0.15)",
    hoverShadowColor: "rgba(253, 160, 82, 0.25)",
    background: "#FFFFFF",
    border: "#FDA052",
  },
  {
    primary: "#2E3141", // Charcoal slate
    secondary: "#6D6F7A",
    gradient: "linear-gradient(135deg, #2E3141 0%, #6D6F7A 100%)",
    shadowColor: "rgba(46, 49, 65, 0.15)",
    hoverShadowColor: "rgba(46, 49, 65, 0.25)",
    background: "#FFFFFF",
    border: "#2E3141",
  },
  {
    primary: "#11397E", // Primary UI blue p700
    secondary: "#3077F3",
    gradient: "linear-gradient(135deg, #11397E 0%, #3077F3 100%)",
    shadowColor: "rgba(17, 57, 126, 0.15)",
    hoverShadowColor: "rgba(17, 57, 126, 0.25)",
    background: "#FFFFFF",
    border: "#11397E",
  },
];

// Group to color palette index mapping
export const groupColorIndex: { [key: string]: number } = {
  frontend: 0, // Blue
  backend: 1, // Cyan
  fullstack: 2, // Purple
  general: 3, // Orange
  mobile: 4, // Gray
  devops: 5, // Light Gray
  design: 2, // Purple
  default: 5, // Light Gray
};

// Helper function to get color theme for a group
export const getGroupColorTheme = (
  groupName: string = "default"
): ColorTheme => {
  const index =
    groupColorIndex[groupName.toLowerCase()] ?? groupColorIndex.default;
  return colorPalette[index];
};
