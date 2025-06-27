/**
 * TypeScript Type Definitions for Resume Management System
 *
 * Design Decision: Simplified types focused on file management only
 * Why: Frontend will only handle file uploads, extraction happens on backend
 */

export interface Skills {
  all: string[];
  frontend: string[];
  backend: string[];
  database: string[];
  cloud: string[];
  mobile: string[];
  tools: string[];
}

export interface WorkExperience {
  companies: string[];
  roles: string[];
  rawText?: string[];
}

export interface Resume {
  id: number;
  filename: string;
  filepath?: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: "uploaded" | "processing" | "completed" | "failed";
}

export interface UploadResult {
  message: string;
  successful: number;
  failed: number;
  total: number;
  results: Resume[];
  errors: Array<{
    filename: string;
    error: string;
  }>;
}

export interface SearchResult {
  query: string;
  results: Resume[];
  total: number;
}

export interface UploadProgress {
  filesProcessed: number;
  totalFiles: number;
  currentFile: string;
  percentage: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchFilters {
  filename?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: "uploaded" | "processing" | "completed" | "failed";
}

export interface DatabaseStats {
  totalResumes: number;
  uploadedToday: number;
  processingCount: number;
  latestUpload: string;
}
