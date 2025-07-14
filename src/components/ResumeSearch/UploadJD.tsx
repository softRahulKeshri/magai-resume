import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Upload,
  Description,
  Folder as FolderIcon,
} from "@mui/icons-material";
import {
  GroupSelectContainer,
  SearchButton,
  UploadArea,
  AppColors,
} from "./theme";
import { UploadJDProps } from "./types";

const UploadJD: React.FC<UploadJDProps> = ({
  selectedFile,
  setSelectedFile,
  selectedGroup,
  setSelectedGroup,
  onUpload,
  isUploading,
  groups,
  groupsError,
  error,
  setError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please upload a PDF or DOCX file only");
      }
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Please upload a PDF or DOCX file only");
      }
    }
  };

  // Handle manual file upload click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto" }}>
      {/* Group Selection for Upload */}
      <GroupSelectContainer sx={{ mb: 3, width: "100%", minWidth: "600px" }}>
        <Select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          displayEmpty
          fullWidth
          renderValue={(value) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

      {/* Upload Area */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx"
        style={{ display: "none" }}
      />

      <UploadArea
        isDragging={isDragging}
        onClick={handleUploadClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            position: "relative",
            "&::after": isDragging
              ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 1,
                }
              : {},
          }}
        >
          {selectedFile ? (
            <>
              <Description
                sx={{
                  fontSize: "3rem",
                  color: isDragging
                    ? AppColors.primary.main
                    : AppColors.primary.main,
                  transition: "all 0.3s ease",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: AppColors.text.primary,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                }}
              >
                {selectedFile.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDragging
                    ? AppColors.primary.main
                    : AppColors.text.secondary,
                  transition: "all 0.3s ease",
                }}
              >
                {isDragging ? "Drop to replace file" : "Click to change file"}
              </Typography>
            </>
          ) : (
            <>
              <Upload
                sx={{
                  fontSize: "3rem",
                  color: isDragging
                    ? AppColors.primary.main
                    : AppColors.text.secondary,
                  transition: "all 0.3s ease",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: AppColors.text.primary,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                }}
              >
                {isDragging
                  ? "Drop your file here"
                  : "Drop your JD file here or click to browse"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDragging
                    ? AppColors.primary.main
                    : AppColors.text.secondary,
                  transition: "all 0.3s ease",
                }}
              >
                Supports PDF and DOCX files
              </Typography>
            </>
          )}
        </Box>
      </UploadArea>

      {/* Upload Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <SearchButton
          onClick={onUpload}
          disabled={isUploading || !selectedFile}
          startIcon={
            isUploading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Search />
            )
          }
          sx={{
            minWidth: "200px",
            opacity: selectedFile ? 1 : 0.7,
            border: "1px solidrgb(222, 228, 238)",
            transform: selectedFile ? "scale(1)" : "scale(0.95)",
            transition: "all 0.3s ease",
            color: selectedFile ? "#000" : "#fff",
            backgroundColor: selectedFile ? "#fff" : "#A78BFA",
            "&:hover": {
              backgroundColor: selectedFile ? "#fff" : "#9333EA",
              transform: selectedFile ? "translateY(-2px)" : "scale(0.95)",
            },
          }}
        >
          {isUploading ? "Searching..." : "Search with JD"}
        </SearchButton>
      </Box>
    </Box>
  );
};

export default UploadJD;
