import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  alpha,
  Collapse,
  Link,
} from "@mui/material";
import { Edit, Delete, Person } from "@mui/icons-material";
import { CommentDisplayProps } from "./types";
import { lightTheme } from "./theme";
import { formatCommentDate } from "./utils";

/**
 * Compact, Expandable Comment Display Component
 */
const MAX_LINES = 3;

const CommentDisplay = ({ comment, onEdit, onDelete }: CommentDisplayProps) => {
  const [expanded, setExpanded] = useState(false);

  // Utility to check if comment is long
  const isLong =
    comment.comment.split("\n").length > MAX_LINES ||
    comment.comment.length > 120;

  // Truncate comment for preview
  const getPreview = () => {
    const lines = comment.comment.split("\n");
    if (lines.length > MAX_LINES) {
      return lines.slice(0, MAX_LINES).join("\n") + "...";
    }
    if (comment.comment.length > 120) {
      return comment.comment.slice(0, 120) + "...";
    }
    return comment.comment;
  };

  return (
    <Card
      sx={{
        mt: 1.5,
        background: `linear-gradient(135deg, ${alpha(
          lightTheme.primary,
          0.01
        )} 0%, ${alpha(lightTheme.primary, 0.04)} 100%)`,
        border: `1px solid ${alpha(lightTheme.primary, 0.12)}`,
        borderRadius: "10px",
        boxShadow: "none",
        p: 0,
        overflow: "visible",
      }}
      elevation={0}
    >
      <CardContent
        sx={{
          p: 2,
          pb: 2.5,
          ".MuiTypography-root": { wordBreak: "break-word" },
        }}
      >
        {/* Metadata row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 0.5,
            flexWrap: "nowrap",
            minHeight: 32,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${
                lightTheme.primary
              } 0%, ${alpha(lightTheme.primary, 0.7)} 100%)`,
              mr: 1.2,
              flexShrink: 0,
            }}
          >
            <Person sx={{ fontSize: "1rem", color: "#fff" }} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: lightTheme.text,
                fontWeight: 600,
                fontSize: "0.92rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 120,
              }}
            >
              {comment.hrName || "HR Team"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: lightTheme.textMuted,
                fontSize: "0.82rem",
                mt: 0.2,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
                letterSpacing: 0.1,
              }}
            >
              {formatCommentDate(comment.updatedAt || comment.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto", display: "flex", gap: 0.5, flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: lightTheme.textMuted,
                borderRadius: "7px",
                p: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: alpha(lightTheme.primary, 0.08),
                  color: lightTheme.primary,
                },
              }}
              aria-label="Edit comment"
            >
              <Edit sx={{ fontSize: "1rem" }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: lightTheme.textMuted,
                borderRadius: "7px",
                p: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: alpha(lightTheme.error, 0.08),
                  color: lightTheme.error,
                },
              }}
              aria-label="Delete comment"
            >
              <Delete sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Box>
        </Box>
        {/* Comment text, collapsible */}
        <Collapse
          in={expanded || !isLong}
          collapsedSize={60}
          sx={{ transition: "all 0.2s" }}
        >
          <Typography
            variant="body2"
            sx={{
              color: lightTheme.textSecondary,
              fontSize: "0.97rem",
              lineHeight: 1.6,
              minHeight: 0,
              maxHeight: expanded ? "none" : 72,
              overflow: "hidden",
              whiteSpace: "pre-line",
              mb: 0.5,
            }}
          >
            {expanded || !isLong ? comment.comment : getPreview()}
          </Typography>
        </Collapse>
        {/* Show more/less link */}
        {isLong && (
          <Box sx={{ textAlign: "left", mt: 0.5 }}>
            <Link
              component="button"
              underline="none"
              color="primary"
              sx={{
                fontSize: "0.83rem",
                fontWeight: 400,
                px: 0,
                py: 0,
                minHeight: 0,
                minWidth: 0,
                lineHeight: 1.2,
                letterSpacing: 0.01,
                background: "none",
                boxShadow: "none",
                transition: "color 0.2s",
                "&:hover": {
                  color: lightTheme.primary,
                  textDecoration: "underline",
                  background: "none",
                },
                display: "inline-block",
                ml: 0,
                mt: 0.5,
              }}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show less" : "Show more"}
            </Link>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentDisplay;
