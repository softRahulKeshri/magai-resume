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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  SelectChangeEvent,
  Divider,
} from "@mui/material";
import {
  Description,
  CheckCircle,
  Delete,
  FileUpload,
  InsertDriveFile,
  Info,
  Cancel,
  CloudDone,
  ErrorOutline,
  Add,
  Warning,
  FolderOpen,
} from "@mui/icons-material";

// Internal imports
import { UploadResult, UploadProgress, Group } from "../types";
import { UPLOAD_CONFIG, BRAND_COLORS } from "../theme/constants";
import { useGroups } from "../hooks/useGroups";
import { apiService } from "../services/api";

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
  status: "ready" | "uploading" | "processing" | "complete" | "error";
  error?: string;
  file: File; // Keep reference to original file for upload
}

const ResumeUploader = ({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}: ResumeUploaderProps) => {
  // Helper function to capitalize group names consistently
  const capitalizeGroupName = useCallback((name: string) => {
    if (!name) return name;

    // Handle common acronyms and technical terms
    const acronyms = [
      "AI",
      "ML",
      "UI",
      "UX",
      "API",
      "SDK",
      "AWS",
      "GCP",
      "HR",
      "IT",
      "QA",
      "DevOps",
      "iOS",
      "Android",
    ];

    // Split by common separators and process each part
    return name
      .split(/([\/\-\s_|,&]+)/) // Split by separators but keep them
      .map((part, index) => {
        if (index % 2 === 1) {
          // This is a separator, add spaces around it for better readability
          return part.includes("/") ? " / " : part;
        }

        // Check if the part is a known acronym
        const upperPart = part.toUpperCase();
        if (acronyms.includes(upperPart)) {
          return upperPart;
        }

        // Handle normal words - capitalize first letter
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join("")
      .trim();
  }, []);
  // File management state
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
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Group management with hooks
  const {
    groups,
    loading: groupsLoading,
    error: groupsError,
    createGroup,
    deleteGroup,
    refreshGroups,
    clearError,
  } = useGroups();

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [openAddGroupDialog, setOpenAddGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [deleteGroupDialog, setDeleteGroupDialog] = useState<{
    open: boolean;
    group: Group | null;
  }>({ open: false, group: null });
  const [cannotDeleteDialog, setCannotDeleteDialog] = useState<{
    open: boolean;
    group: Group | null;
  }>({ open: false, group: null });
  const [addingGroup, setAddingGroup] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // File validation - PDF and DOCX only, 10MB max
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return `File "${file.name}" has an unsupported format. Please use PDF or DOCX files only.`;
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
          // Create a proper FileWithProgress object with "ready" status
          const fileWithProgress: FileWithProgress = {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            progress: 0,
            status: "ready", // Files start in "ready" state, not "uploading"
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

      // Reset upload status and results when new files are added
      if (uploadStatus !== "idle") {
        setUploadStatus("idle");
        setUploadResults(null);
      }
    },
    [files.length, validateFile, uploadStatus]
  );

  // Dropzone configuration - PDF and DOCX only to match UI
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: UPLOAD_CONFIG.maxFiles,
    disabled: isUploading || !selectedGroup, // Disabled until group is selected
    noClick: true, // Disable click on the dropzone itself
  });

  // Remove file
  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const newFiles = prev.filter((file) => file.id !== fileId);

        // Reset upload status and results if no files left
        if (newFiles.length === 0 && uploadStatus !== "idle") {
          setUploadStatus("idle");
          setUploadResults(null);
          setErrors([]);
        }

        return newFiles;
      });
    },
    [uploadStatus]
  );

  // Clear all files
  const clearAllFiles = useCallback(() => {
    if (!isUploading) {
      setFiles([]);
      setUploadResults(null);
      setErrors([]);
      setUploadStatus("idle");
    }
  }, [isUploading]);

  // Group management handlers
  const handleGroupChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const groupId = event.target.value;
      const group = groups.find((g) => g.id.toString() === groupId) || null;
      setSelectedGroup(group);

      // Reset upload status and results when group changes
      if (uploadStatus !== "idle") {
        setUploadStatus("idle");
        setUploadResults(null);
        setErrors([]);
      }
    },
    [groups, uploadStatus]
  );

  const handleAddGroup = useCallback(async () => {
    if (newGroupName.trim() === "") {
      setSnackbarMessage("Group name is required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setAddingGroup(true);
    try {
      const newGroup = await createGroup({
        name: newGroupName.trim(),
      });

      setSelectedGroup(newGroup);
      setNewGroupName("");
      setOpenAddGroupDialog(false);
      setSnackbarMessage("Group created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to create group");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setAddingGroup(false);
    }
  }, [newGroupName, createGroup]);

  const handleDeleteGroup = useCallback(
    async (group: Group) => {
      setDeletingGroup(true);
      // Clear any existing groups error before attempting delete
      clearError();

      try {
        const success = await deleteGroup(group.id);
        if (success) {
          // If the deleted group was selected, clear selection
          if (selectedGroup?.id === group.id) {
            setSelectedGroup(null);
          }
          setDeleteGroupDialog({ open: false, group: null });
          setSnackbarMessage("Group deleted successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Failed to delete group");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        // Clear the groups error state to prevent it from showing in the alert
        clearError();

        // Check if the error is specifically about CVs being linked to the group
        const errorMessage = error?.message || error?.toString() || "";
        const isLinkedCVsError =
          errorMessage.includes("Cannot delete group with CVs linked to it") ||
          errorMessage.includes("CVs linked") ||
          errorMessage.includes("associated data");

        if (isLinkedCVsError) {
          // Hide delete confirmation modal and show informative modal
          setDeleteGroupDialog({ open: false, group: null });
          setCannotDeleteDialog({ open: true, group });
        } else {
          setSnackbarMessage("Failed to delete group. Please try again.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } finally {
        setDeletingGroup(false);
      }
    },
    [deleteGroup, selectedGroup, capitalizeGroupName, clearError]
  );

  const openDeleteDialog = useCallback((group: Group) => {
    setDeleteGroupDialog({ open: true, group });
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteGroupDialog({ open: false, group: null });
  }, []);

  const closeCannotDeleteDialog = useCallback(() => {
    setCannotDeleteDialog({ open: false, group: null });
  }, []);

  // Upload files to the backend API with group association
  const uploadFiles = useCallback(async () => {
    if (files.length === 0 || !selectedGroup) return;

    setIsUploading(true);
    setErrors([]);
    setUploadResults(null);
    setUploadStatus("idle");
    onUploadStart();

    // Update all files to uploading status ONLY when upload actually starts
    setFiles((prev) =>
      prev.map((file) => ({ ...file, status: "uploading" as const }))
    );

    try {
      const formData = new FormData();
      files.forEach((fileWithProgress) => {
        formData.append("cv", fileWithProgress.file);
      });

      // Add group name to the form data
      formData.append("group", selectedGroup.name);

      setUploadProgress({
        filesProcessed: 0,
        totalFiles: files.length,
        currentFile: files[0]?.name || "",
        percentage: 0,
      });

      // Use the new uploadCVsToGroup method
      const result = await apiService.uploadCVsToGroup(formData);

      // Final progress update
      setUploadProgress((prev) => ({
        ...prev,
        percentage: 100,
        filesProcessed: files.length,
        currentFile: "Upload completed!",
      }));

      // Update files to complete status
      setFiles((prev) =>
        prev.map((file) => ({ ...file, status: "complete" as const }))
      );
      setUploadResults(result);
      setUploadStatus("success");
      onUploadSuccess(result);

      // Clear files and upload results after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploadProgress({
          filesProcessed: 0,
          totalFiles: 0,
          currentFile: "",
          percentage: 0,
        });
        setUploadStatus("idle");
        setUploadResults(null); // Clear the upload results to hide success UI
      }, 5000); // Extended to 5 seconds for better UX
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || "Upload failed";
      setErrors([errorMessage]);
      setUploadStatus("error");

      // Update files to error status
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "error" as const,
          error: errorMessage,
        }))
      );

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
  }, [files, selectedGroup, onUploadStart, onUploadSuccess, onUploadError]);

  // Helper function to get status icon
  const getStatusIcon = (status: FileWithProgress["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle sx={{ color: "#22c55e" }} />;
      case "error":
        return <Cancel sx={{ color: "#ef4444" }} />;
      case "processing":
        return (
          <CircularProgress
            size={20}
            sx={{ color: BRAND_COLORS.primary.blue }}
          />
        );
      case "uploading":
        return (
          <CircularProgress
            size={20}
            sx={{ color: BRAND_COLORS.primary.blue }}
          />
        );
      case "ready":
      default:
        return <Description sx={{ color: BRAND_COLORS.primary.blueLight }} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: files.length > 8 ? "flex-start" : "center",
        justifyContent: "center",
        px: 3,
        py: files.length > 8 ? 2 : 4,
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
      }}
    >
      <Box sx={{ maxWidth: 800, width: "100%" }}>
        {/* Elegant Header Section with SVG Logo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mb: 5,
            pb: 4,
            position: "relative",
          }}
        >
          {/* Logo and Brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              mb: 3,
            }}
          >
            <Box
              component="img"
              src="/magure_ai_logo.svg"
              alt="Magure AI Logo"
              sx={{
                height: 56,
                width: "auto",
                filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))",
              }}
            />
            <Box
              sx={{
                height: 40,
                width: "2px",
                background: "linear-gradient(45deg, #3077F3, #41E6F8)",
                borderRadius: "1px",
                opacity: 0.6,
              }}
            />
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.1,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  background: "linear-gradient(45deg, #ffffff, #f8fafc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                CV Upload Center
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 400,
                  mt: 0.5,
                  fontSize: "1.1rem",
                  letterSpacing: "0.01em",
                }}
              >
                AI-Powered Talent Discovery Plateform
              </Typography>
            </Box>
          </Box>

          {/* Decorative Elements */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "3px",
              background:
                "linear-gradient(90deg, #3077F3, #41E6F8, #B96AF7, #FDA052)",
              borderRadius: "2px",
              opacity: 0.8,
            }}
          />
        </Box>

        {/* Group Selection Section */}
        <Card
          sx={{
            mb: 3,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 1.25,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {groupsLoading ? (
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} />
                <Typography color="text.secondary">
                  Loading groups...
                </Typography>
              </Box>
            ) : groupsError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {groupsError}
                <Button size="small" onClick={refreshGroups} sx={{ ml: 1 }}>
                  Retry
                </Button>
              </Alert>
            ) : (
              <>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      background: "linear-gradient(45deg, #3077F3, #41E6F8)",
                      borderRadius: "2px",
                    }}
                  />
                  Select Group
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    mb: 3,
                    fontSize: "0.9rem",
                  }}
                >
                  Select your target group for CV uploads
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl
                    sx={{
                      minWidth: 200,
                      flexGrow: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.2)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3077F3",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      "& .MuiSelect-select": {
                        color: "white",
                      },
                    }}
                  >
                    <InputLabel id="group-select-label">
                      Select Group
                    </InputLabel>
                    <Select
                      labelId="group-select-label"
                      id="group-select"
                      value={selectedGroup?.id.toString() || ""}
                      label="Select Group"
                      onChange={handleGroupChange}
                      renderValue={() => (
                        <Typography sx={{ color: "white" }}>
                          {selectedGroup
                            ? capitalizeGroupName(selectedGroup.name)
                            : ""}
                        </Typography>
                      )}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: 1,
                            mt: 1,
                            "& .MuiList-root": {
                              padding: "8px",
                            },
                          },
                        },
                      }}
                    >
                      {groups.map((group) => (
                        <MenuItem
                          key={group.id}
                          value={group.id.toString()}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "white",
                            px: 3,
                            py: 2,
                            mx: 1,
                            my: 0.5,
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.08)",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "rgba(48, 119, 243, 0.15)",
                              "&:hover": {
                                backgroundColor: "rgba(48, 119, 243, 0.2)",
                              },
                            },
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              sx={{
                                color: "white",
                                fontWeight: 500,
                                mb: group.description ? 0.5 : 0,
                              }}
                            >
                              {capitalizeGroupName(group.name)}
                            </Typography>
                            {group.description && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.6)",
                                  fontSize: "0.75rem",
                                  lineHeight: 1.2,
                                }}
                              >
                                {group.description}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(group);
                            }}
                            disabled={deletingGroup}
                            sx={{
                              ml: 2,
                              color: "rgba(255, 255, 255, 0.5)",
                              "&:hover": {
                                color: BRAND_COLORS.accent.red,
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                              },
                              "&:disabled": {
                                color: BRAND_COLORS.neutral.whiteAlpha[30],
                              },
                            }}
                          >
                            {deletingGroup ? (
                              <CircularProgress
                                size={16}
                                sx={{
                                  color: BRAND_COLORS.neutral.whiteAlpha[50],
                                }}
                              />
                            ) : (
                              <Delete fontSize="small" />
                            )}
                          </IconButton>
                        </MenuItem>
                      ))}
                      <Divider
                        sx={{
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          mx: 1,
                          my: 1,
                        }}
                      />
                      <MenuItem
                        onClick={() => setOpenAddGroupDialog(true)}
                        sx={{
                          color: "#3077F3",
                          fontWeight: 600,
                          px: 3,
                          py: 2,
                          mx: 1,
                          my: 0.5,
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: "rgba(48, 119, 243, 0.1)",
                          },
                        }}
                      >
                        <Add sx={{ mr: 2 }} />
                        <Typography sx={{ fontWeight: 600 }}>
                          Create New Group
                        </Typography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </>
            )}

            {selectedGroup && (
              <Alert
                severity="success"
                sx={{
                  mt: 3,
                  backgroundColor: "#22c55e",
                  border: "1px solid #16a34a",
                  borderRadius: 1.25,
                  alignItems: "center",
                  "& .MuiAlert-icon": {
                    color: "white",
                  },
                  "& .MuiAlert-message": {
                    color: "white",
                    fontWeight: 500,
                    width: "100%",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography component="span" sx={{ color: "white" }}>
                    Perfect! Your CVs will be organized and uploaded to
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: 1,
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <FolderOpen
                      sx={{
                        fontSize: "1.1rem",
                        color: "white",
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        fontSize: "0.95rem",
                      }}
                    >
                      {capitalizeGroupName(selectedGroup.name)}
                    </Typography>
                  </Box>
                </Box>
                {selectedGroup.description && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      mt: 1,
                      display: "block",
                      fontStyle: "italic",
                    }}
                  >
                    {selectedGroup.description}
                  </Typography>
                )}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Warning Message - Repositioned */}
        {!selectedGroup && (
          <Alert
            severity="warning"
            icon={<Warning />}
            sx={{
              mb: 3,
              backgroundColor: "rgba(255, 193, 7, 0.1)",
              border: "1px solid rgba(255, 193, 7, 0.3)",
              borderRadius: 1.25,
              "& .MuiAlert-icon": {
                color: "#ffc107",
              },
              "& .MuiAlert-message": {
                color: "white",
                fontWeight: 500,
              },
            }}
          >
            Please select a group to organize and upload your CVs
          </Alert>
        )}

        {/* Upload Area */}
        <Box
          {...getRootProps()}
          sx={{
            p: 6,
            textAlign: "center",
            cursor: `${
              isUploading || !selectedGroup ? "not-allowed" : "pointer"
            } !important`,
            border: 3,
            borderStyle: "dashed",
            borderColor: !selectedGroup
              ? "rgba(255, 255, 255, 0.2)"
              : uploadStatus === "success"
              ? "#22c55e"
              : uploadStatus === "error"
              ? "#ef4444"
              : "#3077F3",
            backgroundColor: !selectedGroup
              ? "rgba(255, 255, 255, 0.01)"
              : uploadStatus === "success"
              ? "rgba(34, 197, 94, 0.05)"
              : uploadStatus === "error"
              ? "rgba(239, 68, 68, 0.05)"
              : "rgba(48, 119, 243, 0.05)",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 1.25,
            opacity: !selectedGroup ? 0.5 : isUploading ? 0.7 : 1,
            transition: "all 0.3s ease",
            backdropFilter: "blur(5px)",
            "&:hover": {
              borderColor: !selectedGroup
                ? "rgba(255, 255, 255, 0.2)"
                : uploadStatus === "success"
                ? "#16a34a"
                : uploadStatus === "error"
                ? "#dc2626"
                : "#41E6F8",
              backgroundColor: !selectedGroup
                ? "rgba(255, 255, 255, 0.01)"
                : uploadStatus === "success"
                ? "rgba(34, 197, 94, 0.08)"
                : uploadStatus === "error"
                ? "rgba(239, 68, 68, 0.08)"
                : "rgba(48, 119, 243, 0.08)",
              transform: selectedGroup ? "translateY(-2px)" : "none",
              boxShadow: selectedGroup
                ? "0 8px 32px rgba(0, 0, 0, 0.2)"
                : "none",
            },
          }}
        >
          <input {...getInputProps()} />

          {/* Status Icon */}
          {uploadStatus === "success" ? (
            <CloudDone
              sx={{
                fontSize: "5rem",
                color: "#22c55e",
                mb: 3,
                filter: "drop-shadow(0 4px 12px rgba(34, 197, 94, 0.3))",
              }}
            />
          ) : uploadStatus === "error" ? (
            <ErrorOutline
              sx={{
                fontSize: "5rem",
                color: "#ef4444",
                mb: 3,
                filter: "drop-shadow(0 4px 12px rgba(239, 68, 68, 0.3))",
              }}
            />
          ) : (
            <InsertDriveFile
              sx={{
                fontSize: "5rem",
                color: !selectedGroup
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(255, 255, 255, 0.6)",
                mb: 3,
                filter: selectedGroup
                  ? "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))"
                  : "none",
              }}
            />
          )}

          <Typography
            variant="h4"
            gutterBottom
            fontWeight={600}
            sx={{
              color: !selectedGroup
                ? "rgba(255, 255, 255, 0.5)"
                : uploadStatus === "success"
                ? "#22c55e"
                : uploadStatus === "error"
                ? "#ef4444"
                : "white",
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            {uploadStatus === "success"
              ? "Upload Successful!"
              : uploadStatus === "error"
              ? "Upload Failed!"
              : "Drag & Drop CVs Here"}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              fontSize: "1.1rem",
              color: !selectedGroup
                ? "rgba(255, 255, 255, 0.5)"
                : uploadStatus === "success"
                ? "rgba(34, 197, 94, 0.8)"
                : uploadStatus === "error"
                ? "rgba(239, 68, 68, 0.8)"
                : "rgba(255, 255, 255, 0.7)",
              fontWeight: 400,
            }}
          >
            {uploadStatus === "success"
              ? "Your CVs have been processed successfully"
              : uploadStatus === "error"
              ? "Please try again or check your files"
              : "or click to browse files"}
          </Typography>

          {/* Browse Files Button - Disabled when no group selected */}
          {uploadStatus !== "success" && (
            <Button
              variant="contained"
              size="large"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedGroup) {
                  open();
                }
              }}
              disabled={isUploading || !selectedGroup}
              startIcon={<InsertDriveFile />}
              sx={{
                background: !selectedGroup
                  ? "rgba(255, 255, 255, 0.1)"
                  : uploadStatus === "error"
                  ? "linear-gradient(45deg, #ef4444, #dc2626)"
                  : "linear-gradient(45deg, #3077F3, #41E6F8)",
                color: "white",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1,
                cursor: !selectedGroup
                  ? "not-allowed !important"
                  : "pointer !important",
                boxShadow: selectedGroup
                  ? "0 4px 16px rgba(48, 119, 243, 0.3)"
                  : "none",
                "&:hover": {
                  background: !selectedGroup
                    ? "rgba(255, 255, 255, 0.1)"
                    : uploadStatus === "error"
                    ? "linear-gradient(45deg, #dc2626, #b91c1c)"
                    : "linear-gradient(45deg, #2563eb, #3b82f6)",
                  transform: selectedGroup ? "translateY(-1px)" : "none",
                  boxShadow: selectedGroup
                    ? "0 6px 20px rgba(48, 119, 243, 0.4)"
                    : "none",
                  cursor: !selectedGroup
                    ? "not-allowed !important"
                    : "pointer !important",
                },
                "&:disabled": {
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.5)",
                  cursor: "not-allowed !important",
                },
              }}
            >
              Browse Files
            </Button>
          )}
        </Box>

        {/* File Format Info */}
        {selectedGroup && (
          <Alert
            severity="info"
            icon={<Info />}
            sx={{
              mt: 2,
              backgroundColor: "rgba(48, 119, 243, 0.1)",
              border: "1px solid rgba(48, 119, 243, 0.3)",
              borderRadius: 1.25,
              "& .MuiAlert-icon": {
                color: "#3077F3",
              },
              "& .MuiAlert-message": {
                color: "white",
                fontWeight: 500,
              },
            }}
          >
            Supported formats: PDF and DOCX • Maximum size: 10MB per file
          </Alert>
        )}

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

        {/* File List with Status Icons */}
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

              <List
                sx={{
                  py: 0,
                  maxHeight: files.length > 8 ? "min(400px, 40vh)" : "auto",
                  overflowY: files.length > 8 ? "auto" : "visible",
                  // Custom scrollbar styling for better UX
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: BRAND_COLORS.neutral.whiteAlpha[10],
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: BRAND_COLORS.primary.blue,
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: BRAND_COLORS.primary.blueDark,
                    },
                  },
                  // Firefox scrollbar styling
                  scrollbarWidth: "thin",
                  scrollbarColor: `${BRAND_COLORS.primary.blue} ${BRAND_COLORS.neutral.whiteAlpha[10]}`,
                }}
              >
                {files.map((file) => (
                  <ListItem
                    key={file.id}
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor:
                        file.status === "complete"
                          ? "rgba(34, 197, 94, 0.05)"
                          : file.status === "error"
                          ? "rgba(239, 68, 68, 0.05)"
                          : BRAND_COLORS.neutral.whiteAlpha[5],
                      color: "text.primary",
                      borderRadius: 1,
                      mb: 1,
                      border:
                        file.status === "complete"
                          ? "1px solid rgba(34, 197, 94, 0.2)"
                          : file.status === "error"
                          ? "1px solid rgba(239, 68, 68, 0.2)"
                          : "none",
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <ListItemIcon>{getStatusIcon(file.status)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color:
                              file.status === "complete"
                                ? "#22c55e"
                                : file.status === "error"
                                ? "#ef4444"
                                : "text.primary",
                            fontWeight: 500,
                          }}
                        >
                          {file.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.875rem",
                            }}
                          >
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </Typography>
                          {file.status === "ready" && (
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              Ready to upload
                            </Typography>
                          )}
                          {file.status === "complete" && (
                            <Typography
                              sx={{
                                color: "#22c55e",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              Successfully uploaded
                            </Typography>
                          )}
                          {file.status === "error" && file.error && (
                            <Typography
                              sx={{
                                color: "#ef4444",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              {file.error}
                            </Typography>
                          )}
                          {file.status === "processing" && (
                            <Typography
                              sx={{
                                color: BRAND_COLORS.primary.blue,
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              Processing...
                            </Typography>
                          )}
                          {file.status === "uploading" && (
                            <Typography
                              sx={{
                                color: BRAND_COLORS.primary.blue,
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              Uploading...
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    {file.status !== "uploading" &&
                      file.status !== "processing" && (
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
                      )}
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

        {/* Enhanced Upload Results */}
        {uploadResults && (
          <Card
            sx={{
              mt: 2,
              border:
                uploadResults.failed > 0
                  ? "2px solid #ef4444"
                  : "2px solid #22c55e",
              backgroundColor:
                uploadResults.failed > 0
                  ? "rgba(239, 68, 68, 0.02)"
                  : "rgba(34, 197, 94, 0.02)",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                {uploadResults.failed > 0 ? (
                  <Cancel sx={{ color: "#ef4444", fontSize: "2rem", mr: 2 }} />
                ) : (
                  <CheckCircle
                    sx={{ color: "#22c55e", fontSize: "2rem", mr: 2 }}
                  />
                )}
                <Typography
                  variant="h6"
                  sx={{
                    color: uploadResults.failed > 0 ? "#ef4444" : "#22c55e",
                    fontWeight: 600,
                  }}
                >
                  {uploadResults.failed > 0
                    ? "Upload Completed with Errors"
                    : "Upload Successful!"}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} mb={2}>
                <Chip
                  icon={<CheckCircle />}
                  label={`Successful: ${uploadResults.successful}`}
                  sx={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    fontWeight: 600,
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
                {uploadResults.failed > 0 && (
                  <Chip
                    icon={<Cancel />}
                    label={`Failed: ${uploadResults.failed}`}
                    sx={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                )}
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: uploadResults.failed > 0 ? "#ef4444" : "#22c55e",
                  fontWeight: 500,
                }}
              >
                {uploadResults.failed > 0
                  ? `${uploadResults.successful} CV${
                      uploadResults.successful !== 1 ? "s" : ""
                    } uploaded successfully to ${capitalizeGroupName(
                      selectedGroup?.name || ""
                    )}, ${uploadResults.failed} failed.`
                  : `${uploadResults.successful} CV${
                      uploadResults.successful !== 1 ? "s" : ""
                    } uploaded successfully to ${capitalizeGroupName(
                      selectedGroup?.name || ""
                    )}!`}
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
            disabled={
              files.length === 0 ||
              isUploading ||
              !selectedGroup ||
              uploadStatus === "success" ||
              uploadStatus === "error"
            }
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
            {isUploading ? "Uploading CVs..." : "Upload CVs"}
          </Button>
        </Box>

        {/* Add Group Modal */}
        <Dialog
          open={openAddGroupDialog}
          onClose={() => setOpenAddGroupDialog(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              overflow: "visible",
              width: "400px",
              maxWidth: "400px",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Add New Group</DialogTitle>
          <DialogContent sx={{ overflow: "visible" }}>
            <TextField
              autoFocus
              margin="dense"
              id="group-name"
              label="Group Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              disabled={addingGroup}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setOpenAddGroupDialog(false)}
              color="inherit"
              disabled={addingGroup}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGroup}
              variant="contained"
              disabled={!newGroupName.trim() || addingGroup}
              startIcon={
                addingGroup ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{
                backgroundColor: BRAND_COLORS.primary.blue,
                "&:hover": { backgroundColor: BRAND_COLORS.primary.blueDark },
                minWidth: "80px",
              }}
            >
              {addingGroup ? "Adding..." : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Group Confirmation Dialog */}
        <Dialog
          open={deleteGroupDialog.open}
          onClose={deletingGroup ? undefined : closeDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600, color: BRAND_COLORS.accent.red }}>
            Delete Group
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the group "
              <strong>{deleteGroupDialog.group?.name}</strong>"? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={closeDeleteDialog}
              color="inherit"
              disabled={deletingGroup}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                deleteGroupDialog.group &&
                handleDeleteGroup(deleteGroupDialog.group)
              }
              variant="contained"
              color="error"
              disabled={deletingGroup}
              startIcon={
                deletingGroup ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{
                backgroundColor: BRAND_COLORS.accent.red,
                "&:hover": { backgroundColor: BRAND_COLORS.accent.redDark },
                "&:disabled": {
                  backgroundColor: BRAND_COLORS.neutral.whiteAlpha[30],
                },
                minWidth: "100px",
              }}
            >
              {deletingGroup ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Cannot Delete Group Informational Dialog */}
        <Dialog
          open={cannotDeleteDialog.open}
          onClose={closeCannotDeleteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: `2px solid ${BRAND_COLORS.primary.blue}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              color: BRAND_COLORS.primary.blue,
              display: "flex",
              alignItems: "center",
              gap: 2,
              pb: 2,
            }}
          >
            <Warning
              sx={{ fontSize: "2rem", color: BRAND_COLORS.primary.blue }}
            />
            Cannot Delete Group
          </DialogTitle>
          <DialogContent sx={{ pb: 2 }}>
            <Stack spacing={2}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                The group "
                <strong>
                  {capitalizeGroupName(cannotDeleteDialog.group?.name || "")}
                </strong>
                " cannot be deleted because it contains CVs.
              </Typography>

              <Alert
                severity="info"
                sx={{
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  border: `1px solid ${BRAND_COLORS.primary.blue}`,
                  "& .MuiAlert-icon": {
                    color: BRAND_COLORS.primary.blue,
                  },
                }}
              >
                <Typography variant="body2">
                  <strong>To delete this group:</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  1. Navigate to the Resume Collection section
                  <br />
                  2. Filter by this group name
                  <br />
                  3. Remove or move all CVs to another group
                  <br />
                  4. Return here to delete the empty group
                </Typography>
              </Alert>

              <Typography variant="body2" color="text.secondary">
                This prevents accidental data loss and ensures your CVs are
                safely managed.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={closeCannotDeleteDialog}
              variant="contained"
              sx={{
                backgroundColor: BRAND_COLORS.primary.blue,
                "&:hover": { backgroundColor: BRAND_COLORS.primary.blueDark },
                minWidth: "100px",
                fontWeight: 600,
              }}
            >
              Got It
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ResumeUploader;
