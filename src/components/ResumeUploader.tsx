/**
 * MAGURE.AI ResumeUploader Component
 *
 * Premium AI-powered resume upload system with:
 * - Drag & drop interface with visual feedback
 * - Real-time progress tracking
 * - Advanced file validation
 * - Bulk upload capabilities
 * - Detailed error handling
 * - Professional animations
 * - Performance optimizations
 *
 * @author MAGURE.AI Team
 */

import React, { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CloudUpload,
  Description,
  CheckCircle,
  Error,
  Delete,
  Refresh,
  FileUpload,
  AnimationOutlined,
  Celebration,
  Assessment,
  Speed,
  InsertDriveFile,
} from "@mui/icons-material";

// Internal imports
import { UploadResult, UploadProgress } from "../types";
import {
  BRAND_COLORS,
  SHADOWS,
  ANIMATION_DURATION,
  BLUR,
  UPLOAD_CONFIG,
} from "../theme/constants";
import { animations } from "../theme/animations";
import {
  GlassCard,
  GradientButton,
  FlexContainer,
  Badge,
  LoadingSpinner,
  PulsingDot,
  Divider,
} from "./common/StyledComponents";

// Mock API function
const mockUploadResumes = async (formData: FormData): Promise<UploadResult> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 3000)
  );

  const files = formData.getAll("resumes") as File[];
  const successful = Math.floor(files.length * 0.8); // 80% success rate
  const failed = files.length - successful;

  // Simulate some failures
  const errors =
    failed > 0
      ? Array.from({ length: failed }, (_, i) => ({
          filename: `file_${i + successful + 1}.pdf`,
          error: "Unsupported format or corrupted file",
        }))
      : [];

  return {
    successful,
    failed,
    total: files.length,
    message: `Successfully processed ${successful} out of ${files.length} resumes`,
    results: [], // Mock empty results for now
    errors,
  };
};

// Styled Components
const DropzoneContainer = styled(GlassCard)<{
  isDragActive: boolean;
  isDragReject: boolean;
  isUploading: boolean;
}>(({ isDragActive, isDragReject, isUploading }) => ({
  padding: "4rem 2rem",
  textAlign: "center",
  cursor: isUploading ? "not-allowed" : "pointer",
  border: `3px dashed ${
    isDragReject
      ? BRAND_COLORS.accent.red
      : isDragActive
      ? BRAND_COLORS.primary.blue
      : BRAND_COLORS.neutral.whiteAlpha[20]
  }`,
  background: isDragActive
    ? `${BRAND_COLORS.primary.blue}14`
    : isDragReject
    ? `${BRAND_COLORS.accent.red}14`
    : BRAND_COLORS.neutral.whiteAlpha[10],
  position: "relative",
  overflow: "hidden",
  minHeight: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  "&:hover": !isUploading
    ? {
        background: `${BRAND_COLORS.primary.blue}1A`,
        borderColor: BRAND_COLORS.primary.blue,
        transform: "translateY(-4px) scale(1.02)",
        boxShadow: SHADOWS.xl,
      }
    : {},

  animation: isDragActive
    ? `${animations.pulseGlow} 1s ease-in-out infinite`
    : "none",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: `linear-gradient(90deg, transparent, ${BRAND_COLORS.neutral.whiteAlpha[10]}, transparent)`,
    transition: `left ${ANIMATION_DURATION.slow} ease`,
  },

  "&:hover::before": !isUploading
    ? {
        left: "100%",
      }
    : {},
}));

const AnimatedUploadIcon = styled(CloudUpload)<{
  isDragActive: boolean;
  isUploading: boolean;
}>(({ isDragActive, isUploading }) => ({
  fontSize: "4rem",
  color: isDragActive
    ? BRAND_COLORS.primary.blue
    : BRAND_COLORS.neutral.whiteAlpha[70],
  marginBottom: "1rem",
  transition: `all ${ANIMATION_DURATION.normal} cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
  animation: isDragActive
    ? `${animations.bounceIn} 0.6s ease-out`
    : isUploading
    ? `${animations.spin} 2s linear infinite`
    : `${animations.gentleFloat} 4s ease-in-out infinite`,
  filter: isDragActive
    ? `drop-shadow(0 0 30px ${BRAND_COLORS.primary.blue}CC) drop-shadow(0 0 60px ${BRAND_COLORS.primary.blue}66)`
    : "drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))",
  transform: isDragActive ? "scale(1.2) rotateZ(10deg)" : "scale(1)",
}));

const ProgressCard = styled(GlassCard)(() => ({
  marginTop: "1.5rem",
  padding: "1.5rem",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: `linear-gradient(90deg, ${BRAND_COLORS.primary.blue}, ${BRAND_COLORS.accent.red}, ${BRAND_COLORS.primary.blue})`,
    backgroundSize: "200% 100%",
    animation: `${animations.gradientShift} 3s ease-in-out infinite`,
  },
}));

const AnimatedProgressBar = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: BRAND_COLORS.neutral.whiteAlpha[20],

  "& .MuiLinearProgress-bar": {
    background: `linear-gradient(90deg, ${BRAND_COLORS.primary.blue}, ${BRAND_COLORS.accent.red}, ${BRAND_COLORS.primary.blueDark})`,
    backgroundSize: "200% 100%",
    animation: `${animations.shimmer} 2s linear infinite`,
    borderRadius: 4,
  },
}));

const FileItem = styled(ListItem)(() => ({
  background: BRAND_COLORS.neutral.whiteAlpha[10],
  margin: "0.5rem 0",
  borderRadius: "8px",
  border: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
  transition: `all ${ANIMATION_DURATION.normal} ease`,

  "&:hover": {
    background: BRAND_COLORS.neutral.whiteAlpha[15],
    transform: "translateX(4px)",
  },
}));

const StatusChip = styled(Chip)<{
  status: "uploading" | "processing" | "complete" | "error";
}>(({ status }) => {
  const statusColors = {
    uploading: BRAND_COLORS.primary.blue,
    processing: "#F59E0B",
    complete: "#10B981",
    error: BRAND_COLORS.accent.red,
  };

  const color = statusColors[status];

  return {
    background: `${color}20`,
    color,
    border: `1px solid ${color}40`,
    fontSize: "0.75rem",
    fontWeight: 600,
    animation:
      status === "processing"
        ? `${animations.subtlePulse} 2s ease-in-out infinite`
        : "none",
  };
});

// Component interfaces
interface ResumeUploaderProps {
  onUploadStart: () => void;
  onUploadSuccess: (result: UploadResult) => void;
  onUploadError: (error: string) => void;
}

interface FileWithProgress extends File {
  id: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
}

/**
 * ResumeUploader Component
 *
 * Handles file uploads with drag & drop interface, progress tracking,
 * and comprehensive error handling. Implements performance optimizations
 * through memoization and efficient state management.
 */
const ResumeUploader = ({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}: ResumeUploaderProps) => {
  // State management
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult | null>(null);

  // File validation with performance optimization
  const validateFile = useCallback((file: File): boolean => {
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      return false;
    }
    if (!UPLOAD_CONFIG.allowedTypes.includes(file.type as any)) {
      return false;
    }
    return true;
  }, []);

  // Optimized dropzone handler
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (isUploading) return;

      const validFiles = acceptedFiles.filter(validateFile);
      const newFiles: FileWithProgress[] = validFiles.map((file) => ({
        ...file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        progress: 0,
        status: "uploading" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      if (rejectedFiles.length > 0) {
        onUploadError(
          `${rejectedFiles.length} files were rejected due to size or type restrictions`
        );
      }
    },
    [isUploading, validateFile, onUploadError]
  );

  // Dropzone configuration with performance optimizations
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "text/plain": [".txt"],
      },
      maxSize: UPLOAD_CONFIG.maxFileSize,
      maxFiles: UPLOAD_CONFIG.maxFiles,
      disabled: isUploading,
      noClick: false,
      noKeyboard: false,
    });

  // Optimized upload handler with proper error handling
  const handleUpload = useCallback(async () => {
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);
    setShowResults(false);
    setUploadProgress(0);
    onUploadStart();

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("resumes", file);
      });

      // Simulate realistic progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 10 + 5; // 5-15% increments
          const newProgress = prev + increment;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 300);

      // Update files to processing status
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "processing" as const,
        }))
      );

      const result = await mockUploadResumes(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update file statuses based on results
      setFiles((prev) =>
        prev.map((file, index) => ({
          ...file,
          status: index < result.successful ? "complete" : "error",
          progress: 100,
          error: index >= result.successful ? "Processing failed" : undefined,
        }))
      );

      setUploadResults(result);
      setShowResults(true);
      onUploadSuccess(result);

      // Auto-clear successful uploads after delay
      setTimeout(() => {
        setFiles([]);
        setUploadProgress(0);
        setShowResults(false);
        setUploadResults(null);
      }, 8000);
    } catch (error) {
      const errorMessage = (error as Error)?.message || "Upload failed";

      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "error" as const,
          error: errorMessage,
        }))
      );

      onUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [files, isUploading, onUploadStart, onUploadSuccess, onUploadError]);

  // File management handlers
  const removeFile = useCallback(
    (fileId: string) => {
      if (isUploading) return;
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
    },
    [isUploading]
  );

  const clearAllFiles = useCallback(() => {
    if (isUploading) return;
    setFiles([]);
    setUploadProgress(0);
    setShowResults(false);
    setUploadResults(null);
  }, [isUploading]);

  // Memoized statistics for performance
  const stats = useMemo(() => {
    const totalFiles = files.length;
    const completedFiles = files.filter((f) => f.status === "complete").length;
    const errorFiles = files.filter((f) => f.status === "error").length;
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    return { totalFiles, completedFiles, errorFiles, totalSize };
  }, [files]);

  return (
    <Box>
      {/* Drag & Drop Zone */}
      <DropzoneContainer
        {...getRootProps()}
        isDragActive={isDragActive}
        isDragReject={isDragReject}
        isUploading={isUploading}
        intensity="medium"
      >
        <input {...getInputProps()} />

        <AnimatedUploadIcon
          isDragActive={isDragActive}
          isUploading={isUploading}
        />

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: BRAND_COLORS.neutral.white,
            fontWeight: 600,
            mb: 2,
          }}
        >
          {isDragActive
            ? "🎯 Drop your resumes here!"
            : isUploading
            ? "⚡ Processing your files..."
            : "📄 Upload Resume Files"}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: BRAND_COLORS.neutral.whiteAlpha[80],
            mb: 3,
            maxWidth: "500px",
            lineHeight: 1.6,
          }}
        >
          {isDragReject
            ? "❌ Some files are not supported. Please use PDF, DOC, DOCX, or TXT files under 10MB."
            : "Drag & drop your resume files here, or click to browse. Supports PDF, DOC, DOCX, and TXT files up to 10MB each."}
        </Typography>

        {!isUploading && (
          <GradientButton
            gradientVariant="primary"
            startIcon={<FileUpload />}
            sx={{ mt: 2 }}
          >
            Browse Files
          </GradientButton>
        )}

        {isUploading && (
          <FlexContainer gap={1} align="center">
            <LoadingSpinner size="small" />
            <Typography
              variant="body2"
              sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
            >
              AI is analyzing your documents...
            </Typography>
          </FlexContainer>
        )}
      </DropzoneContainer>

      {/* File Management Panel */}
      {files.length > 0 && (
        <Fade in timeout={600}>
          <ProgressCard>
            <FlexContainer
              justify="space-between"
              align="center"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: BRAND_COLORS.neutral.white,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Assessment sx={{ color: BRAND_COLORS.primary.blue }} />
                Upload Queue ({stats.totalFiles} files)
              </Typography>

              <FlexContainer gap={1}>
                <Badge variant="info">
                  Size: {(stats.totalSize / (1024 * 1024)).toFixed(1)} MB
                </Badge>
                {stats.completedFiles > 0 && (
                  <Badge variant="success">✅ {stats.completedFiles}</Badge>
                )}
                {stats.errorFiles > 0 && (
                  <Badge variant="error">❌ {stats.errorFiles}</Badge>
                )}
                {!isUploading && (
                  <IconButton
                    onClick={clearAllFiles}
                    size="small"
                    sx={{
                      color: BRAND_COLORS.accent.red,
                      "&:hover": { background: `${BRAND_COLORS.accent.red}20` },
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </FlexContainer>
            </FlexContainer>

            {/* Upload Progress */}
            {isUploading && (
              <Box sx={{ mb: 3 }}>
                <FlexContainer justify="space-between" sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: BRAND_COLORS.neutral.whiteAlpha[80] }}
                  >
                    Processing Progress
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: BRAND_COLORS.primary.blue, fontWeight: 600 }}
                  >
                    {Math.round(uploadProgress)}%
                  </Typography>
                </FlexContainer>
                <AnimatedProgressBar
                  variant="determinate"
                  value={uploadProgress}
                />
              </Box>
            )}

            {/* Files List */}
            <List sx={{ maxHeight: "300px", overflow: "auto" }}>
              {files.map((file) => (
                <Slide key={file.id} direction="up" in timeout={400}>
                  <FileItem>
                    <ListItemIcon>
                      <InsertDriveFile
                        sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
                      />
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: BRAND_COLORS.neutral.white,
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
                        >
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                      }
                    />

                    <FlexContainer gap={1} align="center">
                      <StatusChip
                        label={
                          file.status.charAt(0).toUpperCase() +
                          file.status.slice(1)
                        }
                        status={file.status}
                        size="small"
                      />

                      {file.status === "processing" && (
                        <FlexContainer gap={0.5}>
                          <PulsingDot delay={0} />
                          <PulsingDot delay={0.2} />
                          <PulsingDot delay={0.4} />
                        </FlexContainer>
                      )}

                      {file.status === "complete" && (
                        <CheckCircle
                          sx={{ color: "#10B981", fontSize: "1.2rem" }}
                        />
                      )}

                      {file.status === "error" && (
                        <Tooltip title={file.error || "Upload failed"}>
                          <Error
                            sx={{
                              color: BRAND_COLORS.accent.red,
                              fontSize: "1.2rem",
                            }}
                          />
                        </Tooltip>
                      )}

                      {!isUploading && (
                        <IconButton
                          onClick={() => removeFile(file.id)}
                          size="small"
                          sx={{
                            color: BRAND_COLORS.neutral.whiteAlpha[50],
                            "&:hover": {
                              color: BRAND_COLORS.accent.red,
                              background: `${BRAND_COLORS.accent.red}20`,
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </FlexContainer>
                  </FileItem>
                </Slide>
              ))}
            </List>

            {/* Upload Action */}
            {files.length > 0 && !isUploading && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <GradientButton
                  gradientVariant="primary"
                  onClick={handleUpload}
                  startIcon={<CloudUpload />}
                  sx={{ minWidth: "200px" }}
                >
                  Upload {files.length} File{files.length === 1 ? "" : "s"}
                </GradientButton>
              </Box>
            )}
          </ProgressCard>
        </Fade>
      )}

      {/* Success Results */}
      {showResults && uploadResults && (
        <Zoom in timeout={800}>
          <ProgressCard sx={{ mt: 3 }}>
            <FlexContainer align="center" gap={2} sx={{ mb: 2 }}>
              <Celebration sx={{ color: "#10B981", fontSize: "2rem" }} />
              <Typography
                variant="h6"
                sx={{
                  color: BRAND_COLORS.neutral.white,
                  fontWeight: 600,
                }}
              >
                Upload Complete!
              </Typography>
            </FlexContainer>

            <FlexContainer gap={2} wrap sx={{ mb: 2 }}>
              <Badge variant="success">
                ✅ Successful: {uploadResults.successful}
              </Badge>
              {uploadResults.failed > 0 && (
                <Badge variant="error">❌ Failed: {uploadResults.failed}</Badge>
              )}
              <Badge variant="info">
                📊 Total Processed: {uploadResults.total}
              </Badge>
            </FlexContainer>

            <Typography
              variant="body2"
              sx={{
                color: BRAND_COLORS.neutral.whiteAlpha[80],
                fontStyle: "italic",
                mb: 2,
              }}
            >
              {uploadResults.message}
            </Typography>

            {uploadResults.errors && uploadResults.errors.length > 0 && (
              <Collapse in timeout={600}>
                <Alert
                  severity="warning"
                  sx={{
                    mt: 2,
                    background: `${BRAND_COLORS.accent.red}20`,
                    color: BRAND_COLORS.neutral.white,
                    border: `1px solid ${BRAND_COLORS.accent.red}40`,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Issues encountered:
                  </Typography>
                  {uploadResults.errors.map((error, index) => (
                    <Typography key={index} variant="caption" display="block">
                      • {error.filename}: {error.error}
                    </Typography>
                  ))}
                </Alert>
              </Collapse>
            )}
          </ProgressCard>
        </Zoom>
      )}
    </Box>
  );
};

export default ResumeUploader;
