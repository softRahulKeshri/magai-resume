/**
 * MAGURE.AI Resume Platform - Main Application Component
 *
 * Premium AI-powered resume management platform with modern design
 * and optimized performance for professional demonstrations.
 *
 * Features:
 * - Responsive design with mobile-first approach
 * - Advanced particle system with magnetic effects
 * - Glass morphism UI with brand consistency
 * - Smooth animations and transitions
 * - Accessibility compliance
 * - Performance optimization
 *
 * @author MAGURE.AI Team
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Fade,
  Grow,
  Slide,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Upload,
  Search,
  Assessment,
  AutoAwesome,
  Insights,
  Star,
} from "@mui/icons-material";

// Internal imports
import ResumeUploader from "./components/ResumeUploader";
import ResumeSearch from "./components/ResumeSearch";
import CursorTrail from "./components/CursorTrail";
import { Resume, UploadResult } from "./types";
import { BRAND_COLORS, Z_INDEX } from "./theme/constants";
import { animations } from "./theme/animations";
import { useParticles } from "./hooks/useParticles";
import {
  CenteredContainer,
  GlassCard,
  GradientText,
  AnimatedText,
  ParticleContainer,
  FloatingParticle,
  FlexContainer,
  Badge,
  Divider,
} from "./components/common/StyledComponents";

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
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
  >
    {value === index && (
      <Fade in={value === index} timeout={600}>
        <Box sx={{ p: 3 }}>{children}</Box>
      </Fade>
    )}
  </div>
);

// Main App Component
const App = () => {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchResults, setSearchResults] = useState<Resume[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
  });

  // Hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { particles, mousePosition } = useParticles({
    isActive: true,
    particleCount: isMobile ? 15 : 25,
  });

  // Tab change handler
  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
    },
    []
  );

  // Upload handlers
  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
  }, []);

  const handleUploadSuccess = useCallback((result: UploadResult) => {
    setIsUploading(false);
    setResumes((prev) => [...prev, ...result.results]);
    setUploadStats({
      total: result.successful + result.failed,
      successful: result.successful,
      failed: result.failed,
    });
  }, []);

  const handleUploadError = useCallback((error: string) => {
    setIsUploading(false);
    console.error("Upload error:", error);
  }, []);

  // Search handlers
  const handleSearchResults = useCallback((results: Resume[]) => {
    setSearchResults(results);
  }, []);

  // Performance optimization - memoize tab configuration
  const tabConfig = useMemo(
    () => [
      {
        label: "Upload Resumes",
        icon: <Upload />,
        component: (
          <ResumeUploader
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        ),
      },
      {
        label: "Search & Analyze",
        icon: <Search />,
        component: (
          <ResumeSearch
            onSearchResults={handleSearchResults}
            resumes={resumes}
          />
        ),
      },
    ],
    [
      handleUploadStart,
      handleUploadSuccess,
      handleUploadError,
      handleSearchResults,
      resumes,
    ]
  );

  // Performance optimization - memoize stats
  const statsDisplay = useMemo(
    () => (
      <FlexContainer gap={2} wrap>
        <Badge variant="info">
          <Star sx={{ mr: 1, fontSize: "1rem" }} />
          Total: {uploadStats.total}
        </Badge>
        <Badge variant="success">
          <Assessment sx={{ mr: 1, fontSize: "1rem" }} />
          Successful: {uploadStats.successful}
        </Badge>
        {uploadStats.failed > 0 && (
          <Badge variant="error">Failed: {uploadStats.failed}</Badge>
        )}
      </FlexContainer>
    ),
    [uploadStats]
  );

  return (
    <>
      {/* Cursor Trail Effect */}
      <CursorTrail />

      {/* Particle System */}
      <ParticleContainer>
        {particles.map((particle) => (
          <FloatingParticle
            key={particle.id}
            size={particle.size}
            duration={particle.duration}
            delay={particle.id * 0.1}
            color={particle.color}
            sx={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
            }}
          />
        ))}
      </ParticleContainer>

      {/* Main Application */}
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${BRAND_COLORS.neutral.black} 0%, ${BRAND_COLORS.neutral.darkGray} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <AppBar
          position="sticky"
          sx={{
            background: BRAND_COLORS.neutral.whiteAlpha[10],
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <FlexContainer
              justify="space-between"
              align="center"
              sx={{ width: "100%" }}
            >
              <FlexContainer align="center" gap={2}>
                <AutoAwesome
                  sx={{ color: BRAND_COLORS.primary.blue, fontSize: "2rem" }}
                />
                <GradientText variant="h5">MAGURE.AI</GradientText>
                <Typography
                  variant="caption"
                  sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
                >
                  Resume Intelligence Platform
                </Typography>
              </FlexContainer>

              {uploadStats.total > 0 && (
                <Fade in timeout={1000}>
                  <Box>{statsDisplay}</Box>
                </Fade>
              )}
            </FlexContainer>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grow in timeout={1000}>
            <GlassCard intensity="medium">
              {/* Hero Section */}
              <Box textAlign="center" mb={4}>
                <AnimatedText
                  variant="h2"
                  gutterBottom
                  sx={{
                    color: BRAND_COLORS.neutral.white,
                    fontWeight: 800,
                    mb: 2,
                  }}
                >
                  AI-Powered Resume Management
                </AnimatedText>

                <AnimatedText
                  variant="h6"
                  sx={{
                    color: BRAND_COLORS.neutral.whiteAlpha[80],
                    maxWidth: "600px",
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                  delay={0.2}
                >
                  Transform your hiring process with intelligent resume
                  analysis, semantic search, and automated candidate matching.
                </AnimatedText>

                <Divider margin={3} />
              </Box>

              {/* Navigation Tabs */}
              <Box sx={{ width: "100%" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  centered={!isMobile}
                  variant={isMobile ? "fullWidth" : "standard"}
                  sx={{
                    mb: 3,
                    "& .MuiTab-root": {
                      color: BRAND_COLORS.neutral.whiteAlpha[70],
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      minHeight: "60px",
                      "&.Mui-selected": {
                        color: BRAND_COLORS.primary.blue,
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: BRAND_COLORS.primary.blue,
                      height: 3,
                      borderRadius: "3px 3px 0 0",
                    },
                  }}
                >
                  {tabConfig.map((tab, index) => (
                    <Tab
                      key={index}
                      label={tab.label}
                      icon={tab.icon}
                      iconPosition="start"
                      sx={{
                        gap: 1,
                        transition: `all ${animations.fadeIn} ease`,
                        "&:hover": {
                          color: BRAND_COLORS.primary.blueLight,
                        },
                      }}
                    />
                  ))}
                </Tabs>

                {/* Tab Panels */}
                {tabConfig.map((tab, index) => (
                  <CustomTabPanel key={index} value={activeTab} index={index}>
                    {tab.component}
                  </CustomTabPanel>
                ))}
              </Box>
            </GlassCard>
          </Grow>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: "auto",
            textAlign: "center",
            borderTop: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
            background: BRAND_COLORS.neutral.whiteAlpha[10],
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
          >
            © 2024 MAGURE.AI - Advanced Resume Intelligence Platform
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default App;
