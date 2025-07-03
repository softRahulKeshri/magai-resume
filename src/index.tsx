import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App";

// Color palette
const brand_gradient = {
  orange: "#FDA052",
  purple: "#B96AF7",
  blue: "#3077F3",
  cyan: "#41E6F8",
};

const primary = {
  charcoal_slate: "#2E3141",
};

const neutral_palette = {
  n_black: "#050507",
  n3000: "#171921",
  n2000: "#20222E",
  n1000: "#2E3141",
  n900: "#434654",
  n800: "#585A67",
  n700: "#6D6F7A",
  n600: "#82838D",
  n500: "#9698A0",
  n400: "#ABADB3",
  n300: "#C0C1C6",
  n200: "#D5D6D9",
  n150: "#EAEAEC",
  n100: "#F5F5F5",
  n_white: "#FFFFFF",
};

const primary_ui_blue = {
  p700: "#11397E",
  p600: "#1E50A8",
  p500: "#3077F3",
  p400: "#94BAFD",
  p300: "#BFD6FF",
  p200: "#E3EDFF",
  p100: "#EFF5FF",
};

// Theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primary_ui_blue.p500,
      light: primary_ui_blue.p300,
      dark: primary_ui_blue.p700,
      contrastText: neutral_palette.n_white,
    },
    secondary: {
      main: brand_gradient.orange,
      light: "#FFB74D",
      dark: "#F57C00",
      contrastText: neutral_palette.n_white,
    },
    background: {
      default: neutral_palette.n100,
      paper: neutral_palette.n_white,
    },
    text: {
      primary: primary.charcoal_slate,
      secondary: neutral_palette.n700,
      disabled: neutral_palette.n500,
    },
    success: {
      main: "#00D924",
      light: "#4CAF50",
      dark: "#2E7D32",
      contrastText: neutral_palette.n_black,
    },
    warning: {
      main: "#FF9500",
      light: "#FFB74D",
      dark: "#F57C00",
      contrastText: neutral_palette.n_black,
    },
    error: {
      main: "#FF453A",
      light: "#EF5350",
      dark: "#C62828",
      contrastText: neutral_palette.n_white,
    },
    info: {
      main: primary_ui_blue.p500,
      light: primary_ui_blue.p300,
      dark: primary_ui_blue.p700,
      contrastText: neutral_palette.n_white,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: `${neutral_palette.n300} ${neutral_palette.n100}`,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: neutral_palette.n100,
          },
          "&::-webkit-scrollbar-thumb": {
            background: neutral_palette.n300,
            borderRadius: "4px",
            "&:hover": {
              background: neutral_palette.n400,
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
          boxShadow: `0 4px 14px 0 ${primary_ui_blue.p100}`,
        },
        outlined: {
          borderColor: neutral_palette.n200,
          color: primary.charcoal_slate,
          "&:hover": {
            borderColor: primary_ui_blue.p500,
            background: primary_ui_blue.p100,
          },
        },
        text: {
          color: neutral_palette.n700,
          "&:hover": {
            background: neutral_palette.n100,
            color: primary.charcoal_slate,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: neutral_palette.n_white,
          border: `1px solid ${neutral_palette.n150}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          background: neutral_palette.n_white,
          border: `1px solid ${neutral_palette.n150}`,
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
          background: primary_ui_blue.p100,
          color: primary_ui_blue.p500,
          borderColor: primary_ui_blue.p200,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          background: neutral_palette.n_white,
          border: `1px solid ${neutral_palette.n150}`,
          boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `rgba(${neutral_palette.n_white}, 0.8)`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${neutral_palette.n150}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          background: primary_ui_blue.p500,
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
          color: neutral_palette.n700,
          "&.Mui-selected": {
            color: primary_ui_blue.p500,
          },
          "&:hover": {
            color: primary.charcoal_slate,
            background: neutral_palette.n100,
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
            background: neutral_palette.n100,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: neutral_palette.n150,
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
