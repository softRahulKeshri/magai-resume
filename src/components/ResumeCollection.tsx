/**
 * Resume Analytics - Clean Analytics Dashboard Component
 *
 * A focused analytics interface displaying resume statistics.
 * Matches the modern dark theme design with essential metrics only.
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
  Schedule,
  InsertDriveFile,
  Assessment,
  CheckCircle,
  FolderOpen,
} from "@mui/icons-material";

import { Resume } from "../types";

// Dark theme colors to match the analytics design
const darkTheme = {
  background: "#0a0a0a", // Darker background
  surface: "#1a1a1a",
  surfaceLight: "#2a2a2a",
  primary: "#4a90e2", // Blue
  success: "#22c55e", // Green
  warning: "#f59e0b", // Orange
  error: "#ef4444", // Red
  text: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
  border: "#27272a",
};

// Enhanced Statistics Card Component - Simplified for essential metrics only
interface StatsCardProps {
  title: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
}

const StatsCard = ({ title, value, color, icon, bgColor }: StatsCardProps) => {
  return (
    <Card
      sx={{
        background: bgColor,
        borderRadius: "16px",
        border: "none",
        minWidth: "320px",
        minHeight: "140px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        },
      }}
    >
      <CardContent sx={{ p: 4, position: "relative" }}>
        {/* Icon positioned in top right */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            opacity: 0.8,
          }}
        >
          {icon}
        </Box>

        {/* Main content */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.1rem",
              mb: 2,
              opacity: 0.9,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "3rem",
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// File Card Component (simplified and improved)
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
    });
  };

  const getFileIcon = () => {
    switch (resume.fileType.toLowerCase()) {
      case "pdf":
        return <PictureAsPdf sx={{ fontSize: "2rem", color: "#ef4444" }} />;
      case "doc":
      case "docx":
        return <Description sx={{ fontSize: "2rem", color: "#4a90e2" }} />;
      default:
        return <InsertDriveFile sx={{ fontSize: "2rem", color: "#22c55e" }} />;
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
        return darkTheme.primary;
    }
  };

  return (
    <Card
      sx={{
        background: darkTheme.surface,
        border: `1px solid ${darkTheme.border}`,
        borderRadius: "12px",
        transition: "all 0.3s ease",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          border: `1px solid ${alpha(darkTheme.primary, 0.5)}`,
          "& .action-buttons": {
            opacity: 1,
          },
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with icon and status */}
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ mr: 2 }}>{getFileIcon()}</Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                color: darkTheme.text,
                fontWeight: 600,
                fontSize: "1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.5,
              }}
              title={resume.filename}
            >
              {resume.filename}
            </Typography>
            <Chip
              label={
                resume.status.charAt(0).toUpperCase() + resume.status.slice(1)
              }
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 20,
                background: alpha(getStatusColor(), 0.2),
                color: getStatusColor(),
                border: `1px solid ${alpha(getStatusColor(), 0.3)}`,
                borderRadius: "10px",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* File details */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={formatFileSize(resume.fileSize)}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 20,
                background: alpha(darkTheme.textMuted, 0.1),
                color: darkTheme.textSecondary,
                border: `1px solid ${alpha(darkTheme.textMuted, 0.2)}`,
                borderRadius: "10px",
              }}
            />
            <Chip
              label={resume.fileType.toUpperCase()}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 20,
                background: alpha(darkTheme.textMuted, 0.1),
                color: darkTheme.textSecondary,
                border: `1px solid ${alpha(darkTheme.textMuted, 0.2)}`,
                borderRadius: "10px",
              }}
            />
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: darkTheme.textMuted,
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Schedule sx={{ fontSize: "0.8rem", mr: 0.5 }} />
            {formatDate(resume.uploadedAt)}
          </Typography>
        </Box>

        {/* Action buttons */}
        <Stack
          direction="row"
          spacing={1}
          className="action-buttons"
          sx={{
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <Button
            size="small"
            startIcon={<Visibility sx={{ fontSize: "1rem" }} />}
            onClick={() => onView(resume)}
            sx={{
              bgcolor: darkTheme.primary,
              color: "white",
              "&:hover": { bgcolor: "#3a7bc8" },
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1.5,
            }}
          >
            View
          </Button>
          <Button
            size="small"
            startIcon={<Download sx={{ fontSize: "1rem" }} />}
            onClick={() => onDownload(resume)}
            sx={{
              bgcolor: darkTheme.success,
              color: "white",
              "&:hover": { bgcolor: "#16a34a" },
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1.5,
            }}
          >
            Download
          </Button>
          <Button
            size="small"
            startIcon={<Delete sx={{ fontSize: "1rem" }} />}
            onClick={() => onDelete(resume)}
            sx={{
              bgcolor: darkTheme.error,
              color: "white",
              "&:hover": { bgcolor: "#dc2626" },
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1.5,
            }}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
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

  // Enhanced Statistics - Only 2 essential metrics to avoid clutter
  const stats = useMemo(() => {
    const totalFiles = resumes.length;
    const completed = resumes.filter((r) => r.status === "completed").length;

    return {
      totalFiles,
      completed,
    };
  }, [resumes]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: darkTheme.background,
        cursor: "default",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      {/* Analytics Header - Clean and focused */}
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
            mb: 2,
          }}
        >
          <Assessment
            sx={{
              fontSize: "3rem",
              color: darkTheme.primary,
              mr: 1,
            }}
          />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2.5rem", md: "3rem" },
            color: darkTheme.text,
            mb: 2,
          }}
        >
          Resume Analytics
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: darkTheme.textSecondary,
            fontWeight: 400,
            maxWidth: 600,
            mx: "auto",
            mb: 6,
          }}
        >
          View all uploaded resumes from here. You can view, delete, and
          download any resume in your collection.
        </Typography>

        {/* Statistics Cards - Only 2 essential cards with proper spacing */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          <StatsCard
            title="Total Files"
            value={stats.totalFiles}
            color="#fff"
            bgColor="linear-gradient(135deg, #4a90e2 0%, #357abd 100%)"
            icon={
              <FolderOpen
                sx={{ fontSize: "2.5rem", color: "rgba(255,255,255,0.8)" }}
              />
            }
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            color="#fff"
            bgColor="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
            icon={
              <CheckCircle
                sx={{ fontSize: "2.5rem", color: "rgba(255,255,255,0.8)" }}
              />
            }
          />
        </Box>
      </Box>

      {/* Search and File Management Section */}
      <Box>
        {/* Search Bar */}
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
            mb: 6,
            maxWidth: "600px",
            mx: "auto",
            display: "block",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              background: darkTheme.surface,
              color: darkTheme.text,
              border: `1px solid ${darkTheme.border}`,
              "& input": {
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
                boxShadow: `0 0 0 3px ${alpha(darkTheme.primary, 0.1)}`,
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
              py: 8,
            }}
          >
            <Card
              sx={{
                textAlign: "center",
                py: 6,
                px: 4,
                maxWidth: 400,
                background: darkTheme.surface,
                border: `1px solid ${darkTheme.border}`,
                borderRadius: "12px",
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
                    color: darkTheme.text,
                    fontWeight: 600,
                  }}
                >
                  {searchQuery.trim()
                    ? "No resumes found"
                    : "No resumes uploaded yet"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: darkTheme.textSecondary,
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
                sm: "repeat(auto-fit, minmax(320px, 1fr))",
              },
              gap: 3,
              maxWidth: "1200px",
              mx: "auto",
            }}
          >
            {filteredResumes.map((resume) => (
              <FileCard
                key={resume.id}
                resume={resume}
                onView={onView}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResumeCollection;
