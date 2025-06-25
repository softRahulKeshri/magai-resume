/**
 * TypeScript Type Definitions for Resume Management System
 *
 * Design Decision: Centralized types for consistency across components
 * Why: Ensures type safety, better IDE support, easier refactoring
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
  rawText: string;
  profile?: string;
  emails: string[];
  phones: string[];
  skills: Skills;
  experienceLevel: "junior" | "mid" | "senior";
  experienceYears?: number;
  education: string[];
  workExperience: WorkExperience;
  relevanceScore: number;
  uploadedAt: string;
  extractedAt: string;
  matchReason?: string;
  hasTextMatch?: boolean;
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
  filename: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchFilters {
  experienceLevel?: "junior" | "mid" | "senior";
  skills?: string[];
  minRelevanceScore?: number;
}

export interface DatabaseStats {
  totalResumes: number;
  experienceLevels: {
    junior: number;
    mid: number;
    senior: number;
  };
  avgRelevanceScore: number;
  latestUpload: string;
}
