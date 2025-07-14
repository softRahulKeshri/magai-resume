import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import { InsertDriveFile } from "@mui/icons-material";
import { lightTheme } from "./theme";

/**
 * Enhanced Loading State Component
 */
const LoadingState = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 12,
      }}
    >
      <Card
        sx={{
          textAlign: "center",
          py: 8,
          px: 6,
          maxWidth: 500,
          background: `linear-gradient(135deg, ${
            lightTheme.surface
          } 0%, ${alpha(lightTheme.surfaceLight, 0.9)} 100%)`,
          border: `1px solid ${alpha(lightTheme.primary, 0.2)}`,
          borderRadius: "24px",
          boxShadow: `0 20px 60px ${alpha(lightTheme.background, 0.4)}`,
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 30% 40%, ${alpha(
              lightTheme.primary,
              0.1
            )} 0%, transparent 70%), radial-gradient(circle at 70% 60%, ${alpha(
              lightTheme.success,
              0.1
            )} 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              position: "relative",
              mb: 4,
              mx: "auto",
              width: "fit-content",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `conic-gradient(${lightTheme.primary} 0deg, ${lightTheme.success} 120deg, ${lightTheme.warning} 240deg, ${lightTheme.primary} 360deg)`,
                animation: "spin 2s linear infinite",
                mx: "auto",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: lightTheme.surface,
                },
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": {
                    transform: "translate(-50%, -50%) scale(1)",
                    opacity: 1,
                  },
                  "50%": {
                    transform: "translate(-50%, -50%) scale(1.1)",
                    opacity: 0.8,
                  },
                },
              }}
            >
              <InsertDriveFile
                sx={{ fontSize: "2rem", color: lightTheme.primary }}
              />
            </Box>
          </Box>

          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${lightTheme.text} 0%, ${lightTheme.textSecondary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Loading Your Resumes
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: lightTheme.textSecondary,
              mb: 3,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            Please wait while we fetch your resume collection...
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: lightTheme.primary,
                  animation: `bounce 1.4s ease-in-out ${
                    i * 0.16
                  }s infinite both`,
                  "@keyframes bounce": {
                    "0%, 80%, 100%": {
                      transform: "scale(0.8)",
                      opacity: 0.5,
                    },
                    "40%": {
                      transform: "scale(1.2)",
                      opacity: 1,
                    },
                  },
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoadingState; 