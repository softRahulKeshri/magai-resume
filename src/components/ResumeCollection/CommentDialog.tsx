import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
} from "@mui/material";
import { Close, Comment, Send } from "@mui/icons-material";
import { CommentDialogProps } from "./types";
import { lightTheme } from "./theme";

/**
 * Comment Management Dialog Component
 */
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
  useEffect(() => {
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

export default CommentDialog;
