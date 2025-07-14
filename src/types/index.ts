/**
 * TypeScript Type Definitions for Resume Management System
 *
 * Design Decision: Simplified types focused on file management only
 * Why: Frontend will only handle file uploads, extraction happens on backend
 */

export interface Resume {
  id: number;
  filename: string;
  original_filename?: string; // Original name when uploaded
  stored_filename?: string; // Name stored on server (used for API calls)
  filepath?: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  group?: string; // Group/category the resume belongs to
  comment?: ResumeComment; // HR comment on the resume
}

// Comment-related types for HR functionality
export interface ResumeComment {
  id: number;
  resumeId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  hrName?: string; // Optional HR person name
}

export interface CreateCommentRequest {
  resumeId: number;
  comment: string;
}

export interface UpdateCommentRequest {
  commentId: number;
  comment: string;
}

export interface CommentResponse extends ApiResponse {
  data?: ResumeComment;
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

// Group-related types for organizing CVs
export interface Group {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  created_at?: string; // Backend compatibility
  resumeCount?: number;
  resume_count?: number; // Backend compatibility
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface CreateGroupResponse extends ApiResponse {
  data?: Group;
}

export interface DeleteGroupResponse extends ApiResponse {
  data?: { id: number };
}

export interface GroupListResponse extends ApiResponse {
  data?: Group[];
}
