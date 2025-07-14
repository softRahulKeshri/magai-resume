import React from "react";
import { Box, Typography, Button, Pagination, alpha } from "@mui/material";
import { Close } from "@mui/icons-material";
import { lightTheme, colorPalette } from "./theme";
import FileCard from "./FileCard";
import { Resume, ResumeComment } from "../../types";

interface ResumeGridProps {
  filteredResumes: Resume[];
  paginatedResumes: Resume[];
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  selectedGroup: string | null;
  searchQuery: string;
  onView: (resume: Resume) => void;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  onResumeDeleted: (resumeId: number) => void;
  onCommentAdded: (resumeId: number, comment: ResumeComment) => void;
  onCommentUpdated: (resumeId: number, comment: ResumeComment) => void;
  onCommentDeleted: (resumeId: number, commentId: number) => void;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  clearAllFilters: () => void;
}

/**
 * Resume Grid Component with Pagination
 */
const ResumeGrid = ({
  filteredResumes,
  paginatedResumes,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  selectedGroup,
  searchQuery,
  onView,
  onDownload,
  onDelete,
  onResumeDeleted,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
  onPageChange,
  clearAllFilters,
}: ResumeGridProps) => {
  return (
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
            onResumeDeleted={onResumeDeleted}
            onCommentAdded={onCommentAdded}
            onCommentUpdated={onCommentUpdated}
            onCommentDeleted={onCommentDeleted}
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
            onChange={onPageChange}
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
                  boxShadow: `0 4px 12px ${alpha(lightTheme.primary, 0.25)}`,
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
  );
};

export default ResumeGrid;
