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
  Modal,
  Backdrop,
  Fade,
  IconButton,
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
  Close,
  Warning,
  CheckCircleOutline,
} from "@mui/icons-material";

import { Resume } from "../types";
import { API_CONFIG } from "../theme/constants";
import { useGroups } from "../hooks/useGroups";

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

// Dynamic color palette for groups
const colorPalette = [
  {
    primary: "#4a90e2",
    secondary: "#357abd",
    shadow: "rgba(74, 144, 226, 0.3)",
    hoverShadow: "rgba(74, 144, 226, 0.4)",
  },
  {
    primary: "#22c55e",
    secondary: "#16a34a",
    shadow: "rgba(34, 197, 94, 0.3)",
    hoverShadow: "rgba(34, 197, 94, 0.4)",
  },
  {
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    shadow: "rgba(139, 92, 246, 0.3)",
    hoverShadow: "rgba(139, 92, 246, 0.4)",
  },
  {
    primary: "#f59e0b",
    secondary: "#d97706",
    shadow: "rgba(245, 158, 11, 0.3)",
    hoverShadow: "rgba(245, 158, 11, 0.4)",
  },
  {
    primary: "#ec4899",
    secondary: "#db2777",
    shadow: "rgba(236, 72, 153, 0.3)",
    hoverShadow: "rgba(236, 72, 153, 0.4)",
  },
  {
    primary: "#06b6d4",
    secondary: "#0891b2",
    shadow: "rgba(6, 182, 212, 0.3)",
    hoverShadow: "rgba(6, 182, 212, 0.4)",
  },
  {
    primary: "#ef4444",
    secondary: "#dc2626",
    shadow: "rgba(239, 68, 68, 0.3)",
    hoverShadow: "rgba(239, 68, 68, 0.4)",
  },
  {
    primary: "#10b981",
    secondary: "#059669",
    shadow: "rgba(16, 185, 129, 0.3)",
    hoverShadow: "rgba(16, 185, 129, 0.4)",
  },
  {
    primary: "#3b82f6",
    secondary: "#2563eb",
    shadow: "rgba(59, 130, 246, 0.3)",
    hoverShadow: "rgba(59, 130, 246, 0.4)",
  },
  {
    primary: "#f97316",
    secondary: "#ea580c",
    shadow: "rgba(249, 115, 22, 0.3)",
    hoverShadow: "rgba(249, 115, 22, 0.4)",
  },
  {
    primary: "#84cc16",
    secondary: "#65a30d",
    shadow: "rgba(132, 204, 22, 0.3)",
    hoverShadow: "rgba(132, 204, 22, 0.4)",
  },
  {
    primary: "#a855f7",
    secondary: "#9333ea",
    shadow: "rgba(168, 85, 247, 0.3)",
    hoverShadow: "rgba(168, 85, 247, 0.4)",
  },
  {
    primary: "#14b8a6",
    secondary: "#0d9488",
    shadow: "rgba(20, 184, 166, 0.3)",
    hoverShadow: "rgba(20, 184, 166, 0.4)",
  },
  {
    primary: "#f43f5e",
    secondary: "#e11d48",
    shadow: "rgba(244, 63, 94, 0.3)",
    hoverShadow: "rgba(244, 63, 94, 0.4)",
  },
  {
    primary: "#6366f1",
    secondary: "#4f46e5",
    shadow: "rgba(99, 102, 241, 0.3)",
    hoverShadow: "rgba(99, 102, 241, 0.4)",
  },
  {
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    shadow: "rgba(139, 92, 246, 0.3)",
    hoverShadow: "rgba(139, 92, 246, 0.4)",
  },
];

// Function to generate a consistent hash from a string
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Group color themes for better visual distinction
const groupColorThemes = {
  frontend: {
    background: "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)",
    border: "#4a90e2",
    shadow: "rgba(74, 144, 226, 0.3)",
    hoverShadow: "rgba(74, 144, 226, 0.4)",
  },
  backend: {
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    border: "#22c55e",
    shadow: "rgba(34, 197, 94, 0.3)",
    hoverShadow: "rgba(34, 197, 94, 0.4)",
  },
  fullstack: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    border: "#8b5cf6",
    shadow: "rgba(139, 92, 246, 0.3)",
    hoverShadow: "rgba(139, 92, 246, 0.4)",
  },
  general: {
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    border: "#f59e0b",
    shadow: "rgba(245, 158, 11, 0.3)",
    hoverShadow: "rgba(245, 158, 11, 0.4)",
  },
  mobile: {
    background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    border: "#ec4899",
    shadow: "rgba(236, 72, 153, 0.3)",
    hoverShadow: "rgba(236, 72, 153, 0.4)",
  },
  devops: {
    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    border: "#06b6d4",
    shadow: "rgba(6, 182, 212, 0.3)",
    hoverShadow: "rgba(6, 182, 212, 0.4)",
  },
  design: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    border: "#ef4444",
    shadow: "rgba(239, 68, 68, 0.3)",
    hoverShadow: "rgba(239, 68, 68, 0.4)",
  },
  default: {
    background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    border: "#6b7280",
    shadow: "rgba(107, 114, 128, 0.3)",
    hoverShadow: "rgba(107, 114, 128, 0.4)",
  },
};

// Function to get color theme based on group name - now with dynamic colors
const getGroupColorTheme = (groupName: string) => {
  const normalizedGroup = groupName.toLowerCase().trim();

  // Map common variations to our predefined themes first
  const groupMappings: { [key: string]: keyof typeof groupColorThemes } = {
    frontend: "frontend",
    "front-end": "frontend",
    "front end": "frontend",
    react: "frontend",
    angular: "frontend",
    vue: "frontend",

    backend: "backend",
    "back-end": "backend",
    "back end": "backend",
    node: "backend",
    python: "backend",
    java: "backend",

    fullstack: "fullstack",
    "full-stack": "fullstack",
    "full stack": "fullstack",

    general: "general",
    other: "general",
    misc: "general",

    mobile: "mobile",
    ios: "mobile",
    android: "mobile",
    "react native": "mobile",
    flutter: "mobile",

    devops: "devops",
    "dev ops": "devops",
    aws: "devops",
    docker: "devops",
    kubernetes: "devops",

    design: "design",
    ui: "design",
    ux: "design",
    "ui/ux": "design",
    graphic: "design",
  };

  // Check if we have a predefined theme first
  const themeKey = groupMappings[normalizedGroup];
  if (themeKey && groupColorThemes[themeKey]) {
    return groupColorThemes[themeKey];
  }

  // For new groups, generate a unique color based on the group name
  const hash = stringToHash(groupName);
  const colorIndex = hash % colorPalette.length;
  const selectedColor = colorPalette[colorIndex];

  return {
    background: `linear-gradient(135deg, ${selectedColor.primary} 0%, ${selectedColor.secondary} 100%)`,
    border: selectedColor.primary,
    shadow: selectedColor.shadow,
    hoverShadow: selectedColor.hoverShadow,
  };
};

// Custom Styled Modal Component
interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filename: string;
  isDeleting: boolean;
}

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  filename,
  isDeleting,
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(4px)",
        },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Fade in={open} timeout={300}>
        <Card
          sx={{
            minWidth: 400,
            maxWidth: 500,
            background: `linear-gradient(135deg, ${darkTheme.surface} 0%, ${darkTheme.surfaceLight} 100%)`,
            border: `2px solid ${darkTheme.error}`,
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(239, 68, 68, 0.3)",
            outline: "none",
            position: "relative",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              disabled={isDeleting}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: darkTheme.textMuted,
                "&:hover": {
                  backgroundColor: alpha(darkTheme.error, 0.1),
                  color: darkTheme.error,
                },
              }}
            >
              <Close />
            </IconButton>

            {/* Warning Icon */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${darkTheme.error} 0%, #dc2626 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  boxShadow: `0 8px 32px rgba(239, 68, 68, 0.4)`,
                }}
              >
                <Warning
                  sx={{
                    fontSize: "2.5rem",
                    color: "#ffffff",
                  }}
                />
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: darkTheme.text,
                textAlign: "center",
                mb: 2,
              }}
            >
              Delete Resume?
            </Typography>

            {/* Message */}
            <Typography
              variant="body1"
              sx={{
                color: darkTheme.textSecondary,
                textAlign: "center",
                mb: 1,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to permanently delete
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: darkTheme.text,
                textAlign: "center",
                fontWeight: 600,
                mb: 3,
                background: alpha(darkTheme.error, 0.1),
                borderRadius: "8px",
                p: 1,
                border: `1px solid ${alpha(darkTheme.error, 0.2)}`,
              }}
            >
              "{filename}"
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: darkTheme.textMuted,
                textAlign: "center",
                mb: 4,
                fontStyle: "italic",
              }}
            >
              This action cannot be undone.
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "center" }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={isDeleting}
                sx={{
                  minWidth: 120,
                  borderColor: darkTheme.border,
                  color: darkTheme.textSecondary,
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: darkTheme.textSecondary,
                    backgroundColor: alpha(darkTheme.textSecondary, 0.05),
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={onConfirm}
                disabled={isDeleting}
                startIcon={isDeleting ? undefined : <Delete />}
                sx={{
                  minWidth: 120,
                  background: `linear-gradient(135deg, ${darkTheme.error} 0%, #dc2626 100%)`,
                  color: "#ffffff",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: `0 4px 16px rgba(239, 68, 68, 0.4)`,
                  "&:hover": {
                    background: `linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)`,
                    boxShadow: `0 6px 20px rgba(239, 68, 68, 0.5)`,
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: darkTheme.textMuted,
                    color: darkTheme.background,
                    transform: "none",
                    boxShadow: "none",
                  },
                }}
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
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
              color: "#ffffff",
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
              color: "#ffffff",
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
  onResumeDeleted?: (resumeId: number) => void;
}

const FileCard = ({
  resume,
  onView,
  onDownload,
  onDelete,
  onResumeDeleted,
}: FileCardProps) => {
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);

      // Call delete endpoint
      const response = await fetch(
        `${API_CONFIG.baseURL}/delete/${resume.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowDeleteModal(false);
        setShowSuccessMessage(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);

        onDelete(resume); // Call the optional callback
        // Notify parent to refresh the list if callback is provided
        if (onResumeDeleted) {
          onResumeDeleted(resume.id);
        }
      } else {
        let errorMsg = "";
        try {
          const errorData = await response.json();
          errorMsg =
            errorData.error ||
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          errorMsg = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Please try again.";
      alert(`Failed to delete resume: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${darkTheme.surface} 0%, ${alpha(
          darkTheme.surfaceLight,
          0.8
        )} 100%)`,
        border: `1px solid ${alpha(darkTheme.border, 0.3)}`,
        borderRadius: "20px",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 70% 20%, ${alpha(
            darkTheme.primary,
            0.05
          )} 0%, transparent 50%)`,
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${alpha(
            darkTheme.primary,
            0.3
          )}`,
          border: `1px solid ${alpha(darkTheme.primary, 0.6)}`,
          "& .action-buttons": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "& .file-icon": {
            transform: "scale(1.1) rotate(-5deg)",
          },
          "& .group-chip": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
        {/* Header with enhanced icon and status */}
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
          <Box
            className="file-icon"
            sx={{
              mr: 3,
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background: `linear-gradient(135deg, ${alpha(
                darkTheme.surface,
                0.8
              )} 0%, ${alpha(darkTheme.surfaceLight, 0.9)} 100%)`,
              borderRadius: "12px",
              p: 1.5,
              border: `1px solid ${alpha(darkTheme.border, 0.2)}`,
            }}
          >
            {getFileIcon()}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                color: darkTheme.text,
                fontWeight: 700,
                fontSize: "1.1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 1,
                lineHeight: 1.3,
              }}
              title={resume.original_filename || resume.filename}
            >
              {resume.original_filename || resume.filename}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: getStatusColor(),
                  boxShadow: `0 0 10px ${alpha(getStatusColor(), 0.6)}`,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: getStatusColor(),
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Enhanced File details */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: "wrap" }}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${alpha(
                  darkTheme.primary,
                  0.1
                )} 0%, ${alpha(darkTheme.primary, 0.2)} 100%)`,
                border: `1px solid ${alpha(darkTheme.primary, 0.3)}`,
                borderRadius: "12px",
                px: 2,
                py: 0.8,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <InsertDriveFile
                sx={{ fontSize: "0.9rem", color: darkTheme.primary }}
              />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: darkTheme.primary,
                }}
              >
                {formatFileSize(resume.fileSize)}
              </Typography>
            </Box>

            <Box
              sx={{
                background: `linear-gradient(135deg, ${alpha(
                  darkTheme.success,
                  0.1
                )} 0%, ${alpha(darkTheme.success, 0.2)} 100%)`,
                border: `1px solid ${alpha(darkTheme.success, 0.3)}`,
                borderRadius: "12px",
                px: 2,
                py: 0.8,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Description
                sx={{ fontSize: "0.9rem", color: darkTheme.success }}
              />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: darkTheme.success,
                  textTransform: "uppercase",
                }}
              >
                {resume.fileType}
              </Typography>
            </Box>

            {resume.group &&
              (() => {
                const colorTheme = getGroupColorTheme(resume.group);
                return (
                  <Box
                    className="group-chip"
                    sx={{
                      background: colorTheme.background,
                      border: `2px solid ${colorTheme.border}`,
                      borderRadius: "16px",
                      px: 2.5,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      boxShadow: `0 4px 16px ${colorTheme.shadow}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        boxShadow: `0 8px 24px ${colorTheme.hoverShadow}`,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Assessment sx={{ fontSize: "1rem", color: "#ffffff" }} />
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        textTransform: "capitalize",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {resume.group}
                    </Typography>
                  </Box>
                );
              })()}
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: `linear-gradient(135deg, ${alpha(
                darkTheme.textMuted,
                0.05
              )} 0%, ${alpha(darkTheme.textMuted, 0.1)} 100%)`,
              borderRadius: "10px",
              px: 2,
              py: 1,
              border: `1px solid ${alpha(darkTheme.textMuted, 0.1)}`,
            }}
          >
            <Schedule
              sx={{
                fontSize: "1rem",
                color: darkTheme.textMuted,
                background: `linear-gradient(135deg, ${darkTheme.warning} 0%, #d97706 100%)`,
                borderRadius: "6px",
                p: 0.5,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: darkTheme.textSecondary,
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              Uploaded {formatDate(resume.uploadedAt)}
            </Typography>
          </Box>
        </Box>

        {/* Enhanced Action buttons */}
        <Box
          className="action-buttons"
          sx={{
            opacity: 0,
            transform: "translateY(10px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 1.5,
          }}
        >
          <Button
            size="medium"
            startIcon={<Visibility sx={{ fontSize: "1.1rem" }} />}
            onClick={() => {
              try {
                // Extract filename from filepath by removing uploaded_ prefix and path
                let filename;
                if (resume.filepath) {
                  // Remove "uploaded_" prefix and get filename after the last slash
                  const cleanPath = resume.filepath.replace(
                    /^uploaded_[^/]+\//,
                    ""
                  );
                  filename = cleanPath.split("/").pop() || cleanPath;
                } else {
                  // Fallback to stored_filename or filename
                  filename = resume.stored_filename || resume.filename;
                }
                const viewUrl = `${API_CONFIG.baseURL}/uploads/${filename}`;
                window.open(viewUrl, "_blank");
                onView(resume); // Call the optional callback
              } catch (error) {
                console.error("Error viewing resume:", error);
                alert("Failed to view resume. Please try again.");
              }
            }}
            sx={{
              background: `linear-gradient(135deg, ${darkTheme.primary} 0%, #357abd 100%)`,
              color: "#ffffff",
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              py: 1.2,
              px: 2,
              cursor: "pointer !important",
              boxShadow: `0 4px 16px ${alpha(darkTheme.primary, 0.3)}`,
              border: `1px solid ${alpha(darkTheme.primary, 0.2)}`,
              "&:hover": {
                background: `linear-gradient(135deg, #357abd 0%, #2c5aa0 100%)`,
                boxShadow: `0 8px 24px ${alpha(darkTheme.primary, 0.4)}`,
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            View
          </Button>

          <Button
            size="medium"
            startIcon={<Download sx={{ fontSize: "1.1rem" }} />}
            onClick={async () => {
              try {
                // Extract filename from filepath by removing uploaded_ prefix and path
                let filename;
                if (resume.filepath) {
                  // Remove "uploaded_" prefix and get filename after the last slash
                  const cleanPath = resume.filepath.replace(
                    /^uploaded_[^/]+\//,
                    ""
                  );
                  filename = cleanPath.split("/").pop() || cleanPath;
                } else {
                  // Fallback to stored_filename or filename
                  filename = resume.stored_filename || resume.filename;
                }
                const displayFilename =
                  resume.original_filename || resume.filename;

                // Fetch the file for download
                const response = await fetch(
                  `${API_CONFIG.baseURL}/uploads/${filename}`,
                  {
                    method: "GET",
                  }
                );

                if (response.ok) {
                  // Get the file as a blob
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);

                  // Create a temporary link element and trigger download
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = displayFilename; // Use original filename for download
                  document.body.appendChild(link);
                  link.click();

                  // Clean up
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);

                  onDownload(resume); // Call the optional callback
                } else {
                  throw new Error("Download failed");
                }
              } catch (error) {
                console.error("Error downloading resume:", error);
                alert("Failed to download resume. Please try again.");
              }
            }}
            sx={{
              background: `linear-gradient(135deg, ${darkTheme.success} 0%, #16a34a 100%)`,
              color: "#ffffff",
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              py: 1.2,
              px: 2,
              cursor: "pointer !important",
              boxShadow: `0 4px 16px ${alpha(darkTheme.success, 0.3)}`,
              border: `1px solid ${alpha(darkTheme.success, 0.2)}`,
              "&:hover": {
                background: `linear-gradient(135deg, #16a34a 0%, #15803d 100%)`,
                boxShadow: `0 8px 24px ${alpha(darkTheme.success, 0.4)}`,
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Download
          </Button>

          <Button
            size="medium"
            startIcon={<Delete sx={{ fontSize: "1.1rem" }} />}
            onClick={() => setShowDeleteModal(true)}
            sx={{
              background: `linear-gradient(135deg, ${darkTheme.error} 0%, #dc2626 100%)`,
              color: "#ffffff",
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              py: 1.2,
              px: 2,
              cursor: "pointer !important",
              boxShadow: `0 4px 16px ${alpha(darkTheme.error, 0.3)}`,
              border: `1px solid ${alpha(darkTheme.error, 0.2)}`,
              "&:hover": {
                background: `linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)`,
                boxShadow: `0 8px 24px ${alpha(darkTheme.error, 0.4)}`,
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Delete
          </Button>
        </Box>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          filename={resume.original_filename || resume.filename}
          isDeleting={isDeleting}
        />

        {/* Success Message */}
        {showSuccessMessage && (
          <Box
            sx={{
              position: "fixed",
              top: 24,
              right: 24,
              zIndex: 9999,
              animation: "slideInRight 0.3s ease-out",
              "@keyframes slideInRight": {
                from: {
                  transform: "translateX(100%)",
                  opacity: 0,
                },
                to: {
                  transform: "translateX(0)",
                  opacity: 1,
                },
              },
            }}
          >
            <Card
              sx={{
                background: `linear-gradient(135deg, ${darkTheme.success} 0%, #16a34a 100%)`,
                color: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(34, 197, 94, 0.4)",
                minWidth: 300,
                border: `2px solid ${alpha(darkTheme.success, 0.3)}`,
              }}
            >
              <CardContent
                sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}
              >
                <CheckCircleOutline sx={{ fontSize: "1.5rem" }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontSize: "1rem", mb: 0.5 }}
                  >
                    Resume Deleted Successfully
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, fontSize: "0.875rem" }}
                  >
                    "{resume.original_filename || resume.filename}" has been
                    permanently removed.
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setShowSuccessMessage(false)}
                  sx={{
                    color: "#ffffff",
                    ml: "auto",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <Close sx={{ fontSize: "1.2rem" }} />
                </IconButton>
              </CardContent>
            </Card>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component Props - Simplified to accept resumes as props
interface ResumeCollectionProps {
  resumes: Resume[];
  onView?: (resume: Resume) => void;
  onDownload?: (resume: Resume) => void;
  onDelete?: (resume: Resume) => void;
  onResumeDeleted?: (resumeId: number) => void;
  isLoading?: boolean;
}

const ResumeCollection = ({
  resumes,
  onView = () => {},
  onDownload = () => {},
  onDelete = () => {},
  onResumeDeleted = () => {},
  isLoading = false,
}: ResumeCollectionProps) => {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Fetch groups using the useGroups hook
  const {
    groups,
    loading: groupsLoading,
    error: groupsError,
    refreshGroups,
    clearError: clearGroupsError,
  } = useGroups();

  // Group statistics - now uses fetched groups and counts resumes in each
  const groupStats = useMemo(() => {
    if (!groups.length) return [];

    // Create stats for ALL groups from API, not just ones with resumes
    const groupStatsArray = groups.map((group) => {
      const resumeCount = resumes.filter((resume) => {
        if (!resume.group) return false;
        return (
          resume.group.toLowerCase().trim() === group.name.toLowerCase().trim()
        );
      }).length;

      return {
        group: group.name,
        count: resumeCount,
        hasResumes: resumeCount > 0,
        groupId: group.id,
      };
    });

    // Sort groups: first by whether they have resumes (with resumes first),
    // then by count (descending), then alphabetically
    return groupStatsArray.sort((a, b) => {
      // First, prioritize groups with resumes
      if (a.hasResumes !== b.hasResumes) {
        return b.hasResumes ? 1 : -1; // hasResumes groups first
      }

      // Then sort by count (descending)
      if (a.count !== b.count) {
        return b.count - a.count;
      }

      // Finally, sort alphabetically
      return a.group.localeCompare(b.group);
    });
  }, [groups, resumes]);

  // Filtered resumes - now considers both search and group filter
  const filteredResumes = useMemo(() => {
    let filtered = resumes;

    // Filter by selected group first
    if (selectedGroup) {
      filtered = filtered.filter(
        (resume) =>
          resume.group?.toLowerCase().trim() ===
          selectedGroup.toLowerCase().trim()
      );
    }

    // Then filter by search query within the group (or all resumes if no group selected)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((resume) => {
        const searchableFilename = resume.original_filename || resume.filename;
        return searchableFilename.toLowerCase().includes(query);
      });
    }

    return filtered;
  }, [resumes, searchQuery, selectedGroup]);

  // Enhanced Statistics - Only 2 essential metrics to avoid clutter
  const stats = useMemo(() => {
    const totalFiles = resumes.length;
    const completed = resumes.filter((r) => r.status === "completed").length;

    return {
      totalFiles,
      completed,
    };
  }, [resumes]);

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

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedGroup(null);
    setSearchQuery("");
  };

  // Handle resume deletion with proper callback chaining
  const handleResumeDeleted = (resumeId: number) => {
    // Clear search if the deleted resume was in the current filtered results
    const deletedResume = filteredResumes.find((r) => r.id === resumeId);
    if (deletedResume && searchQuery.trim()) {
      // Check if this was the only result matching the search
      const remainingMatches = filteredResumes.filter((r) => r.id !== resumeId);
      if (remainingMatches.length === 0) {
        setSearchQuery("");
      }
    }

    // Call the parent callback to refresh data
    onResumeDeleted(resumeId);
  };

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
        {/* Combined Search and Group Filter Section */}
        <Box
          sx={{
            mb: 6,
            background: `linear-gradient(135deg, ${alpha(
              darkTheme.surface,
              0.6
            )} 0%, ${alpha(darkTheme.surfaceLight, 0.8)} 100%)`,
            borderRadius: "24px",
            p: 4,
            border: `1px solid ${alpha(darkTheme.border, 0.3)}`,
            backdropFilter: "blur(8px)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 20% 80%, ${alpha(
                darkTheme.primary,
                0.1
              )} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(
                darkTheme.success,
                0.1
              )} 0%, transparent 50%)`,
              pointerEvents: "none",
            },
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  background: `linear-gradient(135deg, ${darkTheme.text} 0%, ${darkTheme.textSecondary} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Search sx={{ fontSize: "1.5rem", color: darkTheme.primary }} />
                Search & Filter Resumes
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: darkTheme.textSecondary,
                  fontSize: "0.9rem",
                }}
              >
                {groupsError
                  ? "Error loading groups"
                  : selectedGroup
                  ? `Showing ${filteredResumes.length} ${selectedGroup} resumes`
                  : `${groupStats.length} groups available • ${resumes.length} total resumes`}
              </Typography>
            </Box>

            {(selectedGroup || searchQuery.trim()) && (
              <Button
                variant="contained"
                size="small"
                onClick={clearAllFilters}
                startIcon={<Close sx={{ fontSize: "1rem" }} />}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(
                    darkTheme.error,
                    0.8
                  )} 0%, ${alpha(darkTheme.error, 0.9)} 100%)`,
                  color: "#ffffff",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  boxShadow: `0 4px 16px ${alpha(darkTheme.error, 0.3)}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${darkTheme.error} 0%, #dc2626 100%)`,
                    boxShadow: `0 6px 20px ${alpha(darkTheme.error, 0.4)}`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Clear All Filters
              </Button>
            )}

            {/* Groups Error Handling */}
            {groupsError && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  clearGroupsError();
                  refreshGroups();
                }}
                startIcon={<Warning sx={{ fontSize: "1rem" }} />}
                sx={{
                  borderColor: darkTheme.warning,
                  color: darkTheme.warning,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  "&:hover": {
                    borderColor: darkTheme.warning,
                    backgroundColor: alpha(darkTheme.warning, 0.1),
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Retry Groups
              </Button>
            )}
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 4, position: "relative", zIndex: 1 }}>
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
                    <Search
                      sx={{ color: darkTheme.textMuted, fontSize: "1.3rem" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  background: alpha(darkTheme.surface, 0.8),
                  color: darkTheme.text,
                  border: `1px solid ${alpha(darkTheme.border, 0.4)}`,
                  boxShadow: `0 2px 12px ${alpha(darkTheme.background, 0.3)}`,
                  "& input": {
                    color: darkTheme.text,
                    py: 2.5,
                    px: 2,
                    fontSize: "1rem",
                    fontWeight: 500,
                    "&::placeholder": {
                      color: darkTheme.textMuted,
                      opacity: 1,
                      fontSize: "1rem",
                    },
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover": {
                    background: alpha(darkTheme.surfaceLight, 0.9),
                    border: `1px solid ${alpha(darkTheme.primary, 0.4)}`,
                    boxShadow: `0 4px 20px ${alpha(darkTheme.primary, 0.1)}`,
                  },
                  "&.Mui-focused": {
                    background: alpha(darkTheme.surfaceLight, 0.9),
                    border: `1px solid ${darkTheme.primary}`,
                    boxShadow: `0 4px 24px ${alpha(darkTheme.primary, 0.15)}`,
                  },
                  "&.Mui-disabled": {
                    background: alpha(darkTheme.surface, 0.3),
                    color: darkTheme.textMuted,
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
              }}
            />
          </Box>

          {/* Group Filter Section */}
          {!groupsError && groupStats.length > 0 && (
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {/* Filter by Groups Label */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: darkTheme.text,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Assessment
                    sx={{ fontSize: "1.2rem", color: darkTheme.primary }}
                  />
                  Filter by Groups
                  {groupsLoading && (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: `2px solid ${alpha(darkTheme.primary, 0.3)}`,
                        borderTop: `2px solid ${darkTheme.primary}`,
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
                <Typography
                  variant="body2"
                  sx={{
                    color: darkTheme.textSecondary,
                    fontSize: "0.85rem",
                  }}
                >
                  {groupsLoading
                    ? "Loading groups..."
                    : "Select a group to filter resumes. Groups without resumes are disabled. Scroll horizontally to view all available groups"}
                </Typography>
              </Box>

              {/* Horizontal Scrollable Group Chips */}
              <Box
                sx={{
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "20px",
                    height: "100%",
                    background: `linear-gradient(90deg, ${alpha(
                      darkTheme.surfaceLight,
                      0.8
                    )} 0%, transparent 100%)`,
                    zIndex: 2,
                    pointerEvents: "none",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "20px",
                    height: "100%",
                    background: `linear-gradient(270deg, ${alpha(
                      darkTheme.surfaceLight,
                      0.8
                    )} 0%, transparent 100%)`,
                    zIndex: 2,
                    pointerEvents: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2.5,
                    alignItems: "center",
                    overflowX: "auto",
                    overflowY: "hidden",
                    py: 2,
                    px: 1,
                    scrollBehavior: "smooth",
                    minHeight: 64, // Ensure consistent height even when loading
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      background: alpha(darkTheme.border, 0.1),
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: `linear-gradient(90deg, ${darkTheme.primary} 0%, ${darkTheme.success} 100%)`,
                      borderRadius: "3px",
                      "&:hover": {
                        background: `linear-gradient(90deg, #357abd 0%, #16a34a 100%)`,
                      },
                    },
                    // Custom scrollbar for Firefox
                    scrollbarWidth: "thin",
                    scrollbarColor: `${darkTheme.primary} ${alpha(
                      darkTheme.border,
                      0.1
                    )}`,
                  }}
                >
                  {groupsLoading
                    ? // Loading skeleton for groups
                      Array.from({ length: 4 }).map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            flexShrink: 0,
                            height: 48,
                            width: 120,
                            borderRadius: "16px",
                            background: `linear-gradient(90deg, ${alpha(
                              darkTheme.surface,
                              0.3
                            )} 0%, ${alpha(
                              darkTheme.surfaceLight,
                              0.5
                            )} 50%, ${alpha(darkTheme.surface, 0.3)} 100%)`,
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s ease-in-out infinite",
                            "@keyframes shimmer": {
                              "0%": {
                                backgroundPosition: "-200% 0",
                              },
                              "100%": {
                                backgroundPosition: "200% 0",
                              },
                            },
                          }}
                        />
                      ))
                    : groupStats.map(({ group, count, hasResumes }, index) => {
                        const colorTheme = getGroupColorTheme(group);
                        const isSelected = selectedGroup === group;

                        return (
                          <Box
                            key={group}
                            sx={{
                              flexShrink: 0,
                              position: "relative",
                              animation: `fadeInScale 0.6s ease-out ${
                                index * 0.05
                              }s both`,
                              "@keyframes fadeInScale": {
                                from: {
                                  opacity: 0,
                                  transform: "scale(0.8)",
                                },
                                to: {
                                  opacity: 1,
                                  transform: "scale(1)",
                                },
                              },
                            }}
                          >
                            <Chip
                              label={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    component="span"
                                    sx={{
                                      fontWeight: 700,
                                      textTransform: "capitalize",
                                      fontSize: "0.9rem",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {group}
                                  </Typography>
                                  <Box
                                    sx={{
                                      background: isSelected
                                        ? "rgba(255, 255, 255, 0.3)"
                                        : hasResumes
                                        ? "rgba(255, 255, 255, 0.2)"
                                        : "rgba(255, 255, 255, 0.1)",
                                      color: hasResumes
                                        ? "#ffffff"
                                        : alpha("#ffffff", 0.6),
                                      borderRadius: "10px",
                                      px: 1,
                                      py: 0.2,
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      minWidth: "24px",
                                      textAlign: "center",
                                      border: isSelected
                                        ? "1px solid rgba(255, 255, 255, 0.4)"
                                        : hasResumes
                                        ? "1px solid rgba(255, 255, 255, 0.2)"
                                        : "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                  >
                                    {count === 0 ? "0" : count}
                                  </Box>
                                </Box>
                              }
                              onClick={() =>
                                handleGroupSelect(group, hasResumes)
                              }
                              disabled={groupsLoading || !hasResumes}
                              sx={{
                                height: 48,
                                px: 2,
                                cursor: hasResumes ? "pointer" : "not-allowed",
                                position: "relative",
                                overflow: "hidden",
                                minWidth: "fit-content",
                                opacity: hasResumes ? 1 : 0.5,
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: hasResumes
                                    ? colorTheme.background
                                    : `linear-gradient(135deg, ${alpha(
                                        darkTheme.textMuted,
                                        0.2
                                      )} 0%, ${alpha(
                                        darkTheme.textMuted,
                                        0.3
                                      )} 100%)`,
                                  opacity: isSelected ? 1 : 0,
                                  transition: "opacity 0.3s ease",
                                  zIndex: -1,
                                },
                                "&::after": {
                                  content: '""',
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: hasResumes
                                    ? `linear-gradient(135deg, ${alpha(
                                        colorTheme.border,
                                        0.1
                                      )} 0%, ${alpha(
                                        colorTheme.border,
                                        0.2
                                      )} 100%)`
                                    : `linear-gradient(135deg, ${alpha(
                                        darkTheme.textMuted,
                                        0.1
                                      )} 0%, ${alpha(
                                        darkTheme.textMuted,
                                        0.15
                                      )} 100%)`,
                                  opacity: isSelected ? 0 : 1,
                                  transition: "opacity 0.3s ease",
                                  zIndex: -1,
                                },
                                color: hasResumes
                                  ? isSelected
                                    ? "#ffffff"
                                    : colorTheme.border
                                  : darkTheme.textMuted,
                                border: `2px solid ${
                                  hasResumes
                                    ? isSelected
                                      ? colorTheme.border
                                      : alpha(colorTheme.border, 0.4)
                                    : alpha(darkTheme.textMuted, 0.3)
                                }`,
                                borderRadius: "16px",
                                boxShadow: hasResumes
                                  ? isSelected
                                    ? `0 8px 32px ${
                                        colorTheme.hoverShadow
                                      }, 0 0 0 1px ${alpha(
                                        colorTheme.border,
                                        0.2
                                      )}`
                                    : `0 4px 16px ${alpha(
                                        colorTheme.shadow,
                                        0.2
                                      )}`
                                  : `0 2px 8px ${alpha(
                                      darkTheme.textMuted,
                                      0.1
                                    )}`,
                                transform: isSelected
                                  ? "translateY(-4px) scale(1.02)"
                                  : "translateY(0) scale(1)",
                                "&:hover": hasResumes
                                  ? {
                                      "&::before": {
                                        opacity: 1,
                                      },
                                      "&::after": {
                                        opacity: 0,
                                      },
                                      color: "#ffffff",
                                      border: `2px solid ${colorTheme.border}`,
                                      boxShadow: `0 12px 40px ${
                                        colorTheme.hoverShadow
                                      }, 0 0 0 1px ${alpha(
                                        colorTheme.border,
                                        0.3
                                      )}`,
                                      transform: "translateY(-6px) scale(1.05)",
                                    }
                                  : {},
                                "&:active": hasResumes
                                  ? {
                                      transform: "translateY(-2px) scale(1.02)",
                                    }
                                  : {},
                                "&.Mui-disabled": {
                                  opacity: hasResumes ? 0.6 : 0.4,
                                  cursor: hasResumes
                                    ? "default"
                                    : "not-allowed",
                                  transform: "none",
                                  "&:hover": {
                                    transform: "none",
                                  },
                                },
                              }}
                            />
                          </Box>
                        );
                      })}
                </Box>
              </Box>
            </Box>
          )}

          {/* No Groups Available Message */}
          {!groupsError &&
            !groupsLoading &&
            groupStats.length === 0 &&
            resumes.length > 0 && (
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  textAlign: "center",
                  py: 4,
                  px: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    darkTheme.warning,
                    0.1
                  )} 0%, ${alpha(darkTheme.warning, 0.2)} 100%)`,
                  borderRadius: "16px",
                  border: `1px solid ${alpha(darkTheme.warning, 0.3)}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: darkTheme.warning,
                    fontWeight: 600,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Assessment sx={{ fontSize: "1.2rem" }} />
                  No Groups Available
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: darkTheme.textSecondary,
                    fontSize: "0.9rem",
                  }}
                >
                  Groups are not available at the moment. You can still search
                  through all resumes using the search bar above.
                </Typography>
              </Box>
            )}
        </Box>

        {/* Enhanced Loading State */}
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 12,
            }}
          >
            <Card
              sx={{
                textAlign: "center",
                py: 8,
                px: 6,
                maxWidth: 500,
                background: `linear-gradient(135deg, ${
                  darkTheme.surface
                } 0%, ${alpha(darkTheme.surfaceLight, 0.9)} 100%)`,
                border: `1px solid ${alpha(darkTheme.primary, 0.2)}`,
                borderRadius: "24px",
                boxShadow: `0 20px 60px ${alpha(darkTheme.background, 0.4)}`,
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 30% 40%, ${alpha(
                    darkTheme.primary,
                    0.1
                  )} 0%, transparent 70%), radial-gradient(circle at 70% 60%, ${alpha(
                    darkTheme.success,
                    0.1
                  )} 0%, transparent 70%)`,
                  pointerEvents: "none",
                },
              }}
            >
              <CardContent sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    position: "relative",
                    mb: 4,
                    mx: "auto",
                    width: "fit-content",
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: `conic-gradient(${darkTheme.primary} 0deg, ${darkTheme.success} 120deg, ${darkTheme.warning} 240deg, ${darkTheme.primary} 360deg)`,
                      animation: "spin 2s linear infinite",
                      mx: "auto",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: darkTheme.surface,
                      },
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      animation: "pulse 1.5s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": {
                          transform: "translate(-50%, -50%) scale(1)",
                          opacity: 1,
                        },
                        "50%": {
                          transform: "translate(-50%, -50%) scale(1.1)",
                          opacity: 0.8,
                        },
                      },
                    }}
                  >
                    <InsertDriveFile
                      sx={{ fontSize: "2rem", color: darkTheme.primary }}
                    />
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${darkTheme.text} 0%, ${darkTheme.textSecondary} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Loading Your Resumes
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: darkTheme.textSecondary,
                    mb: 3,
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  Please wait while we fetch your resume collection...
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: darkTheme.primary,
                        animation: `bounce 1.4s ease-in-out ${
                          i * 0.16
                        }s infinite both`,
                        "@keyframes bounce": {
                          "0%, 80%, 100%": {
                            transform: "scale(0.8)",
                            opacity: 0.5,
                          },
                          "40%": {
                            transform: "scale(1.2)",
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : /* Resume Grid */
        filteredResumes.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 12,
            }}
          >
            <Card
              sx={{
                textAlign: "center",
                py: 8,
                px: 6,
                maxWidth: 500,
                background: `linear-gradient(135deg, ${
                  darkTheme.surface
                } 0%, ${alpha(darkTheme.surfaceLight, 0.9)} 100%)`,
                border: `1px solid ${alpha(darkTheme.border, 0.3)}`,
                borderRadius: "24px",
                boxShadow: `0 20px 60px ${alpha(darkTheme.background, 0.4)}`,
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 20% 20%, ${alpha(
                    darkTheme.textMuted,
                    0.05
                  )} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${alpha(
                    darkTheme.textMuted,
                    0.05
                  )} 0%, transparent 50%)`,
                  pointerEvents: "none",
                },
              }}
            >
              <CardContent sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    position: "relative",
                    mb: 4,
                    mx: "auto",
                    width: "fit-content",
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${alpha(
                        darkTheme.textMuted,
                        0.1
                      )} 0%, ${alpha(darkTheme.textMuted, 0.2)} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      border: `2px dashed ${alpha(darkTheme.textMuted, 0.3)}`,
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: -10,
                        left: -10,
                        right: -10,
                        bottom: -10,
                        borderRadius: "50%",
                        border: `1px solid ${alpha(darkTheme.textMuted, 0.1)}`,
                        animation: "pulse 2s ease-in-out infinite",
                      },
                      "@keyframes pulse": {
                        "0%, 100%": {
                          transform: "scale(1)",
                          opacity: 0.3,
                        },
                        "50%": {
                          transform: "scale(1.05)",
                          opacity: 0.6,
                        },
                      },
                    }}
                  >
                    <FolderOpen
                      sx={{
                        fontSize: "3.5rem",
                        color: darkTheme.textMuted,
                        opacity: 0.8,
                      }}
                    />
                  </Box>
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${darkTheme.text} 0%, ${darkTheme.textSecondary} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "1.8rem",
                  }}
                >
                  {selectedGroup && searchQuery.trim()
                    ? `No ${selectedGroup} resumes found`
                    : selectedGroup
                    ? `No ${selectedGroup} resumes found`
                    : searchQuery.trim()
                    ? "No resumes found"
                    : "No resumes uploaded yet"}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: darkTheme.textSecondary,
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    mb: 4,
                    maxWidth: 400,
                    mx: "auto",
                  }}
                >
                  {selectedGroup && searchQuery.trim()
                    ? "Try adjusting your search criteria or select a different group to find what you're looking for."
                    : selectedGroup
                    ? "No resumes found in this group. Try selecting a different technology stack."
                    : searchQuery.trim()
                    ? "Try adjusting your search criteria or browse all resumes."
                    : "Upload your first resume to get started with building your collection."}
                </Typography>

                {(searchQuery.trim() || selectedGroup) && (
                  <Button
                    variant="contained"
                    onClick={clearAllFilters}
                    startIcon={<Close />}
                    sx={{
                      background: `linear-gradient(135deg, ${darkTheme.primary} 0%, #357abd 100%)`,
                      color: "#ffffff",
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: `0 8px 24px ${alpha(darkTheme.primary, 0.3)}`,
                      "&:hover": {
                        background: `linear-gradient(135deg, #357abd 0%, #2c5aa0 100%)`,
                        boxShadow: `0 12px 32px ${alpha(
                          darkTheme.primary,
                          0.4
                        )}`,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fit, minmax(380px, 1fr))",
                lg: "repeat(3, 1fr)",
              },
              gap: 4,
              maxWidth: "1400px",
              mx: "auto",
              px: 2,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -20,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: 1,
                background: `linear-gradient(90deg, transparent 0%, ${alpha(
                  darkTheme.border,
                  0.5
                )} 50%, transparent 100%)`,
                zIndex: 0,
              },
            }}
          >
            {filteredResumes.map((resume) => (
              <FileCard
                key={`${resume.id}-${resume.filename}`}
                resume={resume}
                onView={onView}
                onDownload={onDownload}
                onDelete={onDelete}
                onResumeDeleted={handleResumeDeleted}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResumeCollection;
