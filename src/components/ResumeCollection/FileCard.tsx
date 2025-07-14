import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  alpha,
  IconButton,
} from "@mui/material";
import {
  PictureAsPdf,
  Description,
  Visibility,
  Download,
  Delete,
  Schedule,
  InsertDriveFile,
  Comment,
  Edit,
} from "@mui/icons-material";
import { FileCardProps } from "./types";
import { lightTheme, getGroupColorTheme } from "./theme";
import { formatFileSize, formatDate } from "./utils";
import { API_CONFIG } from "../../theme/constants";
import { addOrUpdateComment, deleteComment } from "../../services/api";

// Import modal components
import DeleteConfirmModal from "./DeleteConfirmModal";
import DeleteCommentModal from "./DeleteCommentModal";
import CommentDialog from "./CommentDialog";
import CommentDisplay from "./CommentDisplay";

/**
 * File Card Component (improved with better UI and functionality)
 */
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
        const newComment = {
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

            {/* Comment Display - now compact and inline */}
            {resume.comment && (
              <Box sx={{ mt: 0.5 }}>
                <CommentDisplay
                  comment={resume.comment}
                  onEdit={() => setShowEditCommentDialog(true)}
                  onDelete={() => setShowDeleteCommentModal(true)}
                />
              </Box>
            )}

            {/* Comment Button */}
            {!(showEditCommentDialog && resume.comment) && (
              <Button
                variant="outlined"
                size="medium"
                fullWidth
                startIcon={
                  resume.comment ? (
                    <Edit sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }} />
                  ) : (
                    <Comment
                      sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
                    />
                  )
                }
                onClick={() =>
                  resume.comment
                    ? setShowEditCommentDialog(true)
                    : setShowAddCommentDialog(true)
                }
                sx={{
                  mt: { xs: 1.5, sm: 2 },
                  mb: resume.comment ? 0.5 : 0, // Reduce gap if comment exists
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

export default FileCard;
