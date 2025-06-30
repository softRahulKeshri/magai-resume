import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App";

// Theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1877F2",
      light: "#42A5F5",
      dark: "#1565C0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#E50914",
      light: "#FF5722",
      dark: "#C62828",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0A0A0A",
      paper: "#181818",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B3B3B3",
      disabled: "#666666",
    },
    success: {
      main: "#00D924",
      light: "#4CAF50",
      dark: "#2E7D32",
      contrastText: "#000000",
    },
    warning: {
      main: "#FF9500",
      light: "#FFB74D",
      dark: "#F57C00",
      contrastText: "#000000",
    },
    error: {
      main: "#FF453A",
      light: "#EF5350",
      dark: "#C62828",
      contrastText: "#ffffff",
    },
    info: {
      main: "#007AFF",
      light: "#42A5F5",
      dark: "#1976D2",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      '"SF Pro Display", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "3.5rem",
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.75rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.875rem",
      lineHeight: 1.3,
      letterSpacing: "-0.005em",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      fontSize: "0.95rem",
      letterSpacing: "0.01em",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      fontWeight: 500,
      color: "#B3B3B3",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: "#333333 #0A0A0A",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0A0A0A",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#333333",
            borderRadius: "4px",
            "&:hover": {
              background: "#444444",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: "12px 28px",
          fontSize: "0.95rem",
          fontWeight: 600,
          textTransform: "none",
        },
        contained: {
          boxShadow: "0 4px 14px 0 rgba(24, 119, 242, 0.25)",
        },
        outlined: {
          borderColor: "#333333",
          color: "#FFFFFF",
          "&:hover": {
            borderColor: "#1877F2",
            background: "rgba(24, 119, 242, 0.08)",
          },
        },
        text: {
          color: "#B3B3B3",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.04)",
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "#181818",
          border: "1px solid #222222",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          background: "#181818",
          border: "1px solid #222222",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            background: "#1E1E1E",
            "& fieldset": {
              borderColor: "#333333",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: "#1877F2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1877F2",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#B3B3B3",
            "&.Mui-focused": {
              color: "#1877F2",
            },
          },
          "& .MuiOutlinedInput-input": {
            color: "#FFFFFF",
            "&::placeholder": {
              color: "#666666",
              opacity: 1,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          background: "#1E1E1E",
          color: "#FFFFFF",
          border: "1px solid #333333",
        },
        colorPrimary: {
          background: "rgba(24, 119, 242, 0.15)",
          color: "#42A5F5",
          border: "1px solid rgba(24, 119, 242, 0.3)",
        },
        colorSecondary: {
          background: "rgba(229, 9, 20, 0.15)",
          color: "#FF5722",
          border: "1px solid rgba(229, 9, 20, 0.3)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid",
        },
        standardSuccess: {
          background: "rgba(0, 217, 36, 0.1)",
          color: "#4CAF50",
          borderColor: "rgba(0, 217, 36, 0.3)",
        },
        standardError: {
          background: "rgba(255, 69, 58, 0.1)",
          color: "#FF453A",
          borderColor: "rgba(255, 69, 58, 0.3)",
        },
        standardWarning: {
          background: "rgba(255, 149, 0, 0.1)",
          color: "#FF9500",
          borderColor: "rgba(255, 149, 0, 0.3)",
        },
        standardInfo: {
          background: "rgba(0, 122, 255, 0.1)",
          color: "#007AFF",
          borderColor: "rgba(0, 122, 255, 0.3)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          background: "#181818",
          border: "1px solid #333333",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(10, 10, 10, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #222222",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          background: "#1877F2",
          height: 3,
          borderRadius: "2px 2px 0 0",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          color: "#B3B3B3",
          "&.Mui-selected": {
            color: "#FFFFFF",
          },
          "&:hover": {
            color: "#FFFFFF",
            background: "rgba(255, 255, 255, 0.04)",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          margin: "2px 0",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.04)",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#222222",
        },
      },
    },
  },
  spacing: 8,
});

// Create root element
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Render application
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
