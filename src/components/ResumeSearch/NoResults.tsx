import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { SearchOff, Clear } from "@mui/icons-material";
import { AppColors } from "./theme";
import { NoResultsProps } from "./types";

const NoResults: React.FC<NoResultsProps> = ({ onClearSearch }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: AppColors.background.elevated,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SearchOff
          sx={{
            fontSize: "3rem",
            color: AppColors.text.secondary,
          }}
        />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: AppColors.text.primary,
          mb: 1,
        }}
      >
        No Matches Found
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 2,
          maxWidth: 500,
          lineHeight: 1.6,
          color: AppColors.text.secondary,
        }}
      >
        No candidates found. Try different keywords or broaden your search.
      </Typography>

      <Button
        variant="outlined"
        onClick={onClearSearch}
        startIcon={<Clear />}
        sx={{
          mt: 2,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderColor: AppColors.primary.main,
          color: AppColors.primary.main,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: `${AppColors.primary.main}08`,
            borderColor: AppColors.primary.main,
          },
        }}
      >
        Start New Search
      </Button>
    </Box>
  );
};

export default NoResults;
