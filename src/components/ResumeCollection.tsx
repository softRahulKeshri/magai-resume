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
                    color: "white",
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
                  color: "white",
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
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Delete failed");
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
            onClick={() => {
              try {
                // Open resume in new tab using the uploads endpoint
                const viewUrl = `${API_CONFIG.baseURL}/uploads/${resume.filename}`;
                window.open(viewUrl, "_blank");
                onView(resume); // Call the optional callback
              } catch (error) {
                console.error("Error viewing resume:", error);
                alert("Failed to view resume. Please try again.");
              }
            }}
            sx={{
              bgcolor: darkTheme.primary,
              color: "white",
              "&:hover": { bgcolor: "#3a7bc8" },
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1.5,
              cursor: "pointer !important",
            }}
          >
            View
          </Button>
          <Button
            size="small"
            startIcon={<Download sx={{ fontSize: "1rem" }} />}
            onClick={async () => {
              try {
                // Fetch the file for download
                const response = await fetch(
                  `${API_CONFIG.baseURL}/uploads/${resume.filename}`,
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
                  link.download = resume.filename;
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
              bgcolor: darkTheme.success,
              color: "white",
              "&:hover": { bgcolor: "#16a34a" },
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1.5,
              cursor: "pointer !important",
            }}
          >
            Download
          </Button>
          <Button
            size="small"
            startIcon={<Delete sx={{ fontSize: "1rem" }} />}
            onClick={() => setShowDeleteModal(true)}
            sx={{
              bgcolor: darkTheme.error,
              color: "white",
              "&:hover": { bgcolor: "#dc2626" },
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1.5,
              cursor: "pointer !important",
            }}
          >
            Delete
          </Button>
        </Stack>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          filename={resume.filename}
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
                color: "white",
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
                    "{resume.filename}" has been permanently removed.
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setShowSuccessMessage(false)}
                  sx={{
                    color: "white",
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
}

const ResumeCollection = ({
  resumes,
  onView = () => {},
  onDownload = () => {},
  onDelete = () => {},
  onResumeDeleted = () => {},
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
                onResumeDeleted={onResumeDeleted}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResumeCollection;
