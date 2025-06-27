/**
 * Custom Hook for Resume Data Management
 *
 * This hook provides:
 * - Automatic data fetching on mount
 * - Loading and error states
 * - Refresh functionality
 * - Memory optimization with proper cleanup
 * - Real-time data synchronization
 *
 * Design Decision: Using a custom hook instead of global state management
 * Why: Keeps data close to where it's used, easier to test, and better performance
 * for this specific use case where resume data is primarily used in one section
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Resume } from "../types";
import { apiService } from "../services/api";

interface UseResumesReturn {
  resumes: Resume[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deleteResume: (id: number) => Promise<{ success: boolean; message?: string }>;
  isEmpty: boolean;
  totalCount: number;
}

interface UseResumesOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
}

export const useResumes = (
  options: UseResumesOptions = {}
): UseResumesReturn => {
  const { autoFetch = true, refetchInterval } = options;

  // State management
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup and preventing race conditions
  const mountedRef = useRef<boolean>(true);
  const loadingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch resumes from API with proper error handling
   */
  const fetchResumes = useCallback(async (): Promise<void> => {
    // Use ref to prevent multiple simultaneous requests instead of state
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Starting to fetch resumes from API...");
      const fetchedResumes = await apiService.getResumes();

      // Only update state if component is still mounted
      if (mountedRef.current) {
        setResumes(fetchedResumes);

        // Log success for monitoring
        console.log(`✅ Successfully loaded ${fetchedResumes.length} resumes`);
      }
    } catch (err) {
      // Only update error state if component is still mounted
      if (mountedRef.current) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch resumes";
        setError(errorMessage);

        // Log error for monitoring
        console.error("❌ Failed to fetch resumes:", errorMessage);

        // Keep existing resumes on error instead of clearing them
        // This provides better UX by showing stale data rather than empty state
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  }, []);

  /**
   * Refresh data - public interface for manual refresh
   */
  const refresh = useCallback(async (): Promise<void> => {
    await fetchResumes();
  }, [fetchResumes]);

  /**
   * Delete a resume and refresh the list
   */
  const deleteResume = useCallback(
    async (id: number): Promise<{ success: boolean; message?: string }> => {
      try {
        console.log(`🗑️ useResumes: Deleting resume with ID ${id}`);

        const result = await apiService.deleteResume(id);

        if (result.success) {
          console.log(
            `✅ useResumes: Resume ${id} deleted successfully, refreshing list...`
          );
          // Automatically refresh the list after successful deletion
          await fetchResumes();
        } else {
          console.error(
            `❌ useResumes: Failed to delete resume ${id}:`,
            result.message
          );
        }

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete resume";
        console.error(
          `❌ useResumes: Error deleting resume ${id}:`,
          errorMessage
        );

        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [fetchResumes]
  );

  /**
   * Setup automatic data fetching on mount
   */
  useEffect(() => {
    console.log(
      `🚀 useResumes: useEffect triggered with autoFetch=${autoFetch}`
    );
    if (autoFetch) {
      console.log(`🎯 useResumes: About to call fetchResumes()`);
      fetchResumes();
    }
  }, [autoFetch, fetchResumes]);

  /**
   * Setup periodic refresh if specified
   */
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchResumes();
      }, refetchInterval);

      // Cleanup interval on unmount or interval change
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [refetchInterval, fetchResumes]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Derived state for better UX
  const isEmpty = resumes.length === 0 && !loading;
  const totalCount = resumes.length;

  return {
    resumes,
    loading,
    error,
    refresh,
    deleteResume,
    isEmpty,
    totalCount,
  };
};

export default useResumes;
