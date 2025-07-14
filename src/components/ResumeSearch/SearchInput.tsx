import React, { useRef, useEffect } from "react";
import { Box, Select, MenuItem, CircularProgress } from "@mui/material";
import { Search, Folder as FolderIcon } from "@mui/icons-material";
import { Fade } from "@mui/material";
import {
  SearchContainer,
  GroupSelectContainer,
  StyledTextField,
  SearchButton,
  AppColors,
} from "./theme";
import { SearchInputProps } from "./types";

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGroup,
  setSelectedGroup,
  onSearch,
  isSearching,
  groups,
  groupsError,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus effect
  useEffect(() => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSearching) {
      onSearch();
    }
  };

  return (
    <Fade in timeout={500}>
      <SearchContainer>
        {/* Group Selection */}
        <GroupSelectContainer>
          <Select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            displayEmpty
            renderValue={(value) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FolderIcon
                  sx={{
                    fontSize: "20px",
                    color: AppColors.primary_ui_blue.p500,
                  }}
                />
                {value || "All Groups"}
              </Box>
            )}
          >
            <MenuItem value="">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FolderIcon
                  sx={{
                    fontSize: "20px",
                    color: AppColors.primary_ui_blue.p500,
                  }}
                />
                All Groups
              </Box>
            </MenuItem>
            {(groups || []).map((group) => (
              <MenuItem key={group.name} value={group.name}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <FolderIcon
                    sx={{
                      fontSize: "20px",
                      color: AppColors.primary_ui_blue.p500,
                    }}
                  />
                  {group.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </GroupSelectContainer>

        {/* Text Search Input */}
        <StyledTextField
          fullWidth
          inputRef={searchInputRef}
          placeholder="Describe your ideal candidate or paste job requirements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
        />

        {/* Search Button */}
        <SearchButton
          onClick={onSearch}
          disabled={
            isSearching || !searchQuery.trim() || searchQuery.trim().length < 5
          }
          startIcon={
            isSearching ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Search />
            )
          }
        >
          {isSearching ? "Searching..." : "Search"}
        </SearchButton>
      </SearchContainer>
    </Fade>
  );
};

export default SearchInput;
