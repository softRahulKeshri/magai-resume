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
const SIDEBAR_WIDTH = 280;

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
                  onView={(resume: Resume) =>
                    console.log("View resume:", resume)
                  }
                  onDownload={(resume: Resume) =>
                    console.log("Download resume:", resume)
                  }
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
        width: SIDEBAR_WIDTH,
        height: "100%",
        background: "#1a1a1a",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
      elevation={0}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box
            component="img"
            src={magureAiLogo}
            alt="ResumeAI Logo"
            sx={{
              height: "32px",
              width: "auto",
              filter: "brightness(1.1)",
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
            ResumeAI
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{ opacity: 0.7, color: "rgba(255, 255, 255, 0.7)" }}
        >
          AI-Powered Talent Discovery Platform
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2 }}>
        {tabConfig.map((tab, index) => (
          <ListItem key={index} disablePadding sx={{ px: 2, mb: 1 }}>
            <ListItemButton
              onClick={() => handleTabChange(index)}
              sx={{
                borderRadius: 0,
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                backgroundColor:
                  activeTab === index
                    ? "rgba(24, 119, 242, 0.15)"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    activeTab === index
                      ? "rgba(24, 119, 242, 0.2)"
                      : "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    activeTab === index
                      ? "primary.main"
                      : "rgba(255, 255, 255, 0.7)",
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
                      ? "primary.main"
                      : "rgba(255, 255, 255, 0.9)",
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.5)",
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
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{ opacity: 0.5, color: "rgba(255, 255, 255, 0.5)" }}
        >
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
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#0a0a0a" }}>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
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
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            height: "100%",
            p: 0,
            "&.MuiContainer-root": {
              paddingLeft: 0,
              paddingRight: 0,
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
