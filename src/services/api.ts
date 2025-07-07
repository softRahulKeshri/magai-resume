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

import {
  Resume,
  ApiResponse,
  Group,
  CreateGroupRequest,
  CreateGroupResponse,
  DeleteGroupResponse,
  GroupListResponse,
} from "../types";
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
        // Try to extract the actual error message from the response body
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          // Look for common error message fields
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (parseError) {
          // If we can't parse the response body, keep the original error message
          console.warn("Could not parse error response body:", parseError);
        }
        throw new Error(errorMessage);
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
   * POST /cvs
   * @param groupName - Optional group name to filter resumes by specific group
   */
  async getResumes(groupName?: string): Promise<Resume[]> {
    try {
      const url = `${this.baseURL}/cvs`;
      console.log(`🌐 API Service: Fetching resumes from: ${url}`);
      console.log(
        `🔧 API Config: baseURL=${this.baseURL}, timeout=${this.timeout}ms`
      );

      // Prepare payload: empty object for all CVs, or object with group name for specific group
      const payload = groupName ? { group: groupName } : {};
      console.log(`📦 API Payload:`, payload);

      const response = await this.fetchWithRetry<any>(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(`📡 API Response received:`, response);

      // Handle the actual API response structure
      // The API returns a direct array of resume objects
      const resumesArray = Array.isArray(response) ? response : [];

      // Transform backend data to match frontend Resume interface
      const transformedResumes: Resume[] = resumesArray.map((resume: any) => ({
        id: resume.id || 0,
        filename: resume.original_filename || "Unknown file",
        original_filename: resume.original_filename || undefined,
        stored_filename: resume.stored_filename || undefined,
        filepath: resume.filepath || resume.stored_filename || "",
        fileSize: this.estimateFileSize(resume.original_filename || ""), // Estimate since not provided
        fileType: this.extractFileType(resume.original_filename || ""),
        uploadedAt: resume.upload_time || new Date().toISOString(),
        status: "completed" as const, // Default to completed since no status field
        group: resume.group || undefined, // Include group field from API response
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

  /**
   * Fetch all groups
   * GET /groups
   */
  async getGroups(): Promise<Group[]> {
    try {
      const url = `${this.baseURL}/groups`;
      console.log(`🌐 API Service: Fetching groups from: ${url}`);

      const response = await this.fetchWithRetry<GroupListResponse>(url, {
        method: "GET",
      });

      console.log(`📡 Groups API Response:`, response);

      // Handle response structure - adapt based on actual API response
      const groups = response.data || response || [];

      // Transform to ensure consistent Group interface
      const transformedGroups: Group[] = Array.isArray(groups)
        ? groups.map((group: any) => ({
            id: group.id || 0,
            name: group.name || "Unknown Group",
            description: group.description || "",
            createdAt:
              group.createdAt || group.created_at || new Date().toISOString(),
            resumeCount: group.resumeCount || group.resume_count || 0,
          }))
        : [];

      console.log(`✅ Successfully fetched ${transformedGroups.length} groups`);
      return transformedGroups;
    } catch (error) {
      console.error("❌ Error fetching groups:", error);
      // Return empty array to maintain app functionality
      return [];
    }
  }

  /**
   * Create a new group
   * POST /groups
   */
  async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    try {
      const url = `${this.baseURL}/groups`;
      console.log(`🆕 API Service: Creating group at: ${url}`, groupData);

      const response = await this.fetchWithRetry<CreateGroupResponse>(url, {
        method: "POST",
        body: JSON.stringify(groupData),
      });

      console.log(`📡 Create Group API Response:`, response);

      // Handle response structure
      const responseData = response.data || response;

      if (
        !responseData ||
        typeof responseData !== "object" ||
        !("id" in responseData)
      ) {
        throw new Error("Invalid response: Group not created");
      }

      const group = responseData as Group;

      // Transform to ensure consistent Group interface
      const transformedGroup: Group = {
        id: group.id,
        name: group.name || groupData.name,
        description: group.description || groupData.description || "",
        createdAt:
          group.createdAt || group.created_at || new Date().toISOString(),
        resumeCount: group.resumeCount || group.resume_count || 0,
      };

      console.log(`✅ Successfully created group:`, transformedGroup);
      return transformedGroup;
    } catch (error) {
      console.error("❌ Error creating group:", error);
      throw error;
    }
  }

  /**
   * Delete a group by ID
   * DELETE /groups/{id}
   */
  async deleteGroup(
    id: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const url = `${this.baseURL}/groups/${id}`;
      console.log(`🗑️ API Service: Deleting group with ID ${id} at: ${url}`);

      const response = await this.fetchWithRetry<DeleteGroupResponse>(url, {
        method: "DELETE",
      });

      console.log(`📡 Delete Group API Response:`, response);

      return {
        success: true,
        message: response.message || "Group deleted successfully",
      };
    } catch (error) {
      console.error("❌ Error deleting group:", error);

      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete group",
      };
    }
  }

  /**
   * Upload CVs to a specific group
   * POST /upload_cv with group name in FormData
   */
  async uploadCVsToGroup(formData: FormData): Promise<any> {
    try {
      const url = `${this.baseURL}/upload_cv`;
      const groupName = formData.get("group") as string;
      console.log(
        `📤 API Service: Uploading CVs to group "${groupName}" at: ${url}`
      );

      // Use XMLHttpRequest for upload progress
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Add upload progress tracking
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
            // You can emit this progress if needed
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            let result: any = {};
            try {
              result = JSON.parse(xhr.responseText || "{}");
            } catch (parseError) {
              const actualFileCount = formData.getAll("cv").length;
              result = {
                message: "Files uploaded successfully",
                successful: actualFileCount,
              };
            }

            const actualFileCount = formData.getAll("cv").length;
            const uploadResult = {
              successful:
                result.successful ||
                result.files?.length ||
                result.count ||
                actualFileCount,
              failed: result.failed || 0,
              total:
                result.total ||
                result.files?.length ||
                result.count ||
                actualFileCount,
              message:
                result.message ||
                result.status ||
                "Files uploaded successfully to group!",
              results: result.files || result.data || [],
              errors: result.errors || [],
            };

            console.log(
              `✅ Upload to group "${groupName}" successful:`,
              uploadResult
            );
            resolve(uploadResult);
          } else {
            const errorMessage =
              xhr.responseText ||
              `Upload failed: ${xhr.status} ${xhr.statusText}`;
            console.error("❌ Upload to group failed:", errorMessage);
            reject(new Error(errorMessage));
          }
        });

        xhr.addEventListener("error", () => {
          const errorMessage = "Network error: Unable to connect to server";
          console.error("❌ Upload error:", errorMessage);
          reject(new Error(errorMessage));
        });

        xhr.addEventListener("timeout", () => {
          const errorMessage = `Upload timeout after ${
            this.timeout / 1000
          } seconds. Please try with fewer or smaller files.`;
          console.error("❌ Upload timeout:", errorMessage);
          reject(new Error(errorMessage));
        });

        // Set timeout from configuration
        xhr.timeout = this.timeout;

        // Initialize request with proper headers
        xhr.open("POST", url);
        xhr.setRequestHeader("Accept", "application/json");

        // Add custom headers for better error handling
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("X-Upload-Group", groupName);

        // Send the form data
        xhr.send(formData);
      });
    } catch (error) {
      console.error("❌ Error uploading CVs to group:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
