// Theme type definitions
export interface LightTheme {
  background: string;
  surface: string;
  surfaceLight: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
}

export interface ColorTheme {
  primary: string;
  secondary: string;
  gradient: string;
  shadowColor: string;
  hoverShadowColor: string;
  background: string;
  border: string;
}

// Modal Props
export interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filename: string;
  isDeleting: boolean;
}

export interface DeleteCommentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filename: string;
  commentText: string;
  isDeleting: boolean;
}

export interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  isLoading: boolean;
  title: string;
  initialComment?: string;
  submitLabel: string;
}

export interface CommentDisplayProps {
  comment: ResumeComment;
  onEdit: () => void;
  onDelete: () => void;
}

// Component Props
export interface StatsCardProps {
  title: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
}

export interface FileCardProps {
  resume: Resume;
  onView: (resume: Resume) => void;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  onResumeDeleted?: (resumeId: number) => void;
  onCommentAdded?: (resumeId: number, comment: ResumeComment) => void;
  onCommentUpdated?: (resumeId: number, comment: ResumeComment) => void;
  onCommentDeleted?: (resumeId: number, commentId: number) => void;
}

export interface ResumeCollectionProps {
  resumes: Resume[];
  onView?: (resume: Resume) => void;
  onDownload?: (resume: Resume) => void;
  onDelete?: (resume: Resume) => void;
  onResumeDeleted?: (resumeId: number) => void;
  onResumeUpdated?: (resumeId: number, updatedResume: Resume) => void;
  onRefreshResumes?: () => Promise<void>;
  isLoading?: boolean;
}

// Import types from the main types file
import { Resume, ResumeComment } from "../../types";
