import React from "react";
import { Card, CardContent, Box, Typography, Fade } from "@mui/material";
import {
  AutoAwesome,
  FilterList,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { MatchScoreChip, AppColors } from "./theme";
import { SearchResultsProps } from "./types";
import CandidateCard from "./CandidateCard";

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  searchSummary,
  selectedGroup,
  onClearSearch,
}) => {
  if (searchResults.length === 0) {
    return null;
  }

  return (
    <Fade in timeout={500}>
      <Card
        sx={{
          minHeight: 400,
          borderRadius: 3,
          backgroundColor: AppColors.background.paper,
          border: `1px solid ${AppColors.border.light}`,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-2px)",
          },
          position: "relative",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Search Summary Section */}
          {searchSummary && (
            <Box
              sx={{
                mb: 4,
                p: 3,
                backgroundColor: `${AppColors.primary.main}08`,
                borderRadius: 3,
                border: `1px solid ${AppColors.primary.main}20`,
                borderLeft: `4px solid ${AppColors.primary.main}`,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.15)",
                  transform: "translateY(-1px)",
                  borderColor: `${AppColors.primary.main}40`,
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: AppColors.primary.main,
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  fontSize: "1.25rem",
                  letterSpacing: "-0.02em",
                }}
              >
                <AutoAwesome
                  sx={{
                    fontSize: "1.4rem",
                    filter: "drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))",
                  }}
                />
                AI Analysis Summary
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: AppColors.text.primary,
                  lineHeight: 1.8,
                  fontSize: "1.05rem",
                  pl: 0.5,
                  "& strong": {
                    color: AppColors.primary.main,
                    fontWeight: 600,
                  },
                }}
              >
                {searchSummary}
              </Typography>
            </Box>
          )}

          {/* Results Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              pb: 3,
              borderBottom: `1px solid ${AppColors.border.light}`,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -1,
                left: 0,
                width: "15%",
                height: "2px",
                backgroundColor: AppColors.primary.main,
                borderRadius: "2px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <FilterList
                sx={{
                  color: AppColors.primary.main,
                  fontSize: "1.75rem",
                  filter: "drop-shadow(0 2px 4px rgba(37, 99, 235, 0.2))",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: AppColors.text.primary,
                  letterSpacing: "-0.02em",
                  fontSize: "1.75rem",
                }}
              >
                Search Results
                {selectedGroup && (
                  <Typography
                    component="span"
                    variant="h6"
                    sx={{
                      ml: 1.5,
                      fontWeight: 500,
                      color: AppColors.text.secondary,
                      fontSize: "1.1rem",
                      backgroundColor: `${AppColors.primary.main}10`,
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <FolderIcon
                      sx={{
                        fontSize: "1.1rem",
                        color: AppColors.primary.main,
                      }}
                    />
                    {selectedGroup}
                  </Typography>
                )}
              </Typography>
              <MatchScoreChip
                label={`${searchResults.length} candidate${
                  searchResults.length === 1 ? "" : "s"
                } found`}
                size="small"
                sx={{
                  ml: 2,
                  backgroundColor: `${AppColors.success.main}15`,
                  color: AppColors.success.main,
                  border: `1px solid ${AppColors.success.main}30`,
                  fontWeight: 600,
                  px: 2,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Results Grid */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {searchResults.map((candidate, index) => (
              <CandidateCard
                key={candidate.id || index}
                candidate={candidate}
                index={index}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default SearchResults;
