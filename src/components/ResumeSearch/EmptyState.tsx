import React from "react";
import { Typography } from "@mui/material";
import { Fade } from "@mui/material";
import { InitialStateCard, AppColors } from "./theme";
import { EmptyStateProps } from "./types";
import { Box } from "@mui/material";

const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearched,
  isSearching,
}) => {
  if (hasSearched || isSearching) return null;

  return (
    <Fade in timeout={500}>
      <InitialStateCard>
        <Typography
          variant="h4"
          sx={{
            color: AppColors.text.primary,
            fontWeight: 600,
            textAlign: "center",
            fontSize: "1.75rem",
            mb: 2,
            position: "relative",
            fontFamily:
              '"SF Pro Display", -apple-system, system-ui, sans-serif',
            letterSpacing: "-0.02em",
          }}
        >
          Ready to Find Your Perfect Match?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: AppColors.text.secondary,
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.6,
            fontSize: "1rem",
            textAlign: "center",
            position: "relative",
            "& .emphasis": {
              color: AppColors.primary.main,
              fontWeight: 500,
            },
          }}
        >
          Start by entering your desired{" "}
          <span className="emphasis">skills</span>,{" "}
          <span className="emphasis">experience</span>, or{" "}
          <span className="emphasis">job requirements</span> above to discover
          candidates that perfectly align with your needs.
        </Typography>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "20%",
            background:
              "linear-gradient(0deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%)",
            pointerEvents: "none",
          }}
        />
      </InitialStateCard>
    </Fade>
  );
};

export default EmptyState;
