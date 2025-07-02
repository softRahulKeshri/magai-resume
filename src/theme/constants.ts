/**
 * Theme Constants for ResumeAI Resume Platform
 * Centralized configuration for colors, spacing, and other design tokens
 */

// Brand Colors
export const BRAND_COLORS = {
  primary: {
    blue: "#2563EB",
    blueLight: "#60A5FA",
    blueDark: "#1e40af",
  },
  accent: {
    red: "#DC2626",
    redLight: "#F87171",
    redDark: "#b91c1c",
  },
  neutral: {
    black: "#000000",
    darkGray: "#1a1a1a",
    white: "#FFFFFF",
    whiteAlpha: {
      5: "rgba(255, 255, 255, 0.05)",
      8: "rgba(255, 255, 255, 0.08)",
      10: "rgba(255, 255, 255, 0.1)",
      15: "rgba(255, 255, 255, 0.15)",
      20: "rgba(255, 255, 255, 0.2)",
      25: "rgba(255, 255, 255, 0.25)",
      30: "rgba(255, 255, 255, 0.3)",
      40: "rgba(255, 255, 255, 0.4)",
      50: "rgba(255, 255, 255, 0.5)",
      60: "rgba(255, 255, 255, 0.6)",
      70: "rgba(255, 255, 255, 0.7)",
      80: "rgba(255, 255, 255, 0.8)",
      90: "rgba(255, 255, 255, 0.9)",
    },
    blackAlpha: {
      30: "rgba(0, 0, 0, 0.3)",
      40: "rgba(0, 0, 0, 0.4)",
      50: "rgba(0, 0, 0, 0.5)",
      70: "rgba(0, 0, 0, 0.7)",
      80: "rgba(0, 0, 0, 0.8)",
      90: "rgba(0, 0, 0, 0.9)",
    },
  },
} as const;

// Breakpoints
export const BREAKPOINTS = {
  mobile: "600px",
  tablet: "900px",
  desktop: "1200px",
} as const;

// Spacing Scale
export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "3rem",
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const;

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:5001/api",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Debug logging for API configuration (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("API Configuration:", {
    baseURL: API_CONFIG.baseURL,
    envVariable: process.env.REACT_APP_API_URL,
    defaultURL: "http://127.0.0.1:5001/api",
    fullUploadURL: `${API_CONFIG.baseURL}/upload_cv`,
  });
}

// File Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf", // PDF only as per UI requirements
  ],
  maxFiles: 50,
} as const;
