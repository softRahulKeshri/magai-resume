import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  alpha,
  Modal,
  Backdrop,
  Fade,
  IconButton,
} from "@mui/material";
import { Close, Warning, Delete } from "@mui/icons-material";
import { DeleteConfirmModalProps } from "./types";
import { lightTheme } from "./theme";

/**
 * Custom Styled Modal Component for File Deletion
 */
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

export default DeleteConfirmModal;
