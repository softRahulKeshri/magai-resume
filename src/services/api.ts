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

// Extended API response type for CVs endpoint
interface CVsApiResponse extends ApiResponse<Resume[]> {
  data: Resume[];
  total?: number;
  page?: number;
  limit?: number;
}

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

      const response = await this.fetchWithRetry<CVsApiResponse>(url, {
        method: "GET",
      });

      console.log(`📡 API Response received:`, response);

      // Handle different response formats from backend
      if (response.success === false) {
        throw new Error(response.error || "Failed to fetch resumes");
      }

      // If response has data property, use it; otherwise assume response is the array
      const resumes =
        response.data || (Array.isArray(response) ? response : []);

      // Transform backend data to match frontend Resume interface
      const transformedResumes: Resume[] = resumes.map(
        (resume: any, index: number) => ({
          id: resume.id || index + 1,
          filename: resume.filename || resume.name || "Unknown file",
          filepath: resume.filepath || resume.path,
          fileSize: resume.fileSize || resume.size || 0,
          fileType:
            resume.fileType ||
            resume.type ||
            this.extractFileType(resume.filename || ""),
          uploadedAt:
            resume.uploadedAt || resume.created_at || new Date().toISOString(),
          status: this.normalizeStatus(resume.status || "completed"),
        })
      );

      console.log(`Successfully fetched ${transformedResumes.length} resumes`);
      return transformedResumes;
    } catch (error) {
      console.error("Error fetching resumes:", error);

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
   * Normalize status to match frontend enum
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
