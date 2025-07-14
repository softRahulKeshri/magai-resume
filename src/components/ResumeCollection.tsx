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
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
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
  Folder,
  FolderOpen,
  Close,
  Warning,
  Comment,
  Edit,
  Send,
  Person,
} from "@mui/icons-material";

import { Resume, ResumeComment } from "../types";
import { API_CONFIG } from "../theme/constants";
import { useGroups } from "../hooks/useGroups";
import { addOrUpdateComment, deleteComment } from "../services/api";

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

// Brand theme colors for premium, elegant look
const lightTheme: LightTheme = {
  background: "#FFFFFF", // n_white
  surface: "#F5F5F5", // n100
  surfaceLight: "#EAEAEC", // n150
  primary: "#3077F3", // brand blue
  success: "#41E6F8", // brand cyan
  warning: "#FDA052", // brand orange
  error: "#B96AF7", // brand purple
  text: "#050507", // n_black
  textSecondary: "#2E3141", // primary charcoal_slate
  textMuted: "#6D6F7A", // n700
  border: "#D5D6D9", // n200
};

// Brand color palette for groups with premium gradients
const colorPalette: ColorTheme[] = [
  {
    primary: "#3077F3", // Brand blue
    secondary: "#94BAFD",
    gradient: "linear-gradient(135deg, #3077F3 0%, #94BAFD 100%)",
    shadowColor: "rgba(48, 119, 243, 0.15)",
    hoverShadowColor: "rgba(48, 119, 243, 0.25)",
    background: "#FFFFFF",
    border: "#3077F3",
  },
  {
    primary: "#41E6F8", // Brand cyan
    secondary: "#94BAFD",
    gradient: "linear-gradient(135deg, #41E6F8 0%, #94BAFD 100%)",
    shadowColor: "rgba(65, 230, 248, 0.15)",
    hoverShadowColor: "rgba(65, 230, 248, 0.25)",
    background: "#FFFFFF",
    border: "#41E6F8",
  },
  {
    primary: "#B96AF7", // Brand purple
    secondary: "#FDA052",
    gradient: "linear-gradient(135deg, #B96AF7 0%, #FDA052 100%)",
    shadowColor: "rgba(185, 106, 247, 0.15)",
    hoverShadowColor: "rgba(185, 106, 247, 0.25)",
    background: "#FFFFFF",
    border: "#B96AF7",
  },
  {
    primary: "#FDA052", // Brand orange
    secondary: "#B96AF7",
    gradient: "linear-gradient(135deg, #FDA052 0%, #B96AF7 100%)",
    shadowColor: "rgba(253, 160, 82, 0.15)",
    hoverShadowColor: "rgba(253, 160, 82, 0.25)",
    background: "#FFFFFF",
    border: "#FDA052",
  },
  {
    primary: "#2E3141", // Charcoal slate
    secondary: "#6D6F7A",
    gradient: "linear-gradient(135deg, #2E3141 0%, #6D6F7A 100%)",
    shadowColor: "rgba(46, 49, 65, 0.15)",
    hoverShadowColor: "rgba(46, 49, 65, 0.25)",
    background: "#FFFFFF",
    border: "#2E3141",
  },
  {
    primary: "#11397E", // Primary UI blue p700
    secondary: "#3077F3",
    gradient: "linear-gradient(135deg, #11397E 0%, #3077F3 100%)",
    shadowColor: "rgba(17, 57, 126, 0.15)",
    hoverShadowColor: "rgba(17, 57, 126, 0.25)",
    background: "#FFFFFF",
    border: "#11397E",
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

// Custom Styled Modal Component for File Deletion
interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filename: string;
  isDeleting: boolean;
}

// Custom Styled Modal Component for Comment Deletion
interface DeleteCommentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filename: string;
  commentText: string;
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

// Comment Deletion Modal Component
const DeleteCommentModal = ({
  open,
  onClose,
  onConfirm,
  filename,
  commentText,
  isDeleting,
}: DeleteCommentModalProps) => {
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
            border: `2px solid ${lightTheme.warning}`,
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(253, 160, 82, 0.3)",
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
                  backgroundColor: alpha(lightTheme.warning, 0.1),
                  color: lightTheme.warning,
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
                  background: `linear-gradient(135deg, ${lightTheme.warning} 0%, #FDA052 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  boxShadow: `0 8px 32px rgba(253, 160, 82, 0.4)`,
                }}
              >
                <Comment
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
              Delete Comment?
            </Typography>

            {/* Message */}
            <Typography
              variant="body1"
              sx={{
                color: lightTheme.textSecondary,
                textAlign: "center",
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to delete the comment on
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: lightTheme.text,
                textAlign: "center",
                fontWeight: 600,
                mb: 2,
                background: alpha(lightTheme.warning, 0.1),
                borderRadius: "8px",
                p: 1,
                border: `1px solid ${alpha(lightTheme.warning, 0.2)}`,
              }}
            >
              "{filename}"
            </Typography>

            {/* Comment Preview */}
            <Box
              sx={{
                background: alpha(lightTheme.textMuted, 0.05),
                borderRadius: "12px",
                p: 2,
                mb: 3,
                border: `1px solid ${alpha(lightTheme.textMuted, 0.1)}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: lightTheme.textSecondary,
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                "{commentText}"
              </Typography>
            </Box>

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
                  background: `linear-gradient(135deg, ${lightTheme.warning} 0%, #FDA052 100%)`,
                  color: "#ffffff",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: `0 4px 16px rgba(253, 160, 82, 0.4)`,
                  "&:hover": {
                    background: `linear-gradient(135deg, #FDA052 0%, #f97316 100%)`,
                    boxShadow: `0 6px 20px rgba(253, 160, 82, 0.5)`,
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
                {isDeleting ? "Deleting..." : "Delete Comment"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

// Comment Management Dialogs
interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  isLoading: boolean;
  title: string;
  initialComment?: string;
  submitLabel: string;
}

const CommentDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  title,
  initialComment = "",
  submitLabel,
}: CommentDialogProps) => {
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState("");

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setComment(initialComment);
      setError("");
    }
  }, [open, initialComment]);

  const handleSubmit = () => {
    const trimmedComment = comment.trim();

    // Validation
    if (trimmedComment.length < 10) {
      setError("Comment must be at least 10 characters long");
      return;
    }

    if (trimmedComment.length > 200) {
      setError("Comment cannot exceed 200 characters");
      return;
    }

    setError("");
    onSubmit(trimmedComment);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${lightTheme.surface} 0%, ${lightTheme.surfaceLight} 100%)`,
          border: `1px solid ${lightTheme.border}`,
          boxShadow: `0 20px 60px ${alpha(lightTheme.primary, 0.15)}`,
          overflow: "visible",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${
              lightTheme.primary
            } 0%, ${alpha(lightTheme.primary, 0.8)} 100%)`,
            boxShadow: `0 8px 24px ${alpha(lightTheme.primary, 0.3)}`,
          }}
        >
          <Comment sx={{ fontSize: "1.5rem", color: "#ffffff" }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: lightTheme.text,
              fontSize: "1.25rem",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: lightTheme.textSecondary,
              fontSize: "0.875rem",
            }}
          >
            Share your feedback and notes about this resume
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            ml: "auto",
            color: lightTheme.textMuted,
            "&:hover": {
              backgroundColor: alpha(lightTheme.error, 0.1),
              color: lightTheme.error,
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: alpha(lightTheme.border, 0.5) }} />

      <DialogContent sx={{ p: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter your comment here... (minimum 10 characters, maximum 200 characters)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isLoading}
          error={!!error}
          helperText={
            error || (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <span>
                  {comment.trim().length < 10
                    ? `${10 - comment.trim().length} more characters needed`
                    : "✓ Minimum length met"}
                </span>
                <span
                  style={{
                    color:
                      comment.length > 200
                        ? lightTheme.error
                        : lightTheme.textMuted,
                  }}
                >
                  {comment.length}/200
                </span>
              </Box>
            )
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: lightTheme.background,
              border: `2px solid ${lightTheme.border}`,
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: alpha(lightTheme.primary, 0.4),
              },
              "&.Mui-focused": {
                borderColor: lightTheme.primary,
                boxShadow: `0 0 0 4px ${alpha(lightTheme.primary, 0.1)}`,
              },
              "&.Mui-error": {
                borderColor: lightTheme.error,
                boxShadow: `0 0 0 4px ${alpha(lightTheme.error, 0.1)}`,
              },
            },
            "& .MuiInputBase-input": {
              fontSize: "1rem",
              lineHeight: 1.6,
              "&::placeholder": {
                color: lightTheme.textMuted,
                opacity: 1,
              },
            },
            "& .MuiFormHelperText-root": {
              mx: 0,
              mt: 1,
              fontSize: "0.875rem",
              "&.Mui-error": {
                color: lightTheme.error,
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1.5,
            borderColor: lightTheme.border,
            color: lightTheme.textSecondary,
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
          onClick={handleSubmit}
          disabled={
            isLoading || comment.trim().length < 10 || comment.length > 200
          }
          variant="contained"
          startIcon={isLoading ? undefined : <Send />}
          sx={{
            borderRadius: "12px",
            px: 3,
            py: 1.5,
            background: `linear-gradient(135deg, ${
              lightTheme.primary
            } 0%, ${alpha(lightTheme.primary, 0.8)} 100%)`,
            color: "#ffffff",
            fontWeight: 700,
            textTransform: "none",
            boxShadow: `0 4px 16px ${alpha(lightTheme.primary, 0.4)}`,
            "&:hover": {
              background: `linear-gradient(135deg, ${alpha(
                lightTheme.primary,
                0.9
              )} 0%, ${lightTheme.primary} 100%)`,
              boxShadow: `0 6px 20px ${alpha(lightTheme.primary, 0.5)}`,
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
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Comment Display Component
interface CommentDisplayProps {
  comment: ResumeComment;
  onEdit: () => void;
  onDelete: () => void;
}

const CommentDisplay = ({ comment, onEdit, onDelete }: CommentDisplayProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      sx={{
        mt: 2,
        background: `linear-gradient(135deg, ${alpha(
          lightTheme.primary,
          0.03
        )} 0%, ${alpha(lightTheme.primary, 0.08)} 100%)`,
        border: `1px solid ${alpha(lightTheme.primary, 0.2)}`,
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 4px 12px ${alpha(lightTheme.primary, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${
                lightTheme.primary
              } 0%, ${alpha(lightTheme.primary, 0.8)} 100%)`,
              boxShadow: `0 4px 12px ${alpha(lightTheme.primary, 0.3)}`,
              flexShrink: 0,
            }}
          >
            <Person sx={{ fontSize: "1.125rem", color: "#ffffff" }} />
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: lightTheme.text,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {comment.hrName || "HR Team"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: lightTheme.textMuted,
                  fontSize: "0.75rem",
                }}
              >
                •
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: lightTheme.textMuted,
                  fontSize: "0.75rem",
                }}
              >
                {formatDate(comment.updatedAt || comment.createdAt)}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: lightTheme.textSecondary,
                fontSize: "0.875rem",
                lineHeight: 1.6,
                wordBreak: "break-word",
              }}
            >
              {comment.comment}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: lightTheme.textMuted,
                backgroundColor: alpha(lightTheme.primary, 0.05),
                borderRadius: "8px",
                width: 32,
                height: 32,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(lightTheme.primary, 0.1),
                  color: lightTheme.primary,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Edit sx={{ fontSize: "0.875rem" }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: lightTheme.textMuted,
                backgroundColor: alpha(lightTheme.error, 0.05),
                borderRadius: "8px",
                width: 32,
                height: 32,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(lightTheme.error, 0.1),
                  color: lightTheme.error,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Delete sx={{ fontSize: "0.875rem" }} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
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
        borderRadius: "20px",
        border: "none",
        minWidth: { xs: "280px", sm: "300px", md: "320px", lg: "340px" },
        minHeight: { xs: "140px", sm: "150px", md: "160px" },
        width: { xs: "100%", sm: "auto" },
        maxWidth: { xs: "100%", sm: "400px" },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
        },
      }}
    >
      <CardContent sx={{ p: 4, position: "relative", height: "100%" }}>
        {/* Icon positioned in top right with better styling */}
        <Box
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Box sx={{ fontSize: "1.75rem", color: "#ffffff" }}>{icon}</Box>
        </Box>

        {/* Main content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            pr: 7, // Leave space for icon
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "1.125rem",
              mb: 1,
              opacity: 0.95,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "3.5rem",
              lineHeight: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// File Card Component (improved with better UI and functionality)
interface FileCardProps {
  resume: Resume;
  onView: (resume: Resume) => void;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  onResumeDeleted?: (resumeId: number) => void;
  onCommentAdded?: (resumeId: number, comment: ResumeComment) => void;
  onCommentUpdated?: (resumeId: number, comment: ResumeComment) => void;
  onCommentDeleted?: (resumeId: number, commentId: number) => void;
}

const FileCard = ({
  resume,
  onView,
  onDownload,
  onDelete,
  onResumeDeleted,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}: FileCardProps) => {
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Comment state
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

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
        return <PictureAsPdf sx={{ fontSize: "1.75rem", color: "#ffffff" }} />;
      case "doc":
      case "docx":
        return <Description sx={{ fontSize: "1.75rem", color: "#ffffff" }} />;
      default:
        return (
          <InsertDriveFile sx={{ fontSize: "1.75rem", color: "#ffffff" }} />
        );
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
        onDelete(resume);
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

  // Add or Edit Comment
  const handleAddOrEditComment = async (comment: string) => {
    try {
      setIsCommentLoading(true);
      const success = await addOrUpdateComment(resume.id, comment);

      if (success) {
        // Create the comment object locally since API doesn't return comment data
        const newComment: ResumeComment = {
          id: Date.now(), // Generate local ID
          resumeId: resume.id,
          comment: comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          hrName: "HR Team", // Default HR name
        };

        setShowAddCommentDialog(false);
        setShowEditCommentDialog(false);

        // Update local state and notify parent
        if (onCommentAdded) onCommentAdded(resume.id, newComment);
        if (onCommentUpdated) onCommentUpdated(resume.id, newComment);

        console.log("Comment added/updated successfully:", newComment);
      } else {
        throw new Error("Comment operation failed");
      }
    } catch (error) {
      console.error("Error adding/updating comment:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add/update comment. Please try again.";
      alert(errorMessage);
    } finally {
      setIsCommentLoading(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async () => {
    try {
      setIsDeletingComment(true);
      const success = await deleteComment(resume.id);

      if (success) {
        setShowDeleteCommentModal(false);

        // Notify parent component about comment deletion
        if (onCommentDeleted && resume.comment) {
          onCommentDeleted(resume.id, resume.comment.id);
        }

        console.log("Comment deleted successfully");
      } else {
        throw new Error("Comment deletion failed");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete comment. Please try again.";
      alert(errorMessage);
    } finally {
      setIsDeletingComment(false);
    }
  };

  const colorTheme = getGroupColorTheme(resume.group);

  return (
    <>
      <Card
        sx={{
          background: lightTheme.background,
          borderRadius: "16px",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 4px 6px -1px ${alpha(
            lightTheme.text,
            0.1
          )}, 0 2px 4px -2px ${alpha(lightTheme.text, 0.1)}`,
          border: `1px solid ${lightTheme.border}`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 12px 24px -4px ${alpha(
              colorTheme.primary,
              0.2
            )}, 0 8px 16px -8px ${alpha(colorTheme.primary, 0.1)}`,
            border: `1px solid ${alpha(colorTheme.primary, 0.3)}`,
          },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with file info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mb: { xs: 2, sm: 2.5, md: 3 },
            }}
          >
            <Box
              sx={{
                width: { xs: 56, sm: 60, md: 64 },
                height: { xs: 56, sm: 60, md: 64 },
                borderRadius: { xs: "14px", sm: "15px", md: "16px" },
                background: colorTheme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: { xs: 2, sm: 2.5, md: 3 },
                boxShadow: `0 8px 24px ${alpha(colorTheme.primary, 0.25)}`,
                flexShrink: 0,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: { xs: "16px", sm: "17px", md: "18px" },
                  background: `linear-gradient(135deg, ${alpha(
                    colorTheme.primary,
                    0.3
                  )} 0%, ${alpha(colorTheme.secondary, 0.3)} 100%)`,
                  zIndex: -1,
                },
              }}
            >
              {getFileIcon()}
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.0625rem", md: "1.125rem" },
                  fontWeight: 600,
                  color: lightTheme.text,
                  mb: { xs: 1, sm: 1.25, md: 1.5 },
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {resume.original_filename || resume.filename}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 2 },
                  mb: { xs: 1, sm: 1.25, md: 1.5 },
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    backgroundColor: alpha(lightTheme.textSecondary, 0.08),
                    borderRadius: "8px",
                    px: { xs: 1, sm: 1.5 },
                    py: 0.5,
                  }}
                >
                  <InsertDriveFile
                    sx={{
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      color: lightTheme.textSecondary,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: lightTheme.textSecondary,
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      fontWeight: 500,
                    }}
                  >
                    {formatFileSize(resume.fileSize)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    backgroundColor: alpha(colorTheme.primary, 0.08),
                    borderRadius: "8px",
                    px: { xs: 1, sm: 1.5 },
                    py: 0.5,
                  }}
                >
                  <PictureAsPdf
                    sx={{
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      color: colorTheme.primary,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorTheme.primary,
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      fontWeight: 500,
                    }}
                  >
                    {resume.fileType.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              {resume.group && (
                <Chip
                  label={resume.group}
                  size="small"
                  sx={{
                    backgroundColor: alpha(colorTheme.primary, 0.12),
                    color: colorTheme.primary,
                    fontSize: { xs: "0.6875rem", sm: "0.75rem" },
                    height: { xs: "24px", sm: "28px" },
                    borderRadius: "8px",
                    fontWeight: 600,
                    border: `1px solid ${alpha(colorTheme.primary, 0.2)}`,
                    "&:hover": {
                      backgroundColor: alpha(colorTheme.primary, 0.16),
                    },
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Date display */}
          {resume.uploadedAt && (
            <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: alpha(lightTheme.textMuted, 0.06),
                  borderRadius: "10px",
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1, sm: 1.5 },
                  border: `1px solid ${alpha(lightTheme.textMuted, 0.1)}`,
                }}
              >
                <Schedule
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.125rem" },
                    color: lightTheme.textMuted,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: lightTheme.textMuted,
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    fontWeight: 500,
                  }}
                >
                  Uploaded {formatDate(resume.uploadedAt)}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Action buttons */}
          <Box sx={{ mt: "auto" }}>
            <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }}>
              <Button
                variant="outlined"
                size="medium"
                startIcon={
                  <Visibility
                    sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
                  />
                }
                onClick={() => onView(resume)}
                sx={{
                  flex: 1,
                  borderRadius: { xs: "10px", sm: "12px" },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                  py: { xs: 1, sm: 1.25 },
                  px: { xs: 1.5, sm: 2 },
                  minHeight: { xs: "36px", sm: "40px" },
                  borderColor: alpha(colorTheme.primary, 0.3),
                  color: colorTheme.primary,
                  backgroundColor: alpha(colorTheme.primary, 0.03),
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(colorTheme.primary, 0.08),
                    borderColor: colorTheme.primary,
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 12px ${alpha(colorTheme.primary, 0.2)}`,
                  },
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0.5, sm: 1 },
                  },
                }}
              >
                View
              </Button>

              <Button
                variant="outlined"
                size="medium"
                startIcon={
                  <Download sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }} />
                }
                onClick={() => onDownload(resume)}
                sx={{
                  flex: 1,
                  borderRadius: { xs: "10px", sm: "12px" },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                  py: { xs: 1, sm: 1.25 },
                  px: { xs: 1.5, sm: 2 },
                  minHeight: { xs: "36px", sm: "40px" },
                  borderColor: alpha(lightTheme.success, 0.3),
                  color: lightTheme.success,
                  backgroundColor: alpha(lightTheme.success, 0.03),
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(lightTheme.success, 0.08),
                    borderColor: lightTheme.success,
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 12px ${alpha(lightTheme.success, 0.2)}`,
                  },
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0.5, sm: 1 },
                  },
                }}
              >
                Download
              </Button>

              <IconButton
                size="medium"
                onClick={() => setShowDeleteModal(true)}
                sx={{
                  color: lightTheme.textMuted,
                  border: `1px solid ${alpha(lightTheme.error, 0.3)}`,
                  borderRadius: { xs: "10px", sm: "12px" },
                  backgroundColor: alpha(lightTheme.error, 0.03),
                  width: { xs: "36px", sm: "40px" },
                  height: { xs: "36px", sm: "40px" },
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: lightTheme.error,
                    backgroundColor: alpha(lightTheme.error, 0.08),
                    borderColor: lightTheme.error,
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 12px ${alpha(lightTheme.error, 0.2)}`,
                  },
                }}
              >
                <Delete sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }} />
              </IconButton>
            </Stack>

            {/* Comment Button */}
            <Button
              variant="outlined"
              size="medium"
              startIcon={
                resume.comment ? (
                  <Edit sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }} />
                ) : (
                  <Comment sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }} />
                )
              }
              onClick={() =>
                resume.comment
                  ? setShowEditCommentDialog(true)
                  : setShowAddCommentDialog(true)
              }
              sx={{
                mt: { xs: 1.5, sm: 2 },
                borderRadius: { xs: "10px", sm: "12px" },
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                py: { xs: 1, sm: 1.25 },
                px: { xs: 1.5, sm: 2 },
                minHeight: { xs: "36px", sm: "40px" },
                borderColor: alpha(lightTheme.warning, 0.3),
                color: lightTheme.warning,
                backgroundColor: alpha(lightTheme.warning, 0.03),
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(lightTheme.warning, 0.08),
                  borderColor: lightTheme.warning,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${alpha(lightTheme.warning, 0.2)}`,
                },
                "& .MuiButton-startIcon": {
                  mr: { xs: 0.5, sm: 1 },
                },
              }}
            >
              {resume.comment ? "Edit Comment" : "Add Comment"}
            </Button>

            {/* Comment Display */}
            {resume.comment && (
              <CommentDisplay
                comment={resume.comment}
                onEdit={() => setShowEditCommentDialog(true)}
                onDelete={() => setShowDeleteCommentModal(true)}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        filename={resume.original_filename || resume.filename}
        isDeleting={isDeleting}
      />

      {/* Add Comment Dialog */}
      <CommentDialog
        open={showAddCommentDialog}
        onClose={() => setShowAddCommentDialog(false)}
        onSubmit={handleAddOrEditComment}
        isLoading={isCommentLoading}
        title="Add HR Comment"
        submitLabel="Add Comment"
      />

      {/* Edit Comment Dialog */}
      <CommentDialog
        open={showEditCommentDialog}
        onClose={() => setShowEditCommentDialog(false)}
        onSubmit={handleAddOrEditComment}
        isLoading={isCommentLoading}
        title="Edit HR Comment"
        initialComment={resume.comment?.comment || ""}
        submitLabel="Update Comment"
      />

      {/* Delete Comment Confirmation Modal */}
      <DeleteCommentModal
        open={showDeleteCommentModal}
        onClose={() => setShowDeleteCommentModal(false)}
        onConfirm={handleDeleteComment}
        filename={resume.original_filename || resume.filename}
        commentText={resume.comment?.comment || ""}
        isDeleting={isDeletingComment}
      />
    </>
  );
};

// Main Component Props - Simplified to accept resumes as props
interface ResumeCollectionProps {
  resumes: Resume[];
  onView?: (resume: Resume) => void;
  onDownload?: (resume: Resume) => void;
  onDelete?: (resume: Resume) => void;
  onResumeDeleted?: (resumeId: number) => void;
  onResumeUpdated?: (resumeId: number, updatedResume: Resume) => void;
  onRefreshResumes?: () => Promise<void>; // Add refresh function prop
  isLoading?: boolean;
}

const ResumeCollection = ({
  resumes,
  onView = () => {},
  onDownload = () => {},
  onDelete = () => {},
  onResumeDeleted = () => {},
  onResumeUpdated = () => {},
  onRefreshResumes,
  isLoading = false,
}: ResumeCollectionProps) => {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Local state for managing resume updates (for comment changes)
  const [localResumes, setLocalResumes] = useState<Resume[]>(resumes);

  // Update local resumes when prop changes
  React.useEffect(() => {
    setLocalResumes(resumes);
  }, [resumes]);

  // Comment handling functions
  const handleCommentAdded = async (
    resumeId: number,
    comment: ResumeComment
  ) => {
    console.log("Adding comment to resume:", resumeId, comment);

    // Update local state immediately for optimistic UI
    setLocalResumes((prev) => {
      const updated = prev.map((resume) =>
        resume.id === resumeId ? { ...resume, comment } : resume
      );
      console.log("Updated local resumes:", updated);
      return updated;
    });

    // Notify parent component
    const updatedResume = localResumes.find((r) => r.id === resumeId);
    if (updatedResume) {
      onResumeUpdated(resumeId, { ...updatedResume, comment });
    }

    // Refresh resumes from API to get the latest data
    if (onRefreshResumes) {
      try {
        await onRefreshResumes();
        console.log("✅ Resumes refreshed after adding comment");
      } catch (error) {
        console.error(
          "❌ Failed to refresh resumes after adding comment:",
          error
        );
      }
    }
  };

  const handleCommentUpdated = async (
    resumeId: number,
    comment: ResumeComment
  ) => {
    console.log("Updating comment for resume:", resumeId, comment);

    // Update local state immediately for optimistic UI
    setLocalResumes((prev) => {
      const updated = prev.map((resume) =>
        resume.id === resumeId ? { ...resume, comment } : resume
      );
      console.log("Updated local resumes:", updated);
      return updated;
    });

    // Notify parent component
    const updatedResume = localResumes.find((r) => r.id === resumeId);
    if (updatedResume) {
      onResumeUpdated(resumeId, { ...updatedResume, comment });
    }

    // Refresh resumes from API to get the latest data
    if (onRefreshResumes) {
      try {
        await onRefreshResumes();
        console.log("✅ Resumes refreshed after updating comment");
      } catch (error) {
        console.error(
          "❌ Failed to refresh resumes after updating comment:",
          error
        );
      }
    }
  };

  const handleCommentDeleted = async (resumeId: number, commentId: number) => {
    console.log("Deleting comment from resume:", resumeId, commentId);

    // Update local state immediately for optimistic UI
    setLocalResumes((prev) => {
      const updated = prev.map((resume) =>
        resume.id === resumeId ? { ...resume, comment: undefined } : resume
      );
      console.log("Updated local resumes:", updated);
      return updated;
    });

    // Notify parent component
    const updatedResume = localResumes.find((r) => r.id === resumeId);
    if (updatedResume) {
      onResumeUpdated(resumeId, { ...updatedResume, comment: undefined });
    }

    // Refresh resumes from API to get the latest data
    if (onRefreshResumes) {
      try {
        await onRefreshResumes();
        console.log("✅ Resumes refreshed after deleting comment");
      } catch (error) {
        console.error(
          "❌ Failed to refresh resumes after deleting comment:",
          error
        );
      }
    }
  };

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
      const resumeCount = localResumes.filter((resume) => {
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
  }, [groups, localResumes]);

  // Filtered resumes - now considers both search and group filter
  const filteredResumes = useMemo(() => {
    let filtered = localResumes;

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
  }, [localResumes, searchQuery, selectedGroup]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResumes = filteredResumes.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGroup]);

  // Enhanced Statistics - Only 2 essential metrics to avoid clutter
  const stats = useMemo(() => {
    const totalFiles = localResumes.length;
    const totalGroups = groups.length;

    return {
      totalFiles,
      totalGroups,
    };
  }, [localResumes, groups]);

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

    // If we're on a page that will be empty after deletion, go to previous page
    if (paginatedResumes.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    // Call the parent callback to refresh data
    onResumeDeleted(resumeId);
  };

  // Handle pagination change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
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
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${
                lightTheme.primary
              } 0%, ${alpha(lightTheme.primary, 0.8)} 100%)`,
              boxShadow: `0 12px 32px ${alpha(lightTheme.primary, 0.3)}`,
              mr: 2,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: "24px",
                background: `linear-gradient(135deg, ${alpha(
                  lightTheme.primary,
                  0.2
                )} 0%, ${alpha(lightTheme.primary, 0.1)} 100%)`,
                zIndex: -1,
              },
            }}
          >
            <InsertDriveFile
              sx={{
                fontSize: "2.5rem",
                color: "#ffffff",
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2.5rem", md: "3rem" },
            color: lightTheme.text,
            mb: 3,
            background: `linear-gradient(135deg, ${lightTheme.text} 0%, ${lightTheme.textSecondary} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
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
            fontSize: "1.125rem",
            lineHeight: 1.6,
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
            gap: { xs: 2, sm: 3, md: 4 },
            flexWrap: "wrap",
            maxWidth: { xs: "100%", sm: "700px", md: "800px", lg: "900px" },
            mx: "auto",
            px: { xs: 1, sm: 2 },
          }}
        >
          <StatsCard
            title="Total Resumes"
            value={stats.totalFiles}
            color="#fff"
            bgColor="linear-gradient(135deg, #3077F3 0%, #94BAFD 100%)"
            icon={
              <InsertDriveFile
                sx={{ fontSize: "2.5rem", color: "rgba(255,255,255,0.9)" }}
              />
            }
          />
          <StatsCard
            title="Total Groups"
            value={stats.totalGroups}
            color="#fff"
            bgColor="linear-gradient(135deg, #41E6F8 0%, #3077F3 100%)"
            icon={
              <Folder
                sx={{ fontSize: "2.5rem", color: "rgba(255,255,255,0.9)" }}
              />
            }
          />
        </Box>
      </Box>

      {/* Search and File Management Section */}
      <Box>
        {/* Search and Filter Section */}
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
        ) : filteredResumes.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: { xs: 8, sm: 12 },
            }}
          >
            <Card
              sx={{
                textAlign: "center",
                py: { xs: 6, sm: 8 },
                px: { xs: 4, sm: 6 },
                maxWidth: 500,
                width: "100%",
                background: `linear-gradient(135deg, ${
                  lightTheme.surface
                } 0%, ${alpha(lightTheme.surfaceLight, 0.9)} 100%)`,
                border: `1px solid ${alpha(lightTheme.border, 0.3)}`,
                borderRadius: { xs: "20px", sm: "24px" },
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
                    mb: { xs: 3, sm: 4 },
                    mx: "auto",
                    width: "fit-content",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
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
                        fontSize: { xs: "2.75rem", sm: "3.5rem" },
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
                    fontSize: { xs: "1.5rem", sm: "1.8rem" },
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
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    lineHeight: 1.6,
                    mb: { xs: 3, sm: 4 },
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
                      background: `linear-gradient(135deg, ${lightTheme.primary} 0%, ${colorPalette[0].primary} 100%)`,
                      color: "#ffffff",
                      borderRadius: { xs: "10px", sm: "12px" },
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      fontSize: { xs: "0.9375rem", sm: "1rem" },
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: `0 8px 24px ${alpha(lightTheme.primary, 0.3)}`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${colorPalette[0].primary} 0%, ${lightTheme.primary} 100%)`,
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
              width: "100%",
              position: "relative",
            }}
          >
            {/* Results Header */}
            <Box
              sx={{
                mb: { xs: 2, sm: 3 },
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                gap: { xs: 2, sm: 0 },
                p: { xs: 1.5, sm: 2 },
                background: alpha(lightTheme.surface, 0.5),
                borderRadius: { xs: "10px", sm: "12px" },
                border: `1px solid ${alpha(lightTheme.border, 0.2)}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: lightTheme.text,
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                }}
              >
                {selectedGroup
                  ? `${selectedGroup} Resumes (${filteredResumes.length})`
                  : `All Resumes (${filteredResumes.length})`}
                {totalPages > 1 && (
                  <Typography
                    component="span"
                    sx={{
                      color: lightTheme.textSecondary,
                      fontSize: { xs: "0.875rem", sm: "0.9rem" },
                      ml: 1,
                    }}
                  >
                    • Page {currentPage} of {totalPages}
                  </Typography>
                )}
              </Typography>

              {(selectedGroup || searchQuery.trim()) && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={clearAllFilters}
                  startIcon={
                    <Close sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }} />
                  }
                  sx={{
                    background: `linear-gradient(135deg, ${lightTheme.error} 0%, #FDA052 100%)`,
                    color: "#ffffff",
                    borderRadius: { xs: "10px", sm: "12px" },
                    textTransform: "none",
                    fontSize: { xs: "0.8125rem", sm: "0.85rem" },
                    fontWeight: 600,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.75, sm: 1 },
                    boxShadow: `0 4px 16px ${alpha(lightTheme.error, 0.3)}`,
                    "&:hover": {
                      background: `linear-gradient(135deg, #FDA052 0%, ${lightTheme.error} 100%)`,
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
                  sm: "repeat(auto-fill, minmax(300px, 1fr))",
                  md: "repeat(auto-fill, minmax(320px, 1fr))",
                  lg: "repeat(auto-fill, minmax(340px, 1fr))",
                },
                gap: { xs: 2, sm: 2.5, md: 3 },
                mb: { xs: 3, md: 4 },
                width: "100%",
              }}
            >
              {paginatedResumes.map((resume) => (
                <FileCard
                  key={resume.id}
                  resume={resume}
                  onView={onView}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  onResumeDeleted={handleResumeDeleted}
                  onCommentAdded={handleCommentAdded}
                  onCommentUpdated={handleCommentUpdated}
                  onCommentDeleted={handleCommentDeleted}
                />
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  mt: { xs: 3, sm: 4 },
                  mb: { xs: 2, sm: 3 },
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: { xs: "10px", sm: "12px" },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: 500,
                      minWidth: { xs: "32px", sm: "40px" },
                      height: { xs: "32px", sm: "40px" },
                      margin: { xs: "0 2px", sm: "0 4px" },
                      color: lightTheme.textSecondary,
                      border: `1px solid ${alpha(lightTheme.border, 0.5)}`,
                      "&:hover": {
                        backgroundColor: alpha(lightTheme.primary, 0.05),
                        borderColor: lightTheme.primary,
                        color: lightTheme.primary,
                      },
                      "&.Mui-selected": {
                        background: `linear-gradient(135deg, ${lightTheme.primary} 0%, ${colorPalette[0].primary} 100%)`,
                        color: "#ffffff",
                        borderColor: lightTheme.primary,
                        boxShadow: `0 4px 12px ${alpha(
                          lightTheme.primary,
                          0.25
                        )}`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${colorPalette[0].primary} 0%, ${lightTheme.primary} 100%)`,
                          color: "#ffffff",
                        },
                      },
                      // Navigation arrows
                      "&.MuiPaginationItem-previousNext": {
                        backgroundColor: alpha(lightTheme.primary, 0.05),
                        borderColor: alpha(lightTheme.primary, 0.2),
                        color: lightTheme.primary,
                        "&:hover": {
                          backgroundColor: alpha(lightTheme.primary, 0.1),
                          borderColor: lightTheme.primary,
                        },
                        "&.Mui-disabled": {
                          opacity: 0.4,
                          backgroundColor: alpha(lightTheme.textMuted, 0.05),
                          borderColor: lightTheme.border,
                          color: lightTheme.textMuted,
                        },
                      },
                    },
                  }}
                />

                {/* Pagination Info */}
                <Typography
                  variant="body2"
                  sx={{
                    color: lightTheme.textSecondary,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: 500,
                    textAlign: "center",
                    background: alpha(lightTheme.primary, 0.05),
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    border: `1px solid ${alpha(lightTheme.primary, 0.1)}`,
                  }}
                >
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredResumes.length)} of{" "}
                  {filteredResumes.length} resumes
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResumeCollection;
