import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  alpha,
} from "@mui/material";
import { FolderOpen, Close } from "@mui/icons-material";
import { lightTheme, colorPalette } from "./theme";

interface EmptyStateProps {
  selectedGroup: string | null;
  searchQuery: string;
  clearAllFilters: () => void;
}

/**
 * Empty State Component
 */
const EmptyState = ({
  selectedGroup,
  searchQuery,
  clearAllFilters,
}: EmptyStateProps) => {
  const hasFilters = selectedGroup || searchQuery.trim();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { xs: 8, sm: 12 },
      }}
    >
      <Card
        sx={{
          textAlign: "center",
          py: { xs: 6, sm: 8 },
          px: { xs: 4, sm: 6 },
          maxWidth: 500,
          width: "100%",
          background: `linear-gradient(135deg, ${
            lightTheme.surface
          } 0%, ${alpha(lightTheme.surfaceLight, 0.9)} 100%)`,
          border: `1px solid ${alpha(lightTheme.border, 0.3)}`,
          borderRadius: { xs: "20px", sm: "24px" },
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
            background: `radial-gradient(circle at 20% 20%, ${alpha(
              lightTheme.textMuted,
              0.05
            )} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${alpha(
              lightTheme.textMuted,
              0.05
            )} 0%, transparent 50%)`,
            pointerEvents: "none",
          },
        }}
      >
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              position: "relative",
              mb: { xs: 3, sm: 4 },
              mx: "auto",
              width: "fit-content",
            }}
          >
            <Box
              sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${alpha(
                  lightTheme.textMuted,
                  0.1
                )} 0%, ${alpha(lightTheme.textMuted, 0.2)} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                border: `2px dashed ${alpha(lightTheme.textMuted, 0.3)}`,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  borderRadius: "50%",
                  border: `1px solid ${alpha(lightTheme.textMuted, 0.1)}`,
                  animation: "pulse 2s ease-in-out infinite",
                },
                "@keyframes pulse": {
                  "0%, 100%": {
                    transform: "scale(1)",
                    opacity: 0.3,
                  },
                  "50%": {
                    transform: "scale(1.05)",
                    opacity: 0.6,
                  },
                },
              }}
            >
              <FolderOpen
                sx={{
                  fontSize: { xs: "2.75rem", sm: "3.5rem" },
                  color: lightTheme.textMuted,
                  opacity: 0.8,
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${lightTheme.text} 0%, ${lightTheme.textSecondary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
            }}
          >
            {selectedGroup && searchQuery.trim()
              ? `No ${selectedGroup} resumes found`
              : selectedGroup
              ? `No ${selectedGroup} resumes found`
              : searchQuery.trim()
              ? "No resumes found"
              : "No resumes uploaded yet"}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: lightTheme.textSecondary,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              lineHeight: 1.6,
              mb: { xs: 3, sm: 4 },
              maxWidth: 400,
              mx: "auto",
            }}
          >
            {selectedGroup && searchQuery.trim()
              ? "Try adjusting your search criteria or select a different group to find what you're looking for."
              : selectedGroup
              ? "No resumes found in this group. Try selecting a different technology stack."
              : searchQuery.trim()
              ? "Try adjusting your search criteria or browse all resumes."
              : "Upload your first resume to get started with building your collection."}
          </Typography>

          {hasFilters && (
            <Button
              variant="contained"
              onClick={clearAllFilters}
              startIcon={<Close />}
              sx={{
                background: `linear-gradient(135deg, ${lightTheme.primary} 0%, ${colorPalette[0].primary} 100%)`,
                color: "#ffffff",
                borderRadius: { xs: "10px", sm: "12px" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: "0.9375rem", sm: "1rem" },
                fontWeight: 600,
                textTransform: "none",
                boxShadow: `0 8px 24px ${alpha(lightTheme.primary, 0.3)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${colorPalette[0].primary} 0%, ${lightTheme.primary} 100%)`,
                  boxShadow: `0 12px 32px ${alpha(lightTheme.primary, 0.4)}`,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmptyState;
