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

// Theme type definitions
interface LightTheme {
  background: string;
  surface: string;
  surfaceLight: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
}

interface ColorTheme {
  primary: string;
  secondary: string;
  gradient: string;
  shadowColor: string;
  hoverShadowColor: string;
  background: string;
  border: string;
}

// Light theme colors with refined palette
const lightTheme: LightTheme = {
  background: "#FFFFFF",
  surface: "#F5F5F5", // n100
  surfaceLight: "#EAEAEC", // n150
  primary: "#3077F3", // primary_ui_blue.p500
  success: "#41E6F8", // brand_gradient.cyan
  warning: "#FDA052", // brand_gradient.orange
  error: "#B96AF7", // brand_gradient.purple
  text: "#171921", // n3000
  textSecondary: "#434654", // n900
  textMuted: "#82838D", // n600
  border: "#EAEAEC", // n150 - lighter border for elegance
};

// Sophisticated color palette for groups with gradients
const colorPalette: ColorTheme[] = [
  {
    primary: "#3077F3", // primary_ui_blue.p500
    secondary: "#94BAFD", // primary_ui_blue.p400
    gradient: "linear-gradient(135deg, #3077F3 0%, #94BAFD 100%)",
    shadowColor: "rgba(48, 119, 243, 0.12)",
    hoverShadowColor: "rgba(48, 119, 243, 0.2)",
    background: "#FFFFFF",
    border: "#3077F3",
  },
  {
    primary: "#41E6F8", // brand_gradient.cyan
    secondary: "#3077F3", // brand_gradient.blue
    gradient: "linear-gradient(135deg, #41E6F8 0%, #3077F3 100%)",
    shadowColor: "rgba(65, 230, 248, 0.12)",
    hoverShadowColor: "rgba(65, 230, 248, 0.2)",
    background: "#FFFFFF",
    border: "#41E6F8",
  },
  {
    primary: "#B96AF7", // brand_gradient.purple
    secondary: "#3077F3", // brand_gradient.blue
    gradient: "linear-gradient(135deg, #B96AF7 0%, #3077F3 100%)",
    shadowColor: "rgba(185, 106, 247, 0.12)",
    hoverShadowColor: "rgba(185, 106, 247, 0.2)",
    background: "#FFFFFF",
    border: "#B96AF7",
  },
  {
    primary: "#FDA052", // brand_gradient.orange
    secondary: "#B96AF7", // brand_gradient.purple
    gradient: "linear-gradient(135deg, #FDA052 0%, #B96AF7 100%)",
    shadowColor: "rgba(253, 160, 82, 0.12)",
    hoverShadowColor: "rgba(253, 160, 82, 0.2)",
    background: "#FFFFFF",
    border: "#FDA052",
  },
  {
    primary: "#434654", // n900
    secondary: "#2E3141", // n1000
    gradient: "linear-gradient(135deg, #434654 0%, #2E3141 100%)",
    shadowColor: "rgba(67, 70, 84, 0.12)",
    hoverShadowColor: "rgba(67, 70, 84, 0.2)",
    background: "#FFFFFF",
    border: "#434654",
  },
  {
    primary: "#585A67", // n800
    secondary: "#434654", // n900
    gradient: "linear-gradient(135deg, #585A67 0%, #434654 100%)",
    shadowColor: "rgba(88, 90, 103, 0.12)",
    hoverShadowColor: "rgba(88, 90, 103, 0.2)",
    background: "#FFFFFF",
    border: "#585A67",
  },
];

// Group to color palette index mapping
const groupColorIndex: { [key: string]: number } = {
  frontend: 0, // Blue
  backend: 1, // Cyan
  fullstack: 2, // Purple
  general: 3, // Orange
  mobile: 4, // Gray
  devops: 5, // Light Gray
  design: 2, // Purple
  default: 5, // Light Gray
};

// Helper function to get color theme for a group
const getGroupColorTheme = (groupName: string = "default"): ColorTheme => {
  const index =
    groupColorIndex[groupName.toLowerCase()] ?? groupColorIndex.default;
  return colorPalette[index];
};

// Enhanced styles for premium UI components
const styles = {
  container: {
    backgroundColor: lightTheme.background,
    borderRadius: "16px",
    padding: "32px",
    boxShadow: `0 8px 32px ${alpha(lightTheme.text, 0.08)}`,
    border: `1px solid ${lightTheme.border}`,
  },
  searchInput: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: lightTheme.surface,
      transition: "all 0.3s ease",
      border: `1px solid ${lightTheme.border}`,
      "&:hover": {
        backgroundColor: lightTheme.surfaceLight,
        boxShadow: "0 4px 12px rgba(23, 25, 33, 0.06)",
      },
      "&.Mui-focused": {
        backgroundColor: lightTheme.background,
        boxShadow: "0 4px 12px rgba(48, 119, 243, 0.12)",
        border: `1px solid ${lightTheme.primary}`,
      },
    },
  },
  groupChip: (color: ColorTheme) => ({
    borderRadius: "12px",
    padding: "8px 16px",
    background: color.gradient,
    boxShadow: `0 8px 16px ${color.shadowColor}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 12px 24px ${color.hoverShadowColor}`,
    },
    "& .MuiChip-label": {
      color: "#FFFFFF",
      fontWeight: 600,
      fontSize: "0.95rem",
    },
    "& .MuiChip-deleteIcon": {
      color: "#FFFFFF",
      opacity: 0.8,
      "&:hover": {
        opacity: 1,
      },
    },
  }),
  card: (color: ColorTheme) => ({
    backgroundColor: lightTheme.background,
    borderRadius: "16px",
    boxShadow: `0 8px 16px ${color.shadowColor}`,
    border: `2px solid ${color.primary}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 12px 24px ${color.hoverShadowColor}`,
    },
    mb: 2,
  }),
  fileIcon: (color: ColorTheme) => ({
    width: 40,
    height: 40,
    borderRadius: "8px",
    background: color.gradient,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  iconButton: {
    color: lightTheme.textMuted,
    "&:hover": {
      color: lightTheme.text,
      backgroundColor: lightTheme.surface,
    },
  },
  deleteButton: {
    color: lightTheme.textMuted,
    "&:hover": {
      color: lightTheme.error,
      backgroundColor: alpha(lightTheme.error, 0.1),
    },
  },
  statusChip: (isProcessed: boolean) => ({
    backgroundColor: isProcessed
      ? alpha(lightTheme.success, 0.1)
      : alpha(lightTheme.warning, 0.1),
    color: isProcessed ? lightTheme.success : lightTheme.warning,
    "& .MuiChip-icon": {
      color: isProcessed ? lightTheme.success : lightTheme.warning,
    },
  }),
  scrollbar: {
    "&::-webkit-scrollbar": {
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: lightTheme.surface,
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: lightTheme.border,
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: lightTheme.textMuted,
      },
    },
  },
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
            background: `linear-gradient(135deg, ${lightTheme.surface} 0%, ${lightTheme.surfaceLight} 100%)`,
            border: `2px solid ${lightTheme.error}`,
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
                color: lightTheme.textMuted,
                "&:hover": {
                  backgroundColor: alpha(lightTheme.error, 0.1),
                  color: lightTheme.error,
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
                  background: `linear-gradient(135deg, ${lightTheme.error} 0%, #dc2626 100%)`,
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
                color: lightTheme.text,
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
                color: lightTheme.textSecondary,
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
                color: lightTheme.text,
                textAlign: "center",
                fontWeight: 600,
                mb: 3,
                background: alpha(lightTheme.error, 0.1),
                borderRadius: "8px",
                p: 1,
                border: `1px solid ${alpha(lightTheme.error, 0.2)}`,
              }}
            >
              "{filename}"
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: lightTheme.textMuted,
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
                  borderColor: lightTheme.border,
                  color: lightTheme.textSecondary,
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: lightTheme.textSecondary,
                    backgroundColor: alpha(lightTheme.textSecondary, 0.05),
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
                  background: `linear-gradient(135deg, ${lightTheme.error} 0%, #dc2626 100%)`,
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
                    background: lightTheme.textMuted,
                    color: lightTheme.background,
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
        return lightTheme.success;
      case "processing":
        return lightTheme.warning;
      case "failed":
        return lightTheme.error;
      default:
        return lightTheme.primary;
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
        background: `linear-gradient(135deg, ${lightTheme.surface} 0%, ${alpha(
          lightTheme.surfaceLight,
          0.8
        )} 100%)`,
        border: `1px solid ${alpha(lightTheme.border, 0.3)}`,
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
            lightTheme.primary,
            0.05
          )} 0%, transparent 50%)`,
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${alpha(
            lightTheme.primary,
            0.3
          )}`,
          border: `1px solid ${alpha(lightTheme.primary, 0.6)}`,
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
                lightTheme.surface,
                0.8
              )} 0%, ${alpha(lightTheme.surfaceLight, 0.9)} 100%)`,
              borderRadius: "12px",
              p: 1.5,
              border: `1px solid ${alpha(lightTheme.border, 0.2)}`,
            }}
          >
            {getFileIcon()}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                color: lightTheme.text,
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
                  lightTheme.primary,
                  0.1
                )} 0%, ${alpha(lightTheme.primary, 0.2)} 100%)`,
                border: `1px solid ${alpha(lightTheme.primary, 0.3)}`,
                borderRadius: "12px",
                px: 2,
                py: 0.8,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <InsertDriveFile
                sx={{ fontSize: "0.9rem", color: lightTheme.primary }}
              />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: lightTheme.primary,
                }}
              >
                {formatFileSize(resume.fileSize)}
              </Typography>
            </Box>

            <Box
              sx={{
                background: `linear-gradient(135deg, ${alpha(
                  lightTheme.success,
                  0.1
                )} 0%, ${alpha(lightTheme.success, 0.2)} 100%)`,
                border: `1px solid ${alpha(lightTheme.success, 0.3)}`,
                borderRadius: "12px",
                px: 2,
                py: 0.8,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Description
                sx={{ fontSize: "0.9rem", color: lightTheme.success }}
              />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: lightTheme.success,
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
                      background: colorTheme.gradient,
                      border: `2px solid ${colorTheme.primary}`,
                      borderRadius: "16px",
                      px: 2.5,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      boxShadow: `0 4px 16px ${colorTheme.shadowColor}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        boxShadow: `0 8px 24px ${colorTheme.hoverShadowColor}`,
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
                lightTheme.textMuted,
                0.05
              )} 0%, ${alpha(lightTheme.textMuted, 0.1)} 100%)`,
              borderRadius: "10px",
              px: 2,
              py: 1,
              border: `1px solid ${alpha(lightTheme.textMuted, 0.1)}`,
            }}
          >
            <Schedule
              sx={{
                fontSize: "1rem",
                color: lightTheme.textMuted,
                background: `linear-gradient(135deg, ${lightTheme.warning} 0%, #d97706 100%)`,
                borderRadius: "6px",
                p: 0.5,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: lightTheme.textSecondary,
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
              background: `linear-gradient(135deg, ${lightTheme.primary} 0%, #357abd 100%)`,
              color: "#ffffff",
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              py: 1.2,
              px: 2,
              cursor: "pointer !important",
              boxShadow: `0 4px 16px ${alpha(lightTheme.primary, 0.3)}`,
              border: `1px solid ${alpha(lightTheme.primary, 0.2)}`,
              "&:hover": {
                background: `linear-gradient(135deg, #357abd 0%, #2c5aa0 100%)`,
                boxShadow: `0 8px 24px ${alpha(lightTheme.primary, 0.4)}`,
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
              background: `linear-gradient(135deg, ${lightTheme.success} 0%, #16a34a 100%)`,
              color: "#ffffff",
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              py: 1.2,
              px: 2,
              cursor: "pointer !important",
              boxShadow: `0 4px 16px ${alpha(lightTheme.success, 0.3)}`,
              border: `1px solid ${alpha(lightTheme.success, 0.2)}`,
              "&:hover": {
                background: `linear-gradient(135deg, #16a34a 0%, #15803d 100%)`,
                boxShadow: `0 8px 24px ${alpha(lightTheme.success, 0.4)}`,
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
              background: `linear-gradient(135deg, ${lightTheme.error} 0%, #dc2626 100%)`,
              color: "#ffffff",
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              py: 1.2,
              px: 2,
              cursor: "pointer !important",
              boxShadow: `0 4px 16px ${alpha(lightTheme.error, 0.3)}`,
              border: `1px solid ${alpha(lightTheme.error, 0.2)}`,
              "&:hover": {
                background: `linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)`,
                boxShadow: `0 8px 24px ${alpha(lightTheme.error, 0.4)}`,
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
                background: `linear-gradient(135deg, ${lightTheme.success} 0%, #16a34a 100%)`,
                color: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(34, 197, 94, 0.4)",
                minWidth: 300,
                border: `2px solid ${alpha(lightTheme.success, 0.3)}`,
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
    const totalGroups = groups.length;

    return {
      totalFiles,
      totalGroups,
    };
  }, [resumes, groups]);

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
        background: lightTheme.background,
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
              color: lightTheme.primary,
              mr: 1,
            }}
          />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2.5rem", md: "3rem" },
            color: lightTheme.text,
            mb: 2,
          }}
        >
          Resume Analytics
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: lightTheme.textSecondary,
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
            title="Total Resumes"
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
            title="Total Groups"
            value={stats.totalGroups}
            color="#fff"
            bgColor="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
            icon={
              <Assessment
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
              lightTheme.surface,
              0.6
            )} 0%, ${alpha(lightTheme.surfaceLight, 0.8)} 100%)`,
            borderRadius: "24px",
            p: 4,
            border: `1px solid ${alpha(lightTheme.border, 0.3)}`,
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
                lightTheme.primary,
                0.1
              )} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(
                lightTheme.success,
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
                  background: `linear-gradient(135deg, ${lightTheme.text} 0%, ${lightTheme.textSecondary} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Search
                  sx={{ fontSize: "1.5rem", color: lightTheme.primary }}
                />
                Search & Filter Resumes
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: lightTheme.textSecondary,
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
                  borderColor: lightTheme.warning,
                  color: lightTheme.warning,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  "&:hover": {
                    borderColor: lightTheme.warning,
                    backgroundColor: alpha(lightTheme.warning, 0.1),
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Retry Groups
              </Button>
            )}
          </Box>

          {/* Search Bar - Aligned with content */}
          <Box
            sx={{
              mb: 4,
              position: "relative",
              zIndex: 1,
              maxWidth: "1400px",
              mx: "auto",
              px: 2,
            }}
          >
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
                      sx={{ color: lightTheme.textMuted, fontSize: "1.3rem" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  background: alpha(lightTheme.surface, 0.8),
                  color: lightTheme.text,
                  border: `1px solid ${alpha(lightTheme.border, 0.4)}`,
                  boxShadow: `0 2px 12px ${alpha(lightTheme.background, 0.3)}`,
                  "& input": {
                    color: lightTheme.text,
                    py: 2.5,
                    px: 2,
                    fontSize: "1rem",
                    fontWeight: 500,
                    "&::placeholder": {
                      color: lightTheme.textMuted,
                      opacity: 1,
                      fontSize: "1rem",
                    },
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover": {
                    background: alpha(lightTheme.surfaceLight, 0.9),
                    border: `1px solid ${alpha(lightTheme.primary, 0.4)}`,
                    boxShadow: `0 4px 20px ${alpha(lightTheme.primary, 0.1)}`,
                  },
                  "&.Mui-focused": {
                    background: alpha(lightTheme.surfaceLight, 0.9),
                    border: `1px solid ${lightTheme.primary}`,
                    boxShadow: `0 4px 24px ${alpha(lightTheme.primary, 0.15)}`,
                  },
                  "&.Mui-disabled": {
                    background: alpha(lightTheme.surface, 0.3),
                    color: lightTheme.textMuted,
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
              }}
            />
          </Box>

          {/* Group Filter Section - Aligned with content */}
          {!groupsError && groupStats.length > 0 && (
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                maxWidth: "1400px",
                mx: "auto",
                px: 2,
                mb: 4,
              }}
            >
              {/* Filter by Groups Label */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: lightTheme.text,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Assessment
                    sx={{ fontSize: "1.2rem", color: lightTheme.primary }}
                  />
                  Filter by Groups
                  {groupsLoading && (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: `2px solid ${alpha(lightTheme.primary, 0.3)}`,
                        borderTop: `2px solid ${lightTheme.primary}`,
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
                    color: lightTheme.textSecondary,
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
                      lightTheme.surfaceLight,
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
                      lightTheme.surfaceLight,
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
                      background: alpha(lightTheme.border, 0.1),
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: `linear-gradient(90deg, ${lightTheme.primary} 0%, ${lightTheme.success} 100%)`,
                      borderRadius: "3px",
                      "&:hover": {
                        background: `linear-gradient(90deg, #357abd 0%, #16a34a 100%)`,
                      },
                    },
                    // Custom scrollbar for Firefox
                    scrollbarWidth: "thin",
                    scrollbarColor: `${lightTheme.primary} ${alpha(
                      lightTheme.border,
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
                              lightTheme.surface,
                              0.3
                            )} 0%, ${alpha(
                              lightTheme.surfaceLight,
                              0.5
                            )} 50%, ${alpha(lightTheme.surface, 0.3)} 100%)`,
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
                                        lightTheme.textMuted,
                                        0.2
                                      )} 0%, ${alpha(
                                        lightTheme.textMuted,
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
                                        lightTheme.textMuted,
                                        0.1
                                      )} 0%, ${alpha(
                                        lightTheme.textMuted,
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
                                  : lightTheme.textMuted,
                                border: `2px solid ${
                                  hasResumes
                                    ? isSelected
                                      ? colorTheme.border
                                      : alpha(colorTheme.border, 0.4)
                                    : alpha(lightTheme.textMuted, 0.3)
                                }`,
                                borderRadius: "16px",
                                boxShadow: hasResumes
                                  ? isSelected
                                    ? `0 8px 32px ${
                                        colorTheme.hoverShadowColor
                                      }, 0 0 0 1px ${alpha(
                                        colorTheme.border,
                                        0.2
                                      )}`
                                    : `0 4px 16px ${alpha(
                                        colorTheme.shadowColor,
                                        0.2
                                      )}`
                                  : `0 2px 8px ${alpha(
                                      lightTheme.textMuted,
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
                                        colorTheme.hoverShadowColor
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

          {/* No Groups Available Message - Aligned with content */}
          {!groupsError &&
            !groupsLoading &&
            groupStats.length === 0 &&
            resumes.length > 0 && (
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  maxWidth: "1400px",
                  mx: "auto",
                  px: 2,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    px: 3,
                    background: `linear-gradient(135deg, ${alpha(
                      lightTheme.warning,
                      0.1
                    )} 0%, ${alpha(lightTheme.warning, 0.2)} 100%)`,
                    borderRadius: "16px",
                    border: `1px solid ${alpha(lightTheme.warning, 0.3)}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: lightTheme.warning,
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
                      color: lightTheme.textSecondary,
                      fontSize: "0.9rem",
                    }}
                  >
                    Groups are not available at the moment. You can still search
                    through all resumes using the search bar above.
                  </Typography>
                </Box>
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
                  lightTheme.surface
                } 0%, ${alpha(lightTheme.surfaceLight, 0.9)} 100%)`,
                border: `1px solid ${alpha(lightTheme.primary, 0.2)}`,
                borderRadius: "24px",
                boxShadow: `0 20px 60px ${alpha(lightTheme.background, 0.4)}`,
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
                    lightTheme.primary,
                    0.1
                  )} 0%, transparent 70%), radial-gradient(circle at 70% 60%, ${alpha(
                    lightTheme.success,
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
                      background: `conic-gradient(${lightTheme.primary} 0deg, ${lightTheme.success} 120deg, ${lightTheme.warning} 240deg, ${lightTheme.primary} 360deg)`,
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
                        background: lightTheme.surface,
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
                      sx={{ fontSize: "2rem", color: lightTheme.primary }}
                    />
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${lightTheme.text} 0%, ${lightTheme.textSecondary} 100%)`,
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
                    color: lightTheme.textSecondary,
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
                        backgroundColor: lightTheme.primary,
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
                  lightTheme.surface
                } 0%, ${alpha(lightTheme.surfaceLight, 0.9)} 100%)`,
                border: `1px solid ${alpha(lightTheme.border, 0.3)}`,
                borderRadius: "24px",
                boxShadow: `0 20px 60px ${alpha(lightTheme.background, 0.4)}`,
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
                    lightTheme.textMuted,
                    0.05
                  )} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${alpha(
                    lightTheme.textMuted,
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
                        lightTheme.textMuted,
                        0.1
                      )} 0%, ${alpha(lightTheme.textMuted, 0.2)} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      border: `2px dashed ${alpha(lightTheme.textMuted, 0.3)}`,
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: -10,
                        left: -10,
                        right: -10,
                        bottom: -10,
                        borderRadius: "50%",
                        border: `1px solid ${alpha(lightTheme.textMuted, 0.1)}`,
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
                        color: lightTheme.textMuted,
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
                    background: `linear-gradient(135deg, ${lightTheme.text} 0%, ${lightTheme.textSecondary} 100%)`,
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
                    color: lightTheme.textSecondary,
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
                      background: `linear-gradient(135deg, ${lightTheme.primary} 0%, #357abd 100%)`,
                      color: "#ffffff",
                      borderRadius: "12px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: `0 8px 24px ${alpha(lightTheme.primary, 0.3)}`,
                      "&:hover": {
                        background: `linear-gradient(135deg, #357abd 0%, #2c5aa0 100%)`,
                        boxShadow: `0 12px 32px ${alpha(
                          lightTheme.primary,
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
          /* Resume Grid - Aligned with search */
          <Box
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              px: 2,
              position: "relative",
            }}
          >
            {/* Results Header */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                background: alpha(lightTheme.surface, 0.5),
                borderRadius: "12px",
                border: `1px solid ${alpha(lightTheme.border, 0.2)}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: lightTheme.text,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {selectedGroup
                  ? `${selectedGroup} Resumes (${filteredResumes.length})`
                  : `All Resumes (${filteredResumes.length})`}
              </Typography>

              {(selectedGroup || searchQuery.trim()) && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={clearAllFilters}
                  startIcon={<Close sx={{ fontSize: "1rem" }} />}
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(
                      lightTheme.error,
                      0.8
                    )} 0%, ${alpha(lightTheme.error, 0.9)} 100%)`,
                    color: "#ffffff",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    boxShadow: `0 4px 16px ${alpha(lightTheme.error, 0.3)}`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${lightTheme.error} 0%, #dc2626 100%)`,
                      boxShadow: `0 6px 20px ${alpha(lightTheme.error, 0.4)}`,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </Box>

            {/* Resume Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fill, minmax(360px, 1fr))",
                  md: "repeat(auto-fill, minmax(380px, 1fr))",
                  lg: "repeat(auto-fill, minmax(400px, 1fr))",
                  xl: "repeat(3, 1fr)",
                },
                gap: { xs: 3, sm: 4 },
                width: "100%",
                maxWidth: "1400px",
                mx: "auto",
                position: "relative",
                alignItems: "stretch",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent 0%, ${alpha(
                    lightTheme.border,
                    0.5
                  )} 50%, transparent 100%)`,
                  zIndex: 0,
                },
                "& > *": {
                  height: "100%",
                  minHeight: "100%",
                },
              }}
            >
              {filteredResumes.map((resume) => {
                const colorTheme = getGroupColorTheme(resume.group);
                return (
                  <Card
                    key={resume.id}
                    sx={{
                      backgroundColor: lightTheme.background,
                      borderRadius: "16px",
                      boxShadow: colorTheme.shadowColor,
                      border: `2px solid ${colorTheme.primary}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: colorTheme.hoverShadowColor,
                      },
                      mb: 2,
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "8px",
                            background: colorTheme.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {resume.fileType === "pdf" ? (
                            <PictureAsPdf sx={{ color: "#FFFFFF" }} />
                          ) : (
                            <Description sx={{ color: "#FFFFFF" }} />
                          )}
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ color: lightTheme.text, fontWeight: 600 }}
                          >
                            {resume.filename}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: lightTheme.textSecondary }}
                          >
                            {resume.group} • {resume.fileSize}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => onView(resume)}
                            sx={{
                              color: lightTheme.textMuted,
                              "&:hover": {
                                color: lightTheme.text,
                                backgroundColor: lightTheme.surface,
                              },
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onDownload(resume)}
                            sx={{
                              color: lightTheme.textMuted,
                              "&:hover": {
                                color: lightTheme.text,
                                backgroundColor: lightTheme.surface,
                              },
                            }}
                          >
                            <Download />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onDelete(resume)}
                            sx={{
                              color: lightTheme.textMuted,
                              "&:hover": {
                                color: lightTheme.error,
                                backgroundColor: alpha(lightTheme.error, 0.1),
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Stack>

                      {resume.uploadedAt && (
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                          <Chip
                            size="small"
                            icon={<Schedule sx={{ fontSize: 16 }} />}
                            label={`Uploaded ${resume.uploadedAt}`}
                            sx={{
                              backgroundColor: lightTheme.surface,
                              color: lightTheme.textSecondary,
                              "& .MuiChip-icon": {
                                color: lightTheme.textSecondary,
                              },
                            }}
                          />
                          <Chip
                            size="small"
                            icon={<InsertDriveFile sx={{ fontSize: 16 }} />}
                            label={resume.fileType.toUpperCase()}
                            sx={{
                              backgroundColor: lightTheme.surface,
                              color: lightTheme.textSecondary,
                              "& .MuiChip-icon": {
                                color: lightTheme.textSecondary,
                              },
                            }}
                          />
                          {resume.status && (
                            <Chip
                              size="small"
                              icon={
                                resume.status === "completed" ? (
                                  <CheckCircle sx={{ fontSize: 16 }} />
                                ) : (
                                  <Assessment sx={{ fontSize: 16 }} />
                                )
                              }
                              label={
                                resume.status === "completed"
                                  ? "Processed"
                                  : "Processing"
                              }
                              sx={{
                                backgroundColor:
                                  resume.status === "completed"
                                    ? alpha(lightTheme.success, 0.1)
                                    : alpha(lightTheme.warning, 0.1),
                                color:
                                  resume.status === "completed"
                                    ? lightTheme.success
                                    : lightTheme.warning,
                                "& .MuiChip-icon": {
                                  color:
                                    resume.status === "completed"
                                      ? lightTheme.success
                                      : lightTheme.warning,
                                },
                              }}
                            />
                          )}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResumeCollection;
