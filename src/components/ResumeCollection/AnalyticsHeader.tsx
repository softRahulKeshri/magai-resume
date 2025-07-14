import React from "react";
import { Box, Typography, alpha } from "@mui/material";
import { InsertDriveFile, Folder } from "@mui/icons-material";
import { lightTheme } from "./theme";
import StatsCard from "./StatsCard";

interface AnalyticsHeaderProps {
  totalFiles: number;
  totalGroups: number;
}

/**
 * Analytics Header Component
 */
const AnalyticsHeader = ({ totalFiles, totalGroups }: AnalyticsHeaderProps) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 6,
      }}
    >
      {/* Title with icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${
              lightTheme.primary
            } 0%, ${alpha(lightTheme.primary, 0.8)} 100%)`,
            boxShadow: `0 12px 32px ${alpha(lightTheme.primary, 0.3)}`,
            mr: 2,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              borderRadius: "24px",
              background: `linear-gradient(135deg, ${alpha(
                lightTheme.primary,
                0.2
              )} 0%, ${alpha(lightTheme.primary, 0.1)} 100%)`,
              zIndex: -1,
            },
          }}
        >
          <InsertDriveFile
            sx={{
              fontSize: "2.5rem",
              color: "#ffffff",
            }}
          />
        </Box>
      </Box>

      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2.5rem", md: "3rem" },
          color: lightTheme.text,
          mb: 3,
          background: `linear-gradient(135deg, ${lightTheme.text} 0%, ${lightTheme.textSecondary} 100%)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Resume Analytics
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: lightTheme.textSecondary,
          fontWeight: 400,
          maxWidth: 600,
          mx: "auto",
          mb: 6,
          fontSize: "1.125rem",
          lineHeight: 1.6,
        }}
      >
        View all uploaded resumes from here. You can view, delete, and download
        any resume in your collection.
      </Typography>

      {/* Statistics Cards - Only 2 essential cards with proper spacing */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 2, sm: 3, md: 4 },
          flexWrap: "wrap",
          maxWidth: { xs: "100%", sm: "700px", md: "800px", lg: "900px" },
          mx: "auto",
          px: { xs: 1, sm: 2 },
        }}
      >
        <StatsCard
          title="Total Resumes"
          value={totalFiles}
          color="#fff"
          bgColor="linear-gradient(135deg, #3077F3 0%, #94BAFD 100%)"
          icon={
            <InsertDriveFile
              sx={{ fontSize: "2.5rem", color: "rgba(255,255,255,0.9)" }}
            />
          }
        />
        <StatsCard
          title="Total Groups"
          value={totalGroups}
          color="#fff"
          bgColor="linear-gradient(135deg, #41E6F8 0%, #3077F3 100%)"
          icon={
            <Folder
              sx={{ fontSize: "2.5rem", color: "rgba(255,255,255,0.9)" }}
            />
          }
        />
      </Box>
    </Box>
  );
};

export default AnalyticsHeader;
