import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { Upload, Search, Analytics } from "@mui/icons-material";

// Import the ResumeAI logo
import magureAiLogo from "./images/magure_ai_logo.svg";

// Internal imports
import ResumeUploader from "./components/ResumeUploader";
import ResumeSearch from "./components/ResumeSearch";
import ResumeCollection from "./components/ResumeCollection";
import { Resume, UploadResult } from "./types";
import { apiService } from "./services/api";
import { API_CONFIG } from "./theme/constants";

// Color palette
const brand_gradient = {
  orange: "#FDA052",
  purple: "#B96AF7",
  blue: "#3077F3",
  cyan: "#41E6F8",
};

const primary = {
  charcoal_slate: "#2E3141",
};

const neutral_palette = {
  n_black: "#050507",
  n3000: "#171921",
  n2000: "#20222E",
  n1000: "#2E3141",
  n900: "#434654",
  n800: "#585A67",
  n700: "#6D6F7A",
  n600: "#82838D",
  n500: "#9698A0",
  n400: "#ABADB3",
  n300: "#C0C1C6",
  n200: "#D5D6D9",
  n150: "#EAEAEC",
  n100: "#F5F5F5",
  n_white: "#FFFFFF",
};

const primary_ui_blue = {
  p700: "#11397E",
  p600: "#1E50A8",
  p500: "#3077F3",
  p400: "#94BAFD",
  p300: "#BFD6FF",
  p200: "#E3EDFF",
  p100: "#EFF5FF",
};

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = ({ children, value, index }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`vertical-tabpanel-${index}`}
    aria-labelledby={`vertical-tab-${index}`}
    style={{ width: "100%" }}
  >
    {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
  </div>
);

// Sidebar width constant
const SIDEBAR_WIDTH = 320;

// Main App Component
const App = () => {
  // State management
  const [activeTab, setActiveTab] = useState(0);

  // Simple state for resumes data
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add state for delete feedback
  const [deleteAlert, setDeleteAlert] = useState<{
    show: boolean;
    message: string;
    severity: "success" | "error";
  }>({ show: false, message: "", severity: "success" });

  // Hooks (removed unused theme)

  // Simple function to fetch resumes
  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedResumes = await apiService.getResumes();
      setResumes(fetchedResumes);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch resumes";
      setError(errorMessage);
      console.error("❌ Failed to fetch resumes:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch resumes on component mount
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // Tab change handler
  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  // Upload handlers
  const handleUploadStart = useCallback(() => {
    // Upload started - no additional state needed for now
  }, []);

  const handleUploadSuccess = useCallback(
    (result: UploadResult) => {
      // Refresh the resumes from API after successful upload
      fetchResumes();
      console.log(
        `Upload completed: ${result.successful} successful, ${result.failed} failed`
      );
    },
    [fetchResumes]
  );

  const handleUploadError = useCallback((error: string) => {
    console.error("Upload error:", error);
  }, []);

  // Search handlers - interface to match ResumeSearch component
  interface CandidateResult {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    currentRole?: string;
    experience?: string;
    education?: string;
    skills?: string[];
    matchScore?: number;
    filename?: string;
  }

  const handleSearchResults = useCallback((results: CandidateResult[]) => {
    // Search results handled in ResumeSearch component
    console.log("Search results:", results.length);
  }, []);

  // Simple delete handler
  const handleDeleteResume = useCallback(
    async (resume: Resume) => {
      try {
        console.log("🗑️ Attempting to delete resume:", resume.filename);

        const result = await apiService.deleteResume(resume.id);

        if (result.success) {
          setDeleteAlert({
            show: true,
            message: `Successfully deleted "${resume.filename}"`,
            severity: "success",
          });
          console.log("✅ Resume deleted successfully");
          // Refresh the list after successful deletion
          await fetchResumes();
        } else {
          setDeleteAlert({
            show: true,
            message: result.message || `Failed to delete "${resume.filename}"`,
            severity: "error",
          });
          console.error("❌ Delete failed:", result.message);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setDeleteAlert({
          show: true,
          message: `Error deleting "${resume.filename}": ${errorMessage}`,
          severity: "error",
        });
        console.error("❌ Delete error:", error);
      }

      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setDeleteAlert({ show: false, message: "", severity: "success" });
      }, 5000);
    },
    [fetchResumes]
  );

  // Performance optimization - memoize tab configuration
  const tabConfig = useMemo(
    () => [
      {
        label: "Upload Resume",
        icon: <Upload />,
        description: "Seamlessly import resumes with AI parsing",
        component: (
          <ResumeUploader
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        ),
      },
      {
        label: "Search Resumes",
        icon: <Search />,
        description: "Find perfect candidates with AI-powered search",
        component: <ResumeSearch onSearchResults={handleSearchResults} />,
      },
      {
        label: "Resume Store",
        icon: <Analytics />,
        description: "Analyze talent pool with intelligent insights",
        component: (
          <Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load resumes: {error}
                <Button onClick={fetchResumes} size="small" sx={{ ml: 1 }}>
                  Retry
                </Button>
              </Alert>
            )}
            {loading ? (
              // Simple loading state for the entire Resume Store
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "60vh",
                  flexDirection: "column",
                }}
              >
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography
                  variant="h6"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Loading Resume Data...
                </Typography>
                <Typography variant="body2" sx={{ color: "text.disabled" }}>
                  Fetching resumes from API
                </Typography>
              </Box>
            ) : (
              <>
                {/* Delete Feedback Alert */}
                {deleteAlert.show && (
                  <Alert
                    severity={deleteAlert.severity}
                    onClose={() =>
                      setDeleteAlert({
                        show: false,
                        message: "",
                        severity: "success",
                      })
                    }
                    sx={{ mb: 2 }}
                  >
                    {deleteAlert.message}
                  </Alert>
                )}

                {/* Resume Collection */}
                <ResumeCollection
                  resumes={resumes}
                  isLoading={loading}
                  onView={(resume: Resume) => {
                    try {
                      // Use original filename for API calls
                      const originalFilename =
                        resume.stored_filename || resume.filename;

                      if (!originalFilename) {
                        console.error("No filename available for viewing");
                        return;
                      }

                      const viewUrl = `${API_CONFIG.baseURL}/uploads/${originalFilename}`;
                      window.open(viewUrl, "_blank");
                    } catch (error) {
                      console.error("Error viewing CV:", error);
                      alert("Failed to open CV viewer. Please try again.");
                    }
                  }}
                  onDownload={async (resume: Resume) => {
                    try {
                      // Use original filename for API calls
                      const originalFilename =
                        resume.stored_filename || resume.filename;

                      if (!originalFilename) {
                        throw new Error("Filename not available for download");
                      }

                      // Fetch the file for download
                      const response = await fetch(
                        `${API_CONFIG.baseURL}/uploads/${originalFilename}`,
                        {
                          method: "GET",
                          headers: {
                            Accept:
                              "application/pdf,application/octet-stream,*/*",
                          },
                        }
                      );

                      if (response.ok) {
                        // Get the file as a blob
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);

                        // Create a temporary link element and trigger download
                        const link = document.createElement("a");
                        link.href = url;
                        // Use original filename for download
                        link.download = originalFilename;
                        // Ensure the link is not visible
                        link.style.display = "none";
                        document.body.appendChild(link);
                        link.click();

                        // Clean up
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } else {
                        // Log detailed error information
                        const errorText = await response
                          .text()
                          .catch(() => "Unknown error");
                        console.error("Download failed:", {
                          status: response.status,
                          statusText: response.statusText,
                          url: response.url,
                          errorBody: errorText,
                        });
                        throw new Error(
                          `Download failed: ${response.status} ${response.statusText}`
                        );
                      }
                    } catch (error) {
                      console.error("Error downloading CV:", error);
                      // Enhanced error message with debugging info
                      const errorMessage =
                        error instanceof Error
                          ? error.message
                          : "Unknown error occurred";
                      alert(
                        `Failed to download CV: ${errorMessage}\n\nPlease check the browser console for more details.`
                      );
                    }
                  }}
                  onResumeDeleted={async (resumeId: number) => {
                    console.log("🔄 Resume deleted, refreshing data...");
                    await fetchResumes();
                  }}
                />
              </>
            )}
          </Box>
        ),
      },
    ],
    [
      handleUploadStart,
      handleUploadSuccess,
      handleUploadError,
      handleSearchResults,
      handleDeleteResume,
      resumes,
      loading,
      error,
      fetchResumes,
      deleteAlert.show,
      deleteAlert.message,
      deleteAlert.severity,
    ]
  );

  // Sidebar component
  const Sidebar = () => (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        background: neutral_palette.n_white,
        borderRadius: "16px",
        border: `1px solid ${neutral_palette.n150}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 8px 24px rgba(36, 39, 45, 0.08),
                    0 16px 32px rgba(228, 223, 232, 0.9),
                    0 2px 8px rgba(65, 230, 248, 0.06)`,
      }}
      elevation={0}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${neutral_palette.n150}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box
            component="img"
            src={magureAiLogo}
            alt="ResumeAI Logo"
            sx={{
              height: "32px",
              width: "auto",
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: primary.charcoal_slate }}
          >
            ResumeAI
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: neutral_palette.n700 }}>
          AI-Powered Talent Discovery Platform
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2, px: 1 }}>
        {tabConfig.map((tab, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleTabChange(index)}
              sx={{
                borderRadius: "12px",
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                backgroundColor:
                  activeTab === index ? primary_ui_blue.p100 : "transparent",
                "&:hover": {
                  backgroundColor:
                    activeTab === index
                      ? primary_ui_blue.p200
                      : neutral_palette.n100,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    activeTab === index
                      ? primary_ui_blue.p500
                      : neutral_palette.n700,
                  minWidth: 40,
                }}
              >
                {tab.icon}
              </ListItemIcon>
              <ListItemText
                primary={tab.label}
                secondary={tab.description}
                primaryTypographyProps={{
                  fontWeight: activeTab === index ? 600 : 400,
                  fontSize: "0.95rem",
                  color:
                    activeTab === index
                      ? primary_ui_blue.p500
                      : primary.charcoal_slate,
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem",
                  color: neutral_palette.n700,
                  lineHeight: 1.2,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${neutral_palette.n150}`,
          textAlign: "center",
          background: neutral_palette.n100,
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <Typography variant="caption" sx={{ color: neutral_palette.n700 }}>
          Powered by Magure.AI
        </Typography>
      </Box>
    </Paper>
  );

  // Mobile drawer for smaller screens
  const MobileDrawer = () => (
    <Drawer
      variant="temporary"
      open={false}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      <Sidebar />
    </Drawer>
  );

  return (
    <Box
      sx={{ display: "flex", height: "100vh", bgcolor: neutral_palette.n100 }}
    >
      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          p: 3,
          bgcolor: neutral_palette.n100,
          // borderRight: `1px solid ${neutral_palette.n150}`,
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
        }}
      >
        <Sidebar />
      </Box>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          background: neutral_palette.n_white,
          borderLeft: `1px solid ${neutral_palette.n150}`,
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.02)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "8px",
            height: "100%",
            background: `linear-gradient(90deg, ${neutral_palette.n100}, transparent)`,
            opacity: 0.5,
            pointerEvents: "none",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            height: "100%",
            p: 3,
            "&.MuiContainer-root": {
              paddingLeft: 3,
              paddingRight: 3,
            },
          }}
        >
          {tabConfig.map((tab, index) => (
            <CustomTabPanel key={index} value={activeTab} index={index}>
              {tab.component}
            </CustomTabPanel>
          ))}
        </Container>
      </Box>
    </Box>
  );
};

export default App;
