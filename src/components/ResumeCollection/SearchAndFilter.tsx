import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  alpha,
} from "@mui/material";
import { Search, Close, Folder, Warning } from "@mui/icons-material";
import { lightTheme, getGroupColorTheme } from "./theme";

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGroup: string | null;
  setSelectedGroup: (group: string | null) => void;
  groupStats: Array<{
    group: string;
    count: number;
    hasResumes: boolean;
    groupId: number;
  }>;
  groupsLoading: boolean;
  groupsError: string | null;
  clearGroupsError: () => void;
  refreshGroups: () => void;
  isLoading: boolean;
}

/**
 * Search and Filter Component
 */
const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  selectedGroup,
  setSelectedGroup,
  groupStats,
  groupsLoading,
  groupsError,
  clearGroupsError,
  refreshGroups,
  isLoading,
}: SearchAndFilterProps) => {
  // Handle group selection
  const handleGroupSelect = (group: string, hasResumes: boolean) => {
    // Don't allow selection of groups without resumes
    if (!hasResumes) {
      return;
    }

    if (selectedGroup === group) {
      // Deselect if clicking the same group
      setSelectedGroup(null);
    } else {
      setSelectedGroup(group);
    }
    // Clear search when changing groups
    setSearchQuery("");
  };

  return (
    <Box
      sx={{
        mb: { xs: 4, md: 6 },
        background: lightTheme.background,
        borderRadius: { xs: "16px", md: "24px" },
        p: { xs: 2, sm: 3, md: 4 },
        border: `1px solid ${lightTheme.border}`,
        boxShadow: `0 4px 6px -1px ${alpha(
          lightTheme.text,
          0.1
        )}, 0 2px 4px -2px ${alpha(lightTheme.text, 0.1)}`,
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
              color: lightTheme.text,
              mb: 1,
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: { xs: 1, sm: 1.5 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                borderRadius: { xs: "8px", sm: "10px" },
                background: `linear-gradient(135deg, ${
                  lightTheme.primary
                } 0%, ${alpha(lightTheme.primary, 0.8)} 100%)`,
                boxShadow: `0 4px 12px ${alpha(lightTheme.primary, 0.3)}`,
              }}
            >
              <Search
                sx={{
                  color: "#ffffff",
                  fontSize: { xs: "1.125rem", sm: "1.25rem" },
                }}
              />
            </Box>
            Search & Filter
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: lightTheme.textSecondary,
              fontSize: "0.9rem",
              ml: 5.5,
            }}
          >
            {groupsError
              ? "Error loading groups"
              : selectedGroup
              ? `Showing ${groupStats.length} ${selectedGroup} resumes`
              : `${groupStats.length} groups available • ${groupStats.reduce(
                  (acc, stat) => acc + stat.count,
                  0
                )} total resumes`}
          </Typography>
        </Box>

        {/* Groups Error Handling */}
        {groupsError && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              clearGroupsError();
              refreshGroups();
            }}
            startIcon={<Warning />}
            sx={{
              borderColor: lightTheme.warning,
              color: lightTheme.warning,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                borderColor: lightTheme.warning,
                backgroundColor: alpha(lightTheme.warning, 0.1),
              },
            }}
          >
            Retry Loading Groups
          </Button>
        )}
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder={
            selectedGroup
              ? `Search in ${selectedGroup} group...`
              : "Search resumes by filename..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    backgroundColor: alpha(lightTheme.primary, 0.1),
                    mr: 1,
                  }}
                >
                  <Search
                    sx={{ color: lightTheme.primary, fontSize: "1.125rem" }}
                  />
                </Box>
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery("")}
                  sx={{
                    color: lightTheme.textMuted,
                    backgroundColor: alpha(lightTheme.error, 0.08),
                    borderRadius: "8px",
                    width: 32,
                    height: 32,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(lightTheme.error, 0.12),
                      color: lightTheme.error,
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Close sx={{ fontSize: "1rem" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: { xs: "16px", sm: "20px" },
              backgroundColor: lightTheme.surface,
              transition: "all 0.3s ease",
              border: `2px solid ${lightTheme.border}`,
              minHeight: { xs: "48px", sm: "56px" },
              "& input": {
                padding: { xs: "12px 8px", sm: "16px 8px" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: 500,
                "&::placeholder": {
                  color: lightTheme.textMuted,
                  opacity: 1,
                  fontWeight: 400,
                },
              },
              "&:hover": {
                backgroundColor: lightTheme.surfaceLight,
                borderColor: alpha(lightTheme.primary, 0.4),
                transform: "translateY(-1px)",
                boxShadow: `0 4px 12px ${alpha(lightTheme.primary, 0.1)}`,
              },
              "&.Mui-focused": {
                backgroundColor: lightTheme.background,
                borderColor: lightTheme.primary,
                boxShadow: `0 0 0 4px ${alpha(lightTheme.primary, 0.1)}`,
                transform: "translateY(-2px)",
              },
              "&.Mui-disabled": {
                backgroundColor: alpha(lightTheme.textMuted, 0.05),
                borderColor: alpha(lightTheme.textMuted, 0.2),
              },
            },
          }}
        />
      </Box>

      {/* Group Filter Section */}
      {!groupsError && groupStats.length > 0 && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: lightTheme.text,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${
                  lightTheme.success
                } 0%, ${alpha(lightTheme.success, 0.8)} 100%)`,
                boxShadow: `0 4px 12px ${alpha(lightTheme.success, 0.3)}`,
              }}
            >
              <Folder sx={{ fontSize: "1.125rem", color: "#ffffff" }} />
            </Box>
            Filter by Group
            {groupsLoading && (
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `3px solid ${alpha(lightTheme.primary, 0.2)}`,
                  borderTop: `3px solid ${lightTheme.primary}`,
                  animation: "spin 1s linear infinite",
                  ml: 1,
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
            )}
          </Typography>

          {/* Group Chips */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 1.5, sm: 2 },
              py: { xs: 1.5, sm: 2 },
            }}
          >
            {groupStats.map(({ group, count, hasResumes }) => {
              const colorTheme = getGroupColorTheme(group);
              const isSelected = selectedGroup === group;

              return (
                <Chip
                  key={group}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, sm: 1.5 },
                        py: { xs: 0.25, sm: 0.5 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 20,
                          height: 20,
                          borderRadius: "6px",
                          background: isSelected
                            ? "rgba(255,255,255,0.2)"
                            : hasResumes
                            ? colorTheme.gradient
                            : alpha(lightTheme.textMuted, 0.3),
                          boxShadow: hasResumes
                            ? `0 2px 8px ${alpha(colorTheme.primary, 0.2)}`
                            : "none",
                        }}
                      >
                        <Folder
                          sx={{
                            fontSize: "0.75rem",
                            color: isSelected
                              ? "#fff"
                              : hasResumes
                              ? "#fff"
                              : lightTheme.textMuted,
                          }}
                        />
                      </Box>
                      <span style={{ fontWeight: 600 }}>{group}</span>
                      <Box
                        component="span"
                        sx={{
                          backgroundColor: isSelected
                            ? "rgba(255,255,255,0.25)"
                            : hasResumes
                            ? alpha(colorTheme.primary, 0.2)
                            : alpha(lightTheme.textMuted, 0.2),
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          minWidth: "28px",
                          textAlign: "center",
                        }}
                      >
                        {count}
                      </Box>
                    </Box>
                  }
                  onClick={() => handleGroupSelect(group, hasResumes)}
                  disabled={!hasResumes}
                  sx={{
                    borderRadius: { xs: "12px", sm: "16px" },
                    height: { xs: 38, sm: 44 },
                    backgroundColor: isSelected
                      ? colorTheme.primary
                      : hasResumes
                      ? alpha(colorTheme.primary, 0.08)
                      : alpha(lightTheme.textMuted, 0.08),
                    color: isSelected
                      ? "#fff"
                      : hasResumes
                      ? colorTheme.primary
                      : lightTheme.textMuted,
                    border: `2px solid ${
                      isSelected
                        ? colorTheme.primary
                        : hasResumes
                        ? alpha(colorTheme.primary, 0.2)
                        : "transparent"
                    }`,
                    transition: "all 0.3s ease",
                    cursor: hasResumes ? "pointer" : "not-allowed",
                    ...(!hasResumes
                      ? {}
                      : {
                          "&:hover": {
                            backgroundColor: isSelected
                              ? colorTheme.primary
                              : alpha(colorTheme.primary, 0.12),
                            transform: "translateY(-2px)",
                            boxShadow: `0 8px 24px ${alpha(
                              colorTheme.primary,
                              0.2
                            )}`,
                          },
                        }),
                    "& .MuiChip-label": {
                      px: { xs: 1.5, sm: 2 },
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    },
                    "&.Mui-disabled": {
                      opacity: 0.4,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchAndFilter;
