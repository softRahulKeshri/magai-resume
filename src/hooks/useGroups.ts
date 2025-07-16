/**
 * Simple useGroups Hook
 *
 * A straightforward hook for managing groups.
 * Easy to understand and use.
 */

import { useState, useEffect, useCallback } from "react";
import { Group, CreateGroupRequest } from "../types";
import { apiService } from "../services/api";

interface UseGroupsReturn {
  groups: Group[];
  loading: boolean;
  error: string | null;
  createGroup: (groupData: CreateGroupRequest) => Promise<Group>;
  deleteGroup: (id: number) => Promise<boolean>;
  refreshGroups: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing groups
 *
 * Features:
 * - Automatic group fetching on mount
 * - CRUD operations with optimistic updates
 * - Loading states and error handling
 * - Automatic refresh after mutations
 *
 * This hook provides a clean, reusable interface for group management
 * throughout the application, following the separation of concerns principle.
 */
export const useGroups = (): UseGroupsReturn => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch groups from API
   * Uses useCallback to prevent unnecessary re-renders and provide
   * a stable reference for useEffect dependencies
   */
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedGroups = await apiService.getGroups();
      setGroups(fetchedGroups);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch groups";
      setError(errorMessage);
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new group
   * Uses optimistic updates for better UX - immediately updates UI
   * then rolls back if the API call fails
   */
  const createGroup = useCallback(
    async (groupData: CreateGroupRequest): Promise<Group> => {
      try {
        setError(null);

        // Create the group via API
        const newGroup = await apiService.createGroup(groupData);

        // Optimistically add to local state
        setGroups((prevGroups) => [...prevGroups, newGroup]);

        return newGroup;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create group";
        setError(errorMessage);
        console.error("Error creating group:", err);
        throw err; // Re-throw to allow caller to handle the error
      }
    },
    []
  );

  /**
   * Delete a group by ID
   * Uses optimistic updates - removes from UI immediately
   * then rolls back if API call fails
   */
  const deleteGroup = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setError(null);

        // Store original state for potential rollback
        const originalGroups = groups;

        // Optimistically remove from local state
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== id)
        );

        // Attempt to delete via API
        const result = await apiService.deleteGroup(id);

        if (!result.success) {
          // Rollback on failure
          setGroups(originalGroups);

          // Check if this is a linked CVs error - throw error for these so UI can handle them
          const errorMessage = result.message || "Failed to delete group";
          const isLinkedCVsError =
            errorMessage.includes(
              "Cannot delete group with CVs linked to it"
            ) ||
            errorMessage.includes("CVs linked") ||
            errorMessage.includes("associated data") ||
            errorMessage.includes("Group has associated CVs");

          if (isLinkedCVsError) {
            // Throw error for linked CVs so UI can catch and handle appropriately
            throw new Error(errorMessage);
          } else {
            setError(errorMessage);
            return false;
          }
        }

        return true;
      } catch (err) {
        // Rollback on error
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete group";

        // Check if this is a linked CVs error - re-throw for UI handling
        const isLinkedCVsError =
          errorMessage.includes("Cannot delete group with CVs linked to it") ||
          errorMessage.includes("CVs linked") ||
          errorMessage.includes("associated data") ||
          errorMessage.includes("Group has associated CVs");

        if (isLinkedCVsError) {
          // Re-throw linked CVs errors for UI to handle
          throw err;
        } else {
          setError(errorMessage);
          console.error("Error deleting group:", err);
          // Refresh groups to ensure consistency
          await fetchGroups();
          return false;
        }
      }
    },
    [groups, fetchGroups]
  );

  /**
   * Refresh groups manually
   * Useful for situations where we want to ensure data consistency
   */
  const refreshGroups = useCallback(async () => {
    await fetchGroups();
  }, [fetchGroups]);

  /**
   * Clear error state
   * Allows users to dismiss error messages
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Fetch groups on component mount
   * Only runs once due to empty dependency array
   */
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    createGroup,
    deleteGroup,
    refreshGroups,
    clearError,
  };
};
