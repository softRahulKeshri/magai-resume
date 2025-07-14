import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { StatsCardProps } from "./types";

/**
 * Enhanced Statistics Card Component - Simplified for essential metrics only
 */
const StatsCard = ({ title, value, color, icon, bgColor }: StatsCardProps) => {
  return (
    <Card
      sx={{
        background: bgColor,
        borderRadius: "20px",
        border: "none",
        minWidth: { xs: "280px", sm: "300px", md: "320px", lg: "340px" },
        minHeight: { xs: "140px", sm: "150px", md: "160px" },
        width: { xs: "100%", sm: "auto" },
        maxWidth: { xs: "100%", sm: "400px" },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
        },
      }}
    >
      <CardContent sx={{ p: 4, position: "relative", height: "100%" }}>
        {/* Icon positioned in top right with better styling */}
        <Box
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Box sx={{ fontSize: "1.75rem", color: "#ffffff" }}>{icon}</Box>
        </Box>

        {/* Main content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            pr: 7, // Leave space for icon
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "1.125rem",
              mb: 1,
              opacity: 0.95,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "3.5rem",
              lineHeight: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
