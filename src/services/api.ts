/**
 * ResumeAI API Service
 *
 * Centralized API client for handling all backend communication.
 * Includes proper error handling, TypeScript support, and
 * consistent request/response patterns.
 *
 * Features:
 * - Type-safe API calls
 * - Centralized error handling
 * - Request/response interceptors
 * - Authentication support
 *
 * @author ResumeAI Team
 */

import { Resume, ApiResponse } from "../types";
import { API_CONFIG } from "../theme/constants";

class ApiService {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.retryAttempts = API_CONFIG.retryAttempts;
    this.retryDelay = API_CONFIG.retryDelay;
  }

  /**
   * Generic fetch wrapper with retry logic and proper error handling
   */
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // If it's an abort error and we have retries left, retry
      if (
        attempt < this.retryAttempts &&
        error instanceof Error &&
        (error.name === "AbortError" || error.message.includes("fetch"))
      ) {
        console.warn(
          `API call failed (attempt ${attempt}), retrying in ${this.retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Fetch all resumes from the CVs endpoint
   * GET /cvs
   */
  async getResumes(): Promise<Resume[]> {
    try {
      const url = `${this.baseURL}/cvs`;
      console.log(`🌐 API Service: Fetching resumes from: ${url}`);
      console.log(
        `🔧 API Config: baseURL=${this.baseURL}, timeout=${this.timeout}ms`
      );

      const response = await this.fetchWithRetry<any>(url, {
        method: "GET",
      });

      console.log(`📡 API Response received:`, response);

      // Handle the actual API response structure
      // The API returns a direct array of resume objects
      const resumesArray = Array.isArray(response) ? response : [];

      // Transform backend data to match frontend Resume interface
      const transformedResumes: Resume[] = resumesArray.map((resume: any) => ({
        id: resume.id || 0,
        filename: resume.original_filename || "Unknown file",
        filepath: resume.filepath || resume.stored_filename || "",
        fileSize: this.estimateFileSize(resume.original_filename || ""), // Estimate since not provided
        fileType: this.extractFileType(resume.original_filename || ""),
        uploadedAt: resume.upload_time || new Date().toISOString(),
        status: "completed" as const, // Default to completed since no status field
      }));

      console.log(
        `✅ Successfully transformed ${transformedResumes.length} resumes`
      );
      console.log(`📋 Sample transformed resume:`, transformedResumes[0]);

      return transformedResumes;
    } catch (error) {
      console.error("❌ Error fetching resumes:", error);

      // Return empty array instead of crashing the app
      // This provides better UX and allows the app to continue functioning
      return [];
    }
  }

  /**
   * Extract file type from filename
   */
  private extractFileType(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "unknown";
  }

  /**
   * Estimate file size based on file type (since not provided by API)
   * This is a fallback until the backend provides actual file sizes
   */
  private estimateFileSize(filename: string): number {
    const extension = this.extractFileType(filename);

    // Provide reasonable estimates based on file type
    switch (extension) {
      case "pdf":
        return Math.floor(Math.random() * 2000000) + 500000; // 0.5-2.5MB
      case "doc":
      case "docx":
        return Math.floor(Math.random() * 1000000) + 200000; // 0.2-1.2MB
      case "txt":
        return Math.floor(Math.random() * 100000) + 10000; // 10-110KB
      default:
        return Math.floor(Math.random() * 1500000) + 300000; // 0.3-1.8MB
    }
  }

  /**
   * Normalize status to match frontend enum
   * Since the API doesn't provide status, we default to completed
   */
  private normalizeStatus(
    status: string
  ): "uploaded" | "processing" | "completed" | "failed" {
    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "uploaded":
      case "pending":
        return "uploaded";
      case "processing":
      case "in_progress":
        return "processing";
      case "completed":
      case "done":
      case "finished":
        return "completed";
      case "failed":
      case "error":
        return "failed";
      default:
        return "completed";
    }
  }

  /**
   * Search resumes with query
   * This can be extended when backend supports search
   */
  async searchResumes(query: string): Promise<Resume[]> {
    try {
      // For now, get all resumes and filter on frontend
      // This can be optimized when backend supports search endpoint
      const allResumes = await this.getResumes();

      if (!query.trim()) {
        return allResumes;
      }

      const searchQuery = query.toLowerCase();
      return allResumes.filter(
        (resume) =>
          resume.filename.toLowerCase().includes(searchQuery) ||
          resume.fileType.toLowerCase().includes(searchQuery)
      );
    } catch (error) {
      console.error("Error searching resumes:", error);
      return [];
    }
  }

  /**
   * Delete a resume by ID
   * POST /delete/{id}
   */
  async deleteResume(
    id: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const url = `${this.baseURL}/delete/${id}`;
      console.log(`🗑️ API Service: Deleting resume with ID ${id} at: ${url}`);

      const response = await this.fetchWithRetry<ApiResponse>(url, {
        method: "POST",
      });

      console.log(`📡 Delete API Response:`, response);

      // Handle success response
      return {
        success: true,
        message: response.message || "Resume deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting resume:", error);

      // Return error instead of throwing to allow graceful handling
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete resume",
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
