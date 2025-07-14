/**
 * Resume Analytics - Clean Analytics Dashboard Component
 *
 * A focused analytics interface displaying resume statistics.
 * Matches the modern dark theme design with essential metrics only.
 */

import React, { useState, useMemo, useEffect } from "react";
import { Box } from "@mui/material";
import { Resume, ResumeComment } from "../../types";
import { useGroups } from "../../hooks/useGroups";
import { lightTheme } from "./theme";
import { ResumeCollectionProps } from "./types";

// Import all components
import AnalyticsHeader from "./AnalyticsHeader";
import SearchAndFilter from "./SearchAndFilter";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import ResumeGrid from "./ResumeGrid";

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
  useEffect(() => {
    setLocalResumes(resumes);
  }, [resumes]);

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
  useEffect(() => {
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

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedGroup(null);
    setSearchQuery("");
  };

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
      {/* Analytics Header */}
      <AnalyticsHeader
        totalFiles={stats.totalFiles}
        totalGroups={stats.totalGroups}
      />

      {/* Search and Filter Section */}
      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        groupStats={groupStats}
        groupsLoading={groupsLoading}
        groupsError={groupsError}
        clearGroupsError={clearGroupsError}
        refreshGroups={refreshGroups}
        isLoading={isLoading}
      />

      {/* Content Section */}
      {isLoading ? (
        <LoadingState />
      ) : filteredResumes.length === 0 ? (
        <EmptyState
          selectedGroup={selectedGroup}
          searchQuery={searchQuery}
          clearAllFilters={clearAllFilters}
        />
      ) : (
        <ResumeGrid
          filteredResumes={filteredResumes}
          paginatedResumes={paginatedResumes}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          selectedGroup={selectedGroup}
          searchQuery={searchQuery}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
          onResumeDeleted={handleResumeDeleted}
          onCommentAdded={handleCommentAdded}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
          onPageChange={handlePageChange}
          clearAllFilters={clearAllFilters}
        />
      )}
    </Box>
  );
};

export default ResumeCollection;
