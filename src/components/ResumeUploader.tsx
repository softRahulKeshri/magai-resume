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
  Upload,
} from "@mui/icons-material";

// Internal imports
import { UploadResult, UploadProgress, Group, Resume } from "../types";
import { UPLOAD_CONFIG, BRAND_COLORS, API_CONFIG } from "../theme/constants";
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
  stored_filename?: string; // Add stored filename for API calls
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
          // If deleteGroup returns false, it means the operation failed for a non-linked CVs reason
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
          errorMessage.includes("associated data") ||
          errorMessage.includes("Group has associated CVs");

        if (isLinkedCVsError) {
          // Hide delete confirmation modal and show informative modal
          setDeleteGroupDialog({ open: false, group: null });
          setCannotDeleteDialog({ open: true, group });
          // Don't show snackbar for linked CVs error - the modal is sufficient
        } else {
          setSnackbarMessage("Failed to delete group. Please try again.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } finally {
        setDeletingGroup(false);
      }
    },
    [deleteGroup, selectedGroup, clearError]
  );

  const openDeleteDialog = useCallback((group: Group) => {
    setDeleteGroupDialog({ open: true, group });
  }, []);

  const closeDeleteDialog = useCallback(() => {
    if (!deletingGroup) {
      setDeleteGroupDialog({ open: false, group: null });
    }
  }, [deletingGroup]);

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

      // Update files with stored filenames from the response
      const updatedFiles = files.map((file) => {
        const resultFile = result.results.find(
          (r: { original_filename: string; stored_filename: string }) =>
            r.original_filename === file.name
        );
        return {
          ...file,
          status: "complete" as const,
          stored_filename: resultFile?.stored_filename,
        };
      });

      setFiles(updatedFiles);

      // Final progress update
      setUploadProgress((prev) => ({
        ...prev,
        percentage: 100,
        filesProcessed: files.length,
        currentFile: "Upload completed!",
      }));

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
          "linear-gradient(135deg,rgba(255, 255, 255, 0.67) 0%,rgba(245, 245, 245, 0.75) 100%)",
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
                filter: "drop-shadow(0 4px 12px rgba(48, 119, 243, 0.2))",
              }}
            />
            <Box
              sx={{
                height: 40,
                width: "2px",
                background: "linear-gradient(45deg, #3077F3, #41E6F8)",
                borderRadius: "1px",
                opacity: 0.8,
              }}
            />
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#2E3141",
                  lineHeight: 1.1,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  letterSpacing: "-0.02em",
                }}
              >
                Upload Center
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#6D6F7A",
                  fontWeight: 400,
                  mt: 0.5,
                  fontSize: "1.1rem",
                  letterSpacing: "0.01em",
                }}
              >
                AI-Powered Talent Discovery Platform
              </Typography>
            </Box>
          </Box>

          {/* Decorative Elements */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px",
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
            backgroundColor: "#FFFFFF",
            border: "1px solid #E3EDFF",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(48, 119, 243, 0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {groupsLoading ? (
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} sx={{ color: "#3077F3" }} />
                <Typography color="#6D6F7A">Loading groups...</Typography>
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
                    color: "#2E3141",
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
                    color: "#6D6F7A",
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
                      borderRadius: 4,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#E3EDFF",
                        },
                        "&:hover fieldset": {
                          borderColor: "#BFD6FF",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3077F3",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6D6F7A",
                      },
                      "& .MuiSelect-select": {
                        color: "#2E3141",
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
                        <Typography sx={{ color: "#2E3141" }}>
                          {selectedGroup
                            ? capitalizeGroupName(selectedGroup.name)
                            : ""}
                        </Typography>
                      )}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: "600px",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E3EDFF",
                            borderRadius: 4,
                            mt: 1,
                            boxShadow: "0 4px 20px rgba(48, 119, 243, 0.1)",
                            "& .MuiList-root": {
                              padding: "8px",
                              position: "relative",
                              "& > .MuiDivider-root": {
                                position: "sticky",
                                bottom: "56px",
                                backgroundColor: "#E3EDFF",
                                margin: "0 8px",
                              },
                              "& > .MuiMenuItem-root:last-child": {
                                position: "sticky",
                                bottom: 0,
                                backgroundColor: "#FFFFFF",
                                marginTop: 1,
                                zIndex: 1,
                                borderTop: "1px solid #E3EDFF",
                              },
                            },
                            "& .MuiMenuItem-root": {
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              color: "#2E3141",
                              px: 3,
                              py: 2,
                              mx: 1,
                              my: 0.5,
                              borderRadius: 1,
                              "&:hover": {
                                backgroundColor: "#EFF5FF",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "#E3EDFF",
                                "&:hover": {
                                  backgroundColor: "#BFD6FF",
                                },
                              },
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
                            color: "#2E3141",
                            px: 3,
                            py: 2,
                            mx: 1,
                            my: 0.5,
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "#EFF5FF",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#E3EDFF",
                              "&:hover": {
                                backgroundColor: "#BFD6FF",
                              },
                            },
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              sx={{
                                color: "#2E3141",
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
                                  color: "#6D6F7A",
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
                              color: "#82838D",
                              "&:hover": {
                                color: "#ef4444",
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                              },
                              "&:disabled": {
                                color: "#D5D6D9",
                              },
                            }}
                          >
                            {deletingGroup ? (
                              <CircularProgress
                                size={16}
                                sx={{
                                  color: "#82838D",
                                }}
                              />
                            ) : (
                              <Delete fontSize="small" />
                            )}
                          </IconButton>
                        </MenuItem>
                      ))}
                      <Divider />
                      <MenuItem
                        onClick={() => setOpenAddGroupDialog(true)}
                        sx={{
                          color: "#3077F3",
                          fontWeight: 600,
                          px: 3,
                          py: 2,
                          mx: 1,
                          my: 0.5,
                          borderRadius: "8px",
                          transition: "all 0.2s ease",

                          gap: 1.5,
                          "&:hover": {
                            backgroundColor: "#EFF5FF",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "#3077F3",
                            fontSize: "0.95rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Add
                            sx={{
                              fontSize: "1.5rem",
                              color: "#3077F3",
                            }}
                          />{" "}
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
                  backgroundColor: "#EFF5FF",
                  border: "1px solid #3077F3",
                  borderRadius: 4,
                  alignItems: "center",
                  "& .MuiAlert-icon": {
                    color: "#3077F3",
                  },
                  "& .MuiAlert-message": {
                    color: "#2E3141",
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
                  <Typography component="span" sx={{ color: "#2E3141" }}>
                    Perfect! Your CVs will be organized and uploaded to
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: "#E3EDFF",
                      borderRadius: 1,
                      border: "1px solid #BFD6FF",
                    }}
                  >
                    <FolderOpen
                      sx={{
                        fontSize: "1.1rem",
                        color: "#3077F3",
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 700,
                        color: "#3077F3",
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
                      color: "#6D6F7A",
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
              backgroundColor: "#FFF7ED",
              border: "1px solid #FDA052",
              borderRadius: 4,
              "& .MuiAlert-icon": {
                color: "#FDA052",
              },
              "& .MuiAlert-message": {
                color: "#2E3141",
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
              ? "#D5D6D9"
              : uploadStatus === "success"
              ? "#16a34a"
              : uploadStatus === "error"
              ? "#ef4444"
              : "#3077F3",
            backgroundColor: !selectedGroup
              ? "#F5F5F5"
              : uploadStatus === "success"
              ? "#dcfce7"
              : uploadStatus === "error"
              ? "#FEF2F2"
              : "#EFF5FF",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            opacity: !selectedGroup ? 0.7 : isUploading ? 0.8 : 1,
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: !selectedGroup
                ? "#D5D6D9"
                : uploadStatus === "success"
                ? "#15803d"
                : uploadStatus === "error"
                ? "#dc2626"
                : "#1E50A8",
              backgroundColor: !selectedGroup
                ? "#F5F5F5"
                : uploadStatus === "success"
                ? "#bbf7d0"
                : uploadStatus === "error"
                ? "#FEE2E2"
                : "#E3EDFF",
              transform: selectedGroup ? "translateY(-2px)" : "none",
              boxShadow: selectedGroup
                ? "0 8px 32px rgba(48, 119, 243, 0.1)"
                : "none",
            },
          }}
        >
          <input {...getInputProps()} />

          {/* Status Icon */}
          {uploadStatus === "success" ? (
            <CloudDone
              sx={{
                fontSize: "4rem",
                color: "#15803d",
                mb: 2,
                filter: "drop-shadow(0 4px 12px rgba(34, 197, 94, 0.3))",
              }}
            />
          ) : uploadStatus === "error" ? (
            <ErrorOutline
              sx={{
                fontSize: "4rem",
                color: "#ef4444",
                mb: 2,
                filter: "drop-shadow(0 4px 12px rgba(239, 68, 68, 0.2))",
              }}
            />
          ) : (
            <InsertDriveFile
              sx={{
                fontSize: "4rem",
                color: !selectedGroup ? "#82838D" : "#3077F3",
                mb: 2,
                filter: selectedGroup
                  ? "drop-shadow(0 4px 12px rgba(48, 119, 243, 0.2))"
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
                ? "#82838D"
                : uploadStatus === "success"
                ? "#15803d"
                : uploadStatus === "error"
                ? "#ef4444"
                : "#2E3141",
              mb: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
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
              color: "#6D6F7A",
              fontSize: "1rem",
            }}
          >
            {uploadStatus === "success" ? (
              "Your files have been successfully uploaded!"
            ) : uploadStatus === "error" ? (
              "Please try again or check your files"
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Upload sx={{ fontSize: "1rem", color: "#6D6F7A" }} />
                Click to upload
              </Box>
            )}
          </Typography>
        </Box>

        {/* File Format Info */}
        {selectedGroup && (
          <Alert
            severity="info"
            icon={<Info sx={{ fontSize: "24px" }} />}
            sx={{
              mt: 2,
              backgroundColor: "#ffffff",

              borderRadius: "12px",
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              "& .MuiAlert-icon": {
                color: "#3077F3",
                opacity: 1,
                padding: 0,
                mr: 0,
              },
              "& .MuiAlert-message": {
                padding: 0,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: "#2E3141",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  Supported formats:
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label="PDF"
                    size="small"
                    sx={{
                      backgroundColor: "#E3EDFF",
                      color: "#3077F3",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      height: "24px",
                      borderRadius: "6px",
                    }}
                  />
                  <Chip
                    label="DOCX"
                    size="small"
                    sx={{
                      backgroundColor: "#E3EDFF",
                      color: "#3077F3",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      height: "24px",
                      borderRadius: "6px",
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  width: "2px",
                  height: "24px",
                  backgroundColor: "#BFD6FF",
                  mx: 1,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  component="span"
                  sx={{
                    color: "#2E3141",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  Maximum size:
                </Typography>
                <Chip
                  label="10MB per file"
                  size="small"
                  sx={{
                    backgroundColor: "#E3EDFF",
                    color: "#3077F3",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    height: "24px",
                    borderRadius: "6px",
                  }}
                />
              </Box>
            </Box>
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

        {/* File List */}
        {files.length > 0 && (
          <Card
            sx={{
              mt: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E3EDFF",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(48, 119, 243, 0.1)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 3,
                  py: 2,
                  borderBottom: "1px solid #E3EDFF",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#2E3141",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  Selected Files ({files.length})
                  {isUploading && (
                    <CircularProgress
                      size={16}
                      sx={{ ml: 1, color: "#3077F3" }}
                    />
                  )}
                </Typography>
                <Button
                  size="small"
                  onClick={() => setFiles([])}
                  startIcon={<Delete />}
                  sx={{
                    color: "#6D6F7A",
                    "&:hover": {
                      color: "#ef4444",
                      backgroundColor: "#FEE2E2",
                    },
                  }}
                >
                  Clear All
                </Button>
              </Box>

              <List
                sx={{
                  py: 2,
                  px: 2,
                  maxHeight: "400px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#F5F5F5",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#3077F3",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#1E50A8",
                    },
                  },
                  scrollbarWidth: "thin",
                  scrollbarColor: "#3077F3 #F5F5F5",
                }}
              >
                {files.map((file, index) => (
                  <ListItem
                    key={file.id}
                    sx={{
                      py: 2,
                      px: 3,
                      marginBottom: 2,
                      borderBottom:
                        index < files.length - 1 ? "1px solid #E3EDFF" : "none",
                      backgroundColor:
                        file.status === "complete"
                          ? "#F0FDF4"
                          : file.status === "error"
                          ? "#FEF2F2"
                          : "transparent",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getStatusIcon(file.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: "#2E3141",
                              fontSize: "0.95rem",
                            }}
                          >
                            {file.name}
                          </Typography>
                          {file.status === "complete" &&
                            file.stored_filename && (
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  href={`${API_CONFIG.baseURL}/uploads/${file.stored_filename}`}
                                  target="_blank"
                                  sx={{
                                    minWidth: "auto",
                                    px: 1,
                                    py: 0.5,
                                    borderColor: "#3077F3",
                                    color: "#3077F3",
                                    "&:hover": {
                                      borderColor: "#1E50A8",
                                      backgroundColor: "#EFF5FF",
                                    },
                                  }}
                                >
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  href={`${API_CONFIG.baseURL}/uploads/${file.stored_filename}`}
                                  download
                                  sx={{
                                    minWidth: "auto",
                                    px: 1,
                                    py: 0.5,
                                    borderColor: "#3077F3",
                                    color: "#3077F3",
                                    "&:hover": {
                                      borderColor: "#1E50A8",
                                      backgroundColor: "#EFF5FF",
                                    },
                                  }}
                                >
                                  Download
                                </Button>
                              </Box>
                            )}
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6D6F7A",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                          {file.status === "uploading" && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                ml: 1,
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={file.progress}
                                sx={{
                                  width: 60,
                                  height: 4,
                                  borderRadius: 2,
                                  backgroundColor: "#E3EDFF",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#3077F3",
                                  },
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: "#3077F3" }}
                              >
                                {file.progress}%
                              </Typography>
                            </Box>
                          )}
                        </Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={() =>
                        setFiles((prev) => prev.filter((f) => f.id !== file.id))
                      }
                      sx={{
                        color: "#6D6F7A",
                        "&:hover": {
                          color: "#ef4444",
                          backgroundColor: "#FEE2E2",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <Card
            sx={{
              mt: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E3EDFF",
              borderRadius: 1.25,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(48, 119, 243, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#2E3141",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  Upload Progress
                  <CircularProgress size={16} sx={{ color: "#3077F3" }} />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6D6F7A", fontWeight: 500 }}
                >
                  Processing {uploadProgress.filesProcessed} of{" "}
                  {uploadProgress.totalFiles} files...
                </Typography>
              </Box>

              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#E3EDFF",
                    mb: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#3077F3",
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "#3077F3",
                    fontWeight: 600,
                    display: "block",
                    textAlign: "right",
                  }}
                >
                  {uploadProgress.percentage}%
                </Typography>
              </Box>
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
              backgroundColor: uploadResults.failed > 0 ? "#FEF2F2" : "#F0FDF4",
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
                  color: uploadResults.failed > 0 ? "#dc2626" : "#16a34a",
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

        {/* Upload Button - Always visible */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            borderRadius: 4,
            justifyContent: "center",
            gap: 2,
            position: "sticky",
            bottom: 0,
            backgroundColor: "white",
            py: 2,
            zIndex: 2,
            boxShadow: "0 -4px 12px rgba(53, 133, 245, 0.09)",
          }}
        >
          <Button
            onClick={uploadFiles}
            variant="contained"
            disabled={!selectedGroup || isUploading || files.length === 0}
            startIcon={
              isUploading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CloudDone />
              )
            }
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: "#3077F3",
              "&:hover": {
                backgroundColor: "#1E50A8",
              },
              "&.Mui-disabled": {
                backgroundColor: "#D1D5DB",
                color: "#6B7280",
              },
            }}
          >
            {isUploading ? "Uploading..." : "Upload CVs"}
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
              backgroundColor: "#FFFFFF",
              boxShadow: "0 8px 32px rgba(48, 119, 243, 0.1)",
              border: "1px solid #E3EDFF",
              borderRadius: "12px",
              p: 1,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              color: "#2E3141",
              p: 3,
              pb: 2,
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 24,
                backgroundColor: "#3077F3",
                borderRadius: "2px",
              }}
            />
            Add New Group
          </DialogTitle>
          <DialogContent sx={{ overflow: "visible", p: 3, pt: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#6D6F7A",
                mb: 2,
                fontSize: "0.9rem",
              }}
            >
              Create a new group to organize your CVs
            </Typography>
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
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#E3EDFF",
                    borderWidth: "1.5px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#BFD6FF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3077F3",
                    borderWidth: "1.5px",
                  },
                  "& input": {
                    padding: "14px 16px",
                    fontSize: "1rem",
                    color: "#2E3141",
                    "&::placeholder": {
                      color: "#82838D",
                      opacity: 1,
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#6D6F7A",
                  fontSize: "0.95rem",
                  "&.Mui-focused": {
                    color: "#3077F3",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#2E3141",
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={() => setOpenAddGroupDialog(false)}
              variant="outlined"
              disabled={addingGroup}
              sx={{
                color: "#6D6F7A",
                borderColor: "#E3EDFF",
                backgroundColor: "#FFFFFF",
                px: 3,
                py: 1,
                fontSize: "0.95rem",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: "18px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#BFD6FF",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#E3EDFF",
                  color: "#82838D",
                },
              }}
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
                backgroundColor: "#3077F3",
                color: "white",
                px: 3,
                py: 1,
                fontSize: "0.95rem",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: "18px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#1E50A8",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  backgroundColor: "#F5F5F5",
                  color: "#82838D",
                },
                minWidth: "80px",
                boxShadow: "none",
              }}
            >
              {addingGroup ? "Adding..." : "Add Group"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Group Confirmation Dialog */}
        <Dialog
          open={deleteGroupDialog.open}
          onClose={closeDeleteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: "#FFFFFF",
              boxShadow: "0 8px 32px rgba(48, 119, 243, 0.1)",
              border: "1px solid #E3EDFF",
              borderRadius: 4,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: "#ef4444" }}>
            Delete Group
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "#2E3141" }}>
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
              sx={{
                color: "#6D6F7A",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (deleteGroupDialog.group) {
                  handleDeleteGroup(deleteGroupDialog.group);
                }
              }}
              variant="contained"
              color="error"
              disabled={deletingGroup}
              startIcon={
                deletingGroup ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{
                backgroundColor: "#ef4444",
                "&:hover": { backgroundColor: "#dc2626" },
                "&:disabled": {
                  backgroundColor: "#F5F5F5",
                  color: "#82838D",
                },
                minWidth: "100px",
                color: "white",
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
              borderRadius: 4,
              border: "2px solid #3077F3",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 8px 32px rgba(48, 119, 243, 0.1)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              color: "#3077F3",
              display: "flex",
              alignItems: "center",
              gap: 2,
              pb: 2,
            }}
          >
            <Warning sx={{ fontSize: "2rem", color: "#3077F3" }} />
            Cannot Delete Group
          </DialogTitle>
          <DialogContent sx={{ pb: 2 }}>
            <Stack spacing={2}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "#2E3141" }}
              >
                The group "
                <strong>
                  {capitalizeGroupName(cannotDeleteDialog.group?.name || "")}
                </strong>
                " cannot be deleted because it contains CVs.
              </Typography>

              <Alert
                severity="info"
                sx={{
                  backgroundColor: "#EFF5FF",
                  border: "1px solid #3077F3",
                  "& .MuiAlert-icon": {
                    color: "#3077F3",
                  },
                  "& .MuiAlert-message": {
                    color: "#2E3141",
                  },
                }}
              >
                <Typography variant="body2" sx={{ color: "#2E3141" }}>
                  <strong>To delete this group:</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "#2E3141" }}>
                  1. Navigate to the Resume Collection section
                  <br />
                  2. Filter by this group name
                  <br />
                  3. Remove or move all CVs to another group
                  <br />
                  4. Return here to delete the empty group
                </Typography>
              </Alert>

              <Typography variant="body2" sx={{ color: "#6D6F7A" }}>
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
                backgroundColor: "#3077F3",
                "&:hover": { backgroundColor: "#1E50A8" },
                minWidth: "100px",
                fontWeight: 600,
                color: "white",
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
            sx={{
              backgroundColor:
                snackbarSeverity === "success" ? "#F0FDF4" : "#FEF2F2",
              border: `1px solid ${
                snackbarSeverity === "success" ? "#22c55e" : "#ef4444"
              }`,
              "& .MuiAlert-icon": {
                color: snackbarSeverity === "success" ? "#22c55e" : "#ef4444",
              },
              "& .MuiAlert-message": {
                color: "#2E3141",
              },
              "& .MuiAlert-action": {
                color: "#6D6F7A",
              },
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ResumeUploader;
