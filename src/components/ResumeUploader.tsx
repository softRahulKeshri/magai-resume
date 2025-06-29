import React, { useState, useCallback } from "react";
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
  Card,
  CardContent,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Description,
  CheckCircle,
  Error as ErrorIcon,
  Delete,
  FileUpload,
  InsertDriveFile,
  Info,
} from "@mui/icons-material";

// Internal imports
import { UploadResult, UploadProgress } from "../types";
import { UPLOAD_CONFIG, BRAND_COLORS, API_CONFIG } from "../theme/constants";

// API function to upload resumes to the backend
const uploadResumesToServer = async (
  formData: FormData,
  onProgress?: (progress: number, loaded: number, total: number) => void
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Configure upload progress tracking
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete, e.loaded, e.total);
      }
    });

    // Handle successful completion
    xhr.addEventListener("load", () => {
      console.log("Response status:", xhr.status);
      console.log("Response URL:", xhr.responseURL);
      console.log("Response data:", xhr.responseText);

      if (xhr.status === 200) {
        // If API responds with status 200, treat as success regardless of response format
        let result: any = {};

        try {
          // Try to parse JSON response
          result = JSON.parse(xhr.responseText || "{}");
          console.log("Parsed response:", result);
        } catch (parseError) {
          console.warn(
            "Response is not valid JSON, but treating as success since status is 200"
          );
          // Even if parsing fails, we'll create a default success response
          // Use the actual count of files being uploaded
          const actualFileCount = formData.getAll("cv").length;
          result = {
            message: "Files uploaded successfully",
            successful: actualFileCount,
          };
        }

        // Transform the response to match our UploadResult interface
        // Be more lenient with the response format - any data means success
        // Use the actual count of files being uploaded from FormData
        const actualFileCount = formData.getAll("cv").length;
        const uploadResult: UploadResult = {
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
            "Files uploaded successfully! PDF processing completed.",
          results: result.files || result.data || [],
          errors: result.errors || [],
        };

        console.log("Upload successful! Result:", uploadResult);
        resolve(uploadResult);
      } else {
        const errorMessage =
          xhr.responseText || `Upload failed: ${xhr.status} ${xhr.statusText}`;
        console.error("Upload failed:", {
          status: xhr.status,
          statusText: xhr.statusText,
          url: xhr.responseURL,
          body: xhr.responseText,
        });
        reject(new Error(errorMessage));
      }
    });

    // Handle network errors
    xhr.addEventListener("error", () => {
      console.error("Network error during upload");
      reject(
        new Error(
          "Network error: Unable to connect to server. Please check if the backend is running."
        )
      );
    });

    // Handle timeout
    xhr.addEventListener("timeout", () => {
      console.error("Upload timeout");
      reject(
        new Error("Upload timeout: The request took too long to complete.")
      );
    });

    // Configure and send the request
    xhr.open("POST", `${API_CONFIG.baseURL}/upload_cv`);

    // Set headers
    xhr.setRequestHeader("Accept", "application/json");

    // Set timeout (30 seconds)
    xhr.timeout = 30000;

    console.log("Making POST request to:", `${API_CONFIG.baseURL}/upload_cv`);
    console.log(
      "FormData contents:",
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        value instanceof File ? `File: ${value.name}` : value,
      ])
    );

    xhr.send(formData);
  });
};

// Props interface
interface ResumeUploaderProps {
  onUploadStart: () => void;
  onUploadSuccess: (result: UploadResult) => void;
  onUploadError: (error: string) => void;
}

interface FileWithProgress {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
  file: File; // Keep reference to original file for upload
}

const ResumeUploader = ({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}: ResumeUploaderProps) => {
  // State management
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    filesProcessed: 0,
    totalFiles: 0,
    currentFile: "",
    percentage: 0,
  });
  const [uploadResults, setUploadResults] = useState<UploadResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // File validation - PDF only, 10MB max
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    if (file.type !== "application/pdf") {
      return `File "${file.name}" has an unsupported format. Please use PDF files only.`;
    }

    return null;
  }, []);

  // File drop handler
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      const newErrors: string[] = [];

      // Handle rejected files
      rejectedFiles.forEach((rejectedFile) => {
        newErrors.push(
          `File "${rejectedFile.file.name}" was rejected: ${rejectedFile.errors[0]?.message}`
        );
      });

      // Validate accepted files
      const validFiles: FileWithProgress[] = [];
      acceptedFiles.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          newErrors.push(validationError);
        } else {
          // Create a proper FileWithProgress object with explicit properties
          const fileWithProgress: FileWithProgress = {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            progress: 0,
            status: "uploading",
            file: file, // Keep reference to original file
          };
          validFiles.push(fileWithProgress);
        }
      });

      // Check total file limit
      if (files.length + validFiles.length > UPLOAD_CONFIG.maxFiles) {
        newErrors.push(
          `Cannot add more files. Maximum ${UPLOAD_CONFIG.maxFiles} files allowed.`
        );
        return;
      }

      setErrors(newErrors);
      setFiles((prev) => [...prev, ...validFiles]);
    },
    [files.length, validateFile]
  );

  // Dropzone configuration - PDF only to match UI
  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: UPLOAD_CONFIG.maxFiles,
      disabled: isUploading,
      noClick: true, // Disable click on the dropzone itself
    });

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  // Clear all files
  const clearAllFiles = useCallback(() => {
    if (!isUploading) {
      setFiles([]);
      setUploadResults(null);
      setErrors([]);
    }
  }, [isUploading]);

  // Upload files to the backend API
  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setErrors([]);
    setUploadResults(null); // Reset upload results on new upload
    onUploadStart();

    try {
      const formData = new FormData();
      files.forEach((fileWithProgress) => {
        formData.append("cv", fileWithProgress.file); // Backend expects 'cv' field
      });

      setUploadProgress({
        filesProcessed: 0,
        totalFiles: files.length,
        currentFile: files[0]?.name || "",
        percentage: 0,
      });

      // Update progress during upload
      const progressCallback = (
        progress: number,
        loaded: number,
        total: number
      ) => {
        setUploadProgress((prev) => ({
          ...prev,
          percentage: progress,
          currentFile: `Uploading ${files.length} file${
            files.length > 1 ? "s" : ""
          }...`,
        }));
      };

      const result = await uploadResumesToServer(formData, progressCallback);

      // Final progress update
      setUploadProgress((prev) => ({
        ...prev,
        percentage: 100,
        filesProcessed: files.length,
        currentFile: "Upload completed!",
      }));

      setUploadResults(result);
      onUploadSuccess(result);

      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploadProgress({
          filesProcessed: 0,
          totalFiles: 0,
          currentFile: "",
          percentage: 0,
        });
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || "Upload failed";
      setErrors([errorMessage]);
      onUploadError(errorMessage);

      // Reset progress on error
      setUploadProgress({
        filesProcessed: 0,
        totalFiles: 0,
        currentFile: "",
        percentage: 0,
      });
    } finally {
      setIsUploading(false);
    }
  }, [files, onUploadStart, onUploadSuccess, onUploadError]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 800, width: "100%" }}>
        {/* Upload Area */}
        <Box
          {...getRootProps()}
          sx={{
            p: 6,
            textAlign: "center",
            cursor: `${isUploading ? "not-allowed" : "pointer"} !important`,
            border: 3,
            borderStyle: "dashed",
            borderColor: BRAND_COLORS.primary.blue,
            backgroundColor: "rgba(37, 99, 235, 0.02)",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            opacity: isUploading ? 0.6 : 1,
            "&:hover": {
              borderColor: BRAND_COLORS.primary.blueLight,
              backgroundColor: "rgba(37, 99, 235, 0.05)",
              cursor: `${isUploading ? "not-allowed" : "pointer"} !important`,
            },
          }}
        >
          <input {...getInputProps()} />

          {/* Document Icon */}
          <InsertDriveFile
            sx={{
              fontSize: "5rem",
              color: BRAND_COLORS.neutral.whiteAlpha[50],
              mb: 3,
            }}
          />

          <Typography
            variant="h4"
            gutterBottom
            fontWeight={600}
            sx={{
              color: "text.primary",
              mb: 1,
            }}
          >
            Drag & Drop CVs Here
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, fontSize: "1.1rem" }}
          >
            or click to browse files
          </Typography>

          {/* Browse Files Button */}
          <Button
            variant="contained"
            size="large"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            disabled={isUploading}
            startIcon={
              isUploading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <InsertDriveFile />
              )
            }
            sx={{
              backgroundColor: BRAND_COLORS.primary.blue,
              color: "white",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              cursor: "pointer !important",
              "&:hover": {
                backgroundColor: BRAND_COLORS.primary.blueDark,
                cursor: "pointer !important",
              },
              "&:disabled": {
                backgroundColor: BRAND_COLORS.neutral.whiteAlpha[30],
                cursor: "not-allowed !important",
              },
            }}
          >
            {isUploading ? "Processing..." : "Browse Files"}
          </Button>
        </Box>

        {/* Info Section */}
        <Alert
          severity="info"
          icon={<Info />}
          sx={{
            mt: 2,
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            border: `1px solid ${BRAND_COLORS.primary.blue}`,
            "& .MuiAlert-icon": {
              color: BRAND_COLORS.primary.blue,
            },
            "& .MuiAlert-message": {
              color: "text.primary",
              fontWeight: 500,
            },
          }}
        >
          Supported format: PDF only • Maximum size: 10MB per file
        </Alert>

        {/* Error Messages */}
        {errors.length > 0 && (
          <Box mt={2}>
            {errors.map((error, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            ))}
          </Box>
        )}

        {/* File List */}
        {files.length > 0 && (
          <Card
            sx={{
              mt: 2,
              backgroundColor: "background.paper",
              border: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[10]}`,
            }}
          >
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  Selected Files ({files.length})
                </Typography>
                <Button
                  onClick={clearAllFiles}
                  disabled={isUploading}
                  size="small"
                  startIcon={<Delete />}
                  sx={{
                    color: "text.secondary",
                    cursor: "pointer !important",
                    "&:hover": {
                      color: BRAND_COLORS.accent.redLight,
                      backgroundColor: "rgba(248, 113, 113, 0.1)",
                      cursor: "pointer !important",
                    },
                    "&:disabled": {
                      cursor: "not-allowed !important",
                    },
                  }}
                >
                  Clear All
                </Button>
              </Box>

              <List sx={{ py: 0 }}>
                {files.map((file) => (
                  <ListItem
                    key={file.id}
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: BRAND_COLORS.neutral.whiteAlpha[5],
                      color: "text.primary",
                      borderRadius: 1,
                      mb: 1,
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <ListItemIcon>
                      <Description
                        sx={{ color: BRAND_COLORS.primary.blueLight }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ color: "text.primary", fontWeight: 500 }}
                        >
                          {file.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                        >
                          {file.size > 0
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                            : "0.00 MB"}
                        </Typography>
                      }
                    />
                    <IconButton
                      onClick={() => removeFile(file.id)}
                      disabled={isUploading}
                      size="small"
                      sx={{
                        color: "text.secondary",
                        cursor: "pointer !important",
                        "&:hover": {
                          color: BRAND_COLORS.accent.redLight,
                          backgroundColor: "rgba(248, 113, 113, 0.1)",
                          cursor: "pointer !important",
                        },
                        "&:disabled": {
                          cursor: "not-allowed !important",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Progress
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {uploadProgress.currentFile}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {uploadProgress.percentage < 100
                    ? `Processing ${uploadProgress.totalFiles} file${
                        uploadProgress.totalFiles > 1 ? "s" : ""
                      }...`
                    : "Upload completed!"}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={uploadProgress.percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: BRAND_COLORS.neutral.whiteAlpha[10],
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: BRAND_COLORS.primary.blue,
                  },
                }}
              />
              <Typography
                variant="body2"
                align="center"
                mt={1}
                sx={{
                  fontWeight: 600,
                  color:
                    uploadProgress.percentage === 100
                      ? BRAND_COLORS.primary.blue
                      : "text.secondary",
                }}
              >
                {uploadProgress.percentage}%
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Upload Results */}
        {uploadResults && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Results
              </Typography>
              <Stack direction="row" spacing={2} mb={2}>
                <Chip
                  icon={<CheckCircle />}
                  label={`Successful: ${uploadResults.successful}`}
                  color="success"
                />
                {uploadResults.failed > 0 && (
                  <Chip
                    icon={<ErrorIcon />}
                    label={`Failed: ${uploadResults.failed}`}
                    color="error"
                  />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {uploadResults.successful} CV
                {uploadResults.successful > 1 ? "s" : ""} uploaded successfully!
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Upload Button */}
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            size="large"
            onClick={uploadFiles}
            disabled={files.length === 0 || isUploading}
            startIcon={
              isUploading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FileUpload />
              )
            }
            sx={{
              backgroundColor: BRAND_COLORS.primary.blue,
              color: "white",
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              minWidth: 250,
              cursor: "pointer !important",
              "&:hover": {
                backgroundColor: BRAND_COLORS.primary.blueDark,
                cursor: "pointer !important",
              },
              "&:disabled": {
                backgroundColor: BRAND_COLORS.neutral.whiteAlpha[30],
                cursor: "not-allowed !important",
              },
            }}
          >
            {isUploading
              ? "Uploading CVs..."
              : `Upload CVs${files.length > 0 ? ` (${files.length})` : ""}`}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResumeUploader;
