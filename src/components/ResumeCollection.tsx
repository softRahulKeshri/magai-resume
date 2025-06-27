/**
 * Resume Collection - Simplified File Manager Component
 *
 * A clean file management interface with search functionality only.
 * Focused on displaying and managing individual resumes.
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Stack,
  alpha,
} from "@mui/material";
import {
  Search,
  PictureAsPdf,
  Description,
  Visibility,
  Download,
  Delete,
  FileOpen,
  Schedule,
  InsertDriveFile,
  FolderOpen,
  CloudUpload,
} from "@mui/icons-material";

import { Resume } from "../types";

// Dark theme colors to match the sidebar
const darkTheme = {
  background: "#1a1a1a",
  surface: "#2a2a2a",
  surfaceLight: "#3a3a3a",
  primary: "#4a90e2",
  primaryHover: "#3a7bc8",
  text: "#ffffff",
  textSecondary: "#b0b0b0",
  textMuted: "#808080",
  border: "#404040",
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",
  info: "#2196f3",
};

// Statistics Card Component
interface StatsCardProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, color, icon }: StatsCardProps) => {
  return (
    <Card
      sx={{
        background: darkTheme.surface,
        border: `1px solid ${darkTheme.border}`,
        borderRadius: "10px",
        transition: "all 0.3s ease",
        cursor: "default !important",
        minWidth: "200px",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          background: darkTheme.surfaceLight,
          cursor: "default !important",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          {icon}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: "2rem",
              color,
              ml: 1,
            }}
          >
            {value}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: darkTheme.textSecondary,
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

// File Card Component
interface FileCardProps {
  resume: Resume;
  onView: (resume: Resume) => void;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
}

const FileCard = ({ resume, onView, onDownload, onDelete }: FileCardProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getFileIcon = () => {
    switch (resume.fileType.toLowerCase()) {
      case "pdf":
        return <PictureAsPdf sx={{ fontSize: "3rem", color: "#ff4444" }} />;
      case "doc":
      case "docx":
        return <Description sx={{ fontSize: "3rem", color: "#4285f4" }} />;
      default:
        return <InsertDriveFile sx={{ fontSize: "3rem", color: "#34a853" }} />;
    }
  };

  const getStatusColor = () => {
    switch (resume.status) {
      case "completed":
        return darkTheme.success;
      case "processing":
        return darkTheme.warning;
      case "failed":
        return darkTheme.error;
      default:
        return darkTheme.info;
    }
  };

  return (
    <Card
      sx={{
        width: "300px",
        height: "380px",
        display: "flex",
        flexDirection: "column",
        background: darkTheme.surface,
        border: `1px solid ${darkTheme.border}`,
        borderRadius: "10px",
        transition: "all 0.3s ease",
        cursor: "default !important",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
          background: darkTheme.surfaceLight,
          cursor: "default !important",
          "& .action-buttons": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Status Indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 2,
        }}
      >
        <Chip
          label={resume.status.toUpperCase()}
          size="small"
          sx={{
            fontSize: "0.6rem",
            height: 18,
            background: alpha(getStatusColor(), 0.2),
            color: getStatusColor(),
            border: `1px solid ${alpha(getStatusColor(), 0.3)}`,
            borderRadius: "8px",
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, textAlign: "center" }}>
        {/* File Icon */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: "50%",
              background: alpha(darkTheme.primary, 0.1),
              border: `2px solid ${alpha(darkTheme.primary, 0.2)}`,
            }}
          >
            {getFileIcon()}
          </Box>
        </Box>

        {/* File Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.3,
            minHeight: "2.6em",
            cursor: "text !important",
            color: darkTheme.text,
            fontSize: "1rem",
          }}
          title={resume.filename}
        >
          {resume.filename}
        </Typography>

        {/* File Details */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 1 }}
          >
            <Chip
              label={formatFileSize(resume.fileSize)}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 22,
                background: alpha(darkTheme.primary, 0.15),
                color: darkTheme.primary,
                border: `1px solid ${alpha(darkTheme.primary, 0.25)}`,
                borderRadius: "8px",
                fontWeight: 500,
              }}
            />
            <Chip
              label={resume.fileType.toUpperCase()}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 22,
                background: alpha(darkTheme.textMuted, 0.1),
                color: darkTheme.textSecondary,
                border: `1px solid ${alpha(darkTheme.textMuted, 0.2)}`,
                borderRadius: "8px",
                fontWeight: 500,
              }}
            />
          </Stack>

          {/* Upload Date */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: darkTheme.textMuted,
            }}
          >
            <Schedule sx={{ fontSize: "0.9rem", mr: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
              {formatDate(resume.uploadedAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Action Buttons */}
      <Box
        className="action-buttons"
        sx={{
          p: 2,
          opacity: 0,
          transform: "translateY(10px)",
          transition: "all 0.3s ease",
        }}
      >
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button
            size="small"
            variant="contained"
            startIcon={<Visibility sx={{ fontSize: "0.9rem" }} />}
            onClick={() => onView(resume)}
            sx={{
              bgcolor: darkTheme.success,
              "&:hover": {
                bgcolor: "#45a049",
                cursor: "pointer !important",
              },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              fontSize: "0.75rem",
              cursor: "pointer !important",
              color: "white",
            }}
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Download sx={{ fontSize: "0.9rem" }} />}
            onClick={() => onDownload(resume)}
            sx={{
              bgcolor: darkTheme.info,
              "&:hover": {
                bgcolor: "#1976d2",
                cursor: "pointer !important",
              },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              fontSize: "0.75rem",
              cursor: "pointer !important",
              color: "white",
            }}
          >
            Download
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Delete sx={{ fontSize: "0.9rem" }} />}
            onClick={() => onDelete(resume)}
            sx={{
              bgcolor: darkTheme.error,
              "&:hover": {
                bgcolor: "#d32f2f",
                cursor: "pointer !important",
              },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              fontSize: "0.75rem",
              cursor: "pointer !important",
              color: "white",
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

// Main Component Props
interface ResumeCollectionProps {
  resumes: Resume[];
  onView?: (resume: Resume) => void;
  onDownload?: (resume: Resume) => void;
  onDelete?: (resume: Resume) => void;
}

const ResumeCollection = ({
  resumes,
  onView = () => {},
  onDownload = () => {},
  onDelete = () => {},
}: ResumeCollectionProps) => {
  // State
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered resumes
  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) {
      return resumes;
    }

    const query = searchQuery.toLowerCase();
    return resumes.filter((resume) =>
      resume.filename.toLowerCase().includes(query)
    );
  }, [resumes, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: resumes.length,
      showing: filteredResumes.length,
    };
  }, [resumes.length, filteredResumes.length]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        cursor: "default !important",
        background: darkTheme.background,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${darkTheme.background} 0%, ${darkTheme.surface} 100%)`,
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          borderRadius: "0 0 20px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* Title and Description */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <FolderOpen
                sx={{
                  fontSize: "3rem",
                  color: darkTheme.primary,
                  mr: 2,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  color: darkTheme.text,
                }}
              >
                Resume Collection
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: darkTheme.textSecondary,
                maxWidth: 600,
                mx: "auto",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Manage and view all uploaded resumes. Search and organize your
              talent pipeline.
            </Typography>
          </Box>

          {/* Statistics Cards */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
              mb: 4,
            }}
          >
            <StatsCard
              title="Total Resumes"
              value={stats.total}
              color={darkTheme.primary}
              icon={
                <CloudUpload
                  sx={{ fontSize: "1.5rem", color: darkTheme.primary }}
                />
              }
            />
            <StatsCard
              title="Showing"
              value={stats.showing}
              color={darkTheme.info}
              icon={
                <Visibility
                  sx={{ fontSize: "1.5rem", color: darkTheme.info }}
                />
              }
            />
          </Box>
        </Box>
      </Box>

      {/* Search Section - Full Width */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <TextField
          fullWidth
          placeholder="Search resumes by filename..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: darkTheme.textMuted }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              background: darkTheme.surface,
              cursor: "text !important",
              color: darkTheme.text,
              border: `1px solid ${darkTheme.border}`,
              "& input": {
                cursor: "text !important",
                color: darkTheme.text,
                py: 2,
                "&::placeholder": {
                  color: darkTheme.textMuted,
                  opacity: 1,
                },
              },
              "& fieldset": {
                border: "none",
              },
              "&:hover": {
                background: darkTheme.surfaceLight,
                border: `1px solid ${darkTheme.primary}`,
              },
              "&.Mui-focused": {
                background: darkTheme.surfaceLight,
                border: `1px solid ${darkTheme.primary}`,
                boxShadow: `0 0 0 2px ${alpha(darkTheme.primary, 0.2)}`,
              },
            },
          }}
        />

        {/* Resume Grid */}
        {filteredResumes.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              px: { xs: 2, md: 4 },
            }}
          >
            <Card
              sx={{
                textAlign: "center",
                py: 8,
                px: 4,
                maxWidth: 500,
                width: "100%",
                background: darkTheme.surface,
                border: `1px solid ${darkTheme.border}`,
                borderRadius: "10px",
              }}
            >
              <CardContent>
                <InsertDriveFile
                  sx={{
                    fontSize: "4rem",
                    color: darkTheme.textMuted,
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: darkTheme.textSecondary,
                  }}
                >
                  {searchQuery.trim()
                    ? "No resumes found"
                    : "No resumes uploaded yet"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: darkTheme.textMuted,
                  }}
                >
                  {searchQuery.trim()
                    ? "Try adjusting your search criteria"
                    : "Upload your first resume to get started"}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fit, minmax(300px, 1fr))",
                md: "repeat(auto-fit, minmax(300px, 1fr))",
                lg: "repeat(auto-fit, minmax(300px, 1fr))",
              },
              gap: { xs: 2, sm: 3, md: 4 },
              justifyContent: "center",
              alignItems: "start",
              maxWidth: "1400px",
              mx: "auto",
              px: { xs: 1, sm: 2 },
            }}
          >
            {filteredResumes.map((resume) => (
              <Box
                key={resume.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FileCard
                  resume={resume}
                  onView={onView}
                  onDownload={onDownload}
                  onDelete={onDelete}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResumeCollection;
