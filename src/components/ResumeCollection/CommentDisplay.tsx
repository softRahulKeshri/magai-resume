import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  alpha,
} from "@mui/material";
import { Edit, Delete, Person } from "@mui/icons-material";
import { CommentDisplayProps } from "./types";
import { lightTheme } from "./theme";
import { formatCommentDate } from "./utils";

/**
 * Comment Display Component
 */
const CommentDisplay = ({ comment, onEdit, onDelete }: CommentDisplayProps) => {
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
                {formatCommentDate(comment.updatedAt || comment.createdAt)}
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

export default CommentDisplay;
