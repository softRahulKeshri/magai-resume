/**
 * MAGURE.AI ResumeSearch Component
 *
 * Advanced AI-powered resume search interface with:
 * - Intelligent semantic search
 * - Real-time filtering and sorting
 * - Glass morphism UI design
 * - Advanced skill categorization
 * - Interactive resume cards
 * - Performance optimizations
 * - Professional animations
 *
 * @author MAGURE.AI Team
 */

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
  Tooltip,
  Badge,
  Stack,
  Fade,
  Slide,
  Zoom,
  Grow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search,
  Person,
  Work,
  School,
  Code,
  Email,
  Phone,
  ExpandMore,
  ExpandLess,
  Star,
  Clear,
  AutoAwesome,
  Insights,
  TrendingUp,
  FilterList,
  SortByAlpha,
  BusinessCenter,
  Speed,
} from "@mui/icons-material";

// Internal imports
import { Resume, SearchFilters } from "../types";
import {
  BRAND_COLORS,
  SHADOWS,
  ANIMATION_DURATION,
  SPACING,
} from "../theme/constants";
import { animations } from "../theme/animations";
import {
  GlassCard,
  GradientButton,
  FlexContainer,
  Badge as StyledBadge,
  LoadingSpinner,
  GradientText,
  AnimatedText,
} from "./common/StyledComponents";

// Mock API functions
const mockSearchResumes = async (
  query: string,
  filters?: SearchFilters
): Promise<Resume[]> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 1200)
  );

  // Mock search results - in production this would come from the API
  const mockResumes: Resume[] = [
    {
      id: 1,
      filename: "john_doe_senior_developer.pdf",
      rawText:
        "Senior Full Stack Developer with 8 years experience in React, Node.js, AWS...",
      profile:
        "Experienced full-stack developer specializing in modern web technologies",
      emails: ["john.doe@email.com"],
      phones: ["+1-555-0123"],
      skills: {
        all: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
        frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        backend: ["Node.js", "Express", "GraphQL"],
        database: ["PostgreSQL", "MongoDB", "Redis"],
        cloud: ["AWS", "Docker", "Kubernetes"],
        mobile: [],
        tools: ["Git", "Jest", "Webpack"],
      },
      experienceLevel: "senior",
      experienceYears: 8,
      education: ["B.S. Computer Science - MIT"],
      workExperience: {
        companies: ["TechCorp", "StartupXYZ", "BigTech Inc"],
        roles: [
          "Senior Developer",
          "Full Stack Developer",
          "Software Engineer",
        ],
      },
      relevanceScore: 95,
      uploadedAt: "2024-01-15T10:30:00Z",
      extractedAt: "2024-01-15T10:31:00Z",
      matchReason: "Strong match for React and Node.js expertise",
      hasTextMatch: true,
    },
    {
      id: 2,
      filename: "sarah_smith_frontend_specialist.pdf",
      rawText:
        "Frontend specialist with expertise in React, Vue.js, and modern UI/UX...",
      profile: "Creative frontend developer with strong design sensibilities",
      emails: ["sarah.smith@email.com"],
      phones: ["+1-555-0456"],
      skills: {
        all: ["React", "Vue.js", "CSS3", "Figma", "Webpack"],
        frontend: ["React", "Vue.js", "CSS3", "SCSS", "Styled Components"],
        backend: [],
        database: [],
        cloud: ["Netlify", "Vercel"],
        mobile: ["React Native"],
        tools: ["Figma", "Adobe XD", "Webpack", "Vite"],
      },
      experienceLevel: "mid",
      experienceYears: 5,
      education: ["B.A. Digital Design - Stanford"],
      workExperience: {
        companies: ["DesignStudio", "WebAgency"],
        roles: ["Frontend Developer", "UI Developer"],
      },
      relevanceScore: 88,
      uploadedAt: "2024-01-14T14:20:00Z",
      extractedAt: "2024-01-14T14:21:00Z",
      matchReason: "Excellent frontend skills and design experience",
      hasTextMatch: true,
    },
  ];

  // Simple mock filtering
  let results = mockResumes;

  if (query.trim()) {
    results = results.filter(
      (resume) =>
        resume.rawText.toLowerCase().includes(query.toLowerCase()) ||
        resume.skills.all.some((skill) =>
          skill.toLowerCase().includes(query.toLowerCase())
        )
    );
  }

  if (filters?.experienceLevel) {
    results = results.filter(
      (resume) => resume.experienceLevel === filters.experienceLevel
    );
  }

  if (filters?.skills && filters.skills.length > 0) {
    results = results.filter((resume) =>
      filters.skills!.some((skill) =>
        resume.skills.all.some((resumeSkill) =>
          resumeSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
  }

  if (filters?.minRelevanceScore) {
    results = results.filter(
      (resume) => resume.relevanceScore >= filters.minRelevanceScore!
    );
  }

  return results;
};

// Styled Components
const SearchContainer = styled(GlassCard)(() => ({
  padding: SPACING.xl,
  marginBottom: SPACING.xl,
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${BRAND_COLORS.neutral.whiteAlpha[10]} 0%, ${BRAND_COLORS.neutral.whiteAlpha[5]} 100%)`,
    opacity: 0,
    transition: `opacity ${ANIMATION_DURATION.normal} ease`,
  },

  "&:hover::before": {
    opacity: 1,
  },
}));

const SearchInput = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    background: BRAND_COLORS.neutral.whiteAlpha[10],
    backdropFilter: "blur(10px)",
    border: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
    borderRadius: "12px",
    color: BRAND_COLORS.neutral.white,
    transition: `all ${ANIMATION_DURATION.normal} ease`,

    "&:hover": {
      background: BRAND_COLORS.neutral.whiteAlpha[15],
      borderColor: BRAND_COLORS.primary.blue,
      boxShadow: `0 0 20px ${BRAND_COLORS.primary.blue}40`,
    },

    "&.Mui-focused": {
      background: BRAND_COLORS.neutral.whiteAlpha[15],
      borderColor: BRAND_COLORS.primary.blue,
      boxShadow: `0 0 30px ${BRAND_COLORS.primary.blue}60`,
      animation: `${animations.pulseGlow} 2s ease-in-out infinite`,
    },
  },

  "& .MuiOutlinedInput-input": {
    color: BRAND_COLORS.neutral.white,
    fontSize: "1.1rem",

    "&::placeholder": {
      color: BRAND_COLORS.neutral.whiteAlpha[70],
    },
  },

  "& .MuiInputLabel-root": {
    color: BRAND_COLORS.neutral.whiteAlpha[80],

    "&.Mui-focused": {
      color: BRAND_COLORS.primary.blue,
    },
  },
}));

const ResumeCard = styled(Card)(() => ({
  marginBottom: SPACING.lg,
  background: BRAND_COLORS.neutral.whiteAlpha[5],
  backdropFilter: "blur(15px)",
  border: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[10]}`,
  borderRadius: "16px",
  transition: `all ${ANIMATION_DURATION.slow} cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: `linear-gradient(90deg, transparent, ${BRAND_COLORS.neutral.whiteAlpha[10]}, transparent)`,
    transition: `left 0.6s ease`,
  },

  "&:hover": {
    background: BRAND_COLORS.neutral.whiteAlpha[10],
    borderColor: BRAND_COLORS.primary.blue,
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: SHADOWS.xl,
    animation: `${animations.gentleFloat} 2s ease-in-out infinite`,

    "&::before": {
      left: "100%",
    },
  },
}));

const SkillChip = styled(Chip)<{ category?: string }>(({ category }) => {
  const categoryColors = {
    frontend: {
      background: `linear-gradient(135deg, ${BRAND_COLORS.primary.blue}, ${BRAND_COLORS.primary.blueLight})`,
      boxShadow: `0 4px 15px ${BRAND_COLORS.primary.blue}40`,
    },
    backend: {
      background: `linear-gradient(135deg, ${BRAND_COLORS.accent.red}, ${BRAND_COLORS.accent.redLight})`,
      boxShadow: `0 4px 15px ${BRAND_COLORS.accent.red}40`,
    },
    database: {
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      boxShadow: "0 4px 15px rgba(79, 172, 254, 0.4)",
    },
    cloud: {
      background: "linear-gradient(135deg, #43e97b, #38f9d7)",
      boxShadow: "0 4px 15px rgba(67, 233, 123, 0.4)",
    },
    mobile: {
      background: "linear-gradient(135deg, #fa709a, #fee140)",
      boxShadow: "0 4px 15px rgba(250, 112, 154, 0.4)",
    },
    tools: {
      background: "linear-gradient(135deg, #a8edea, #fed6e3)",
      boxShadow: "0 4px 15px rgba(168, 237, 234, 0.4)",
    },
    default: {
      background: BRAND_COLORS.neutral.whiteAlpha[20],
      boxShadow: `0 4px 15px ${BRAND_COLORS.neutral.whiteAlpha[10]}`,
    },
  };

  const colors =
    categoryColors[category as keyof typeof categoryColors] ||
    categoryColors.default;

  return {
    ...colors,
    color: "white",
    fontWeight: 600,
    fontSize: "0.75rem",
    margin: "2px",
    transition: `all ${ANIMATION_DURATION.normal} ease`,

    "&:hover": {
      transform: "scale(1.1) translateY(-2px)",
      animation: `${animations.subtlePulse} 1s ease-in-out infinite`,
    },
  };
});

const FilterPanel = styled(GlassCard)(() => ({
  padding: SPACING.lg,
  marginBottom: SPACING.lg,
  background: BRAND_COLORS.neutral.whiteAlpha[8],
}));

const ScoreIndicator = styled(Box)<{ score: number }>(({ score }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 8px",
  borderRadius: "12px",
  background:
    score >= 90
      ? "linear-gradient(135deg, #10B981, #34D399)"
      : score >= 70
      ? "linear-gradient(135deg, #F59E0B, #FBBF24)"
      : "linear-gradient(135deg, #6B7280, #9CA3AF)",
  color: "white",
  fontSize: "0.8rem",
  fontWeight: 600,
}));

// Component interfaces
interface ResumeSearchProps {
  onSearchResults: (results: Resume[]) => void;
  resumes: Resume[];
}

/**
 * ResumeSearch Component
 *
 * Provides intelligent search functionality with advanced filtering,
 * semantic matching, and interactive UI. Optimized for performance
 * with debounced search and memoized results.
 */
const ResumeSearch = ({ onSearchResults, resumes }: ResumeSearchProps) => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<"relevance" | "experience" | "recent">(
    "relevance"
  );

  // Debounced search with performance optimization
  const performSearch = useCallback(
    async (query: string, currentFilters: SearchFilters) => {
      if (!query.trim() && Object.keys(currentFilters).length === 0) {
        setSearchResults([]);
        onSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await mockSearchResumes(query, currentFilters);

        // Sort results based on selected criteria
        const sortedResults = [...results].sort((a, b) => {
          switch (sortBy) {
            case "experience":
              return (b.experienceYears || 0) - (a.experienceYears || 0);
            case "recent":
              return (
                new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime()
              );
            case "relevance":
            default:
              return b.relevanceScore - a.relevanceScore;
          }
        });

        setSearchResults(sortedResults);
        onSearchResults(sortedResults);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        setSearchResults([]);
        onSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearchResults, sortBy]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery, filters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, performSearch]);

  // Card expansion handler
  const toggleCardExpansion = useCallback((resumeId: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resumeId)) {
        newSet.delete(resumeId);
      } else {
        newSet.add(resumeId);
      }
      return newSet;
    });
  }, []);

  // Filter handlers
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery("");
  }, []);

  // Skill categorization helper
  const categorizeSkill = useCallback(
    (skill: string, resume: Resume): string => {
      if (resume.skills.frontend.includes(skill)) return "frontend";
      if (resume.skills.backend.includes(skill)) return "backend";
      if (resume.skills.database.includes(skill)) return "database";
      if (resume.skills.cloud.includes(skill)) return "cloud";
      if (resume.skills.mobile.includes(skill)) return "mobile";
      if (resume.skills.tools.includes(skill)) return "tools";
      return "default";
    },
    []
  );

  // Memoized search statistics
  const searchStats = useMemo(() => {
    const totalResults = searchResults.length;
    const avgScore =
      totalResults > 0
        ? Math.round(
            searchResults.reduce((sum, r) => sum + r.relevanceScore, 0) /
              totalResults
          )
        : 0;
    const experienceLevels = searchResults.reduce((acc, r) => {
      acc[r.experienceLevel] = (acc[r.experienceLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalResults, avgScore, experienceLevels };
  }, [searchResults]);

  return (
    <Box>
      {/* Search Header */}
      <SearchContainer intensity="medium">
        <FlexContainer align="center" gap={2} sx={{ mb: 3 }}>
          <AutoAwesome
            sx={{ color: BRAND_COLORS.primary.blue, fontSize: "2rem" }}
          />
          <GradientText variant="h4" sx={{ fontWeight: 700 }}>
            AI Resume Search
          </GradientText>
        </FlexContainer>

        <SearchInput
          fullWidth
          variant="outlined"
          placeholder="Search by skills, experience, company, or any keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {isLoading && <LoadingSpinner size="small" />}
                {searchQuery && (
                  <IconButton onClick={() => setSearchQuery("")} size="small">
                    <Clear
                      sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
                    />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        <FlexContainer justify="space-between" align="center" sx={{ mt: 2 }}>
          <FlexContainer gap={1}>
            <GradientButton
              gradientVariant="secondary"
              size="small"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters{" "}
              {Object.keys(filters).length > 0 &&
                `(${Object.keys(filters).length})`}
            </GradientButton>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                sx={{
                  color: BRAND_COLORS.neutral.white,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: BRAND_COLORS.neutral.whiteAlpha[20],
                  },
                }}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="experience">Experience</MenuItem>
                <MenuItem value="recent">Recent</MenuItem>
              </Select>
            </FormControl>
          </FlexContainer>

          <FlexContainer gap={1}>
            {searchStats.totalResults > 0 && (
              <StyledBadge variant="info">
                {searchStats.totalResults} results
              </StyledBadge>
            )}
            {searchStats.avgScore > 0 && (
              <StyledBadge variant="success">
                Avg Score: {searchStats.avgScore}%
              </StyledBadge>
            )}
          </FlexContainer>
        </FlexContainer>
      </SearchContainer>

      {/* Advanced Filters */}
      <Collapse in={showFilters}>
        <FilterPanel intensity="light">
          <Typography
            variant="h6"
            sx={{ color: BRAND_COLORS.neutral.white, mb: 2 }}
          >
            Advanced Filters
          </Typography>

          <FlexContainer gap={3} wrap>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: BRAND_COLORS.neutral.whiteAlpha[80] }}>
                Experience Level
              </InputLabel>
              <Select
                value={filters.experienceLevel || ""}
                onChange={(e) =>
                  updateFilters({ experienceLevel: e.target.value as any })
                }
                sx={{ color: BRAND_COLORS.neutral.white }}
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="junior">Junior</MenuItem>
                <MenuItem value="mid">Mid-Level</MenuItem>
                <MenuItem value="senior">Senior</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ minWidth: 200 }}>
              <Typography
                variant="body2"
                sx={{ color: BRAND_COLORS.neutral.whiteAlpha[80], mb: 1 }}
              >
                Min Relevance Score: {filters.minRelevanceScore || 0}%
              </Typography>
              <Slider
                value={filters.minRelevanceScore || 0}
                onChange={(_, value) =>
                  updateFilters({ minRelevanceScore: value as number })
                }
                min={0}
                max={100}
                sx={{
                  color: BRAND_COLORS.primary.blue,
                  "& .MuiSlider-thumb": {
                    background: BRAND_COLORS.primary.blue,
                  },
                }}
              />
            </Box>

            <GradientButton
              gradientVariant="secondary"
              size="small"
              startIcon={<Clear />}
              onClick={clearFilters}
            >
              Clear Filters
            </GradientButton>
          </FlexContainer>
        </FilterPanel>
      </Collapse>

      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            background: `${BRAND_COLORS.accent.red}20`,
            color: BRAND_COLORS.neutral.white,
            border: `1px solid ${BRAND_COLORS.accent.red}40`,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Search Results */}
      <Box>
        {searchResults.map((resume, index) => (
          <Slide key={resume.id} direction="up" in timeout={400 + index * 100}>
            <ResumeCard>
              <CardContent sx={{ pb: 1 }}>
                <FlexContainer
                  justify="space-between"
                  align="flex-start"
                  sx={{ mb: 2 }}
                >
                  <Box sx={{ flex: 1 }}>
                    <FlexContainer align="center" gap={1} sx={{ mb: 1 }}>
                      <Person sx={{ color: BRAND_COLORS.primary.blue }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: BRAND_COLORS.neutral.white,
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        {resume.filename
                          .replace(/\.(pdf|doc|docx|txt)$/i, "")
                          .replace(/_/g, " ")}
                      </Typography>
                    </FlexContainer>

                    {resume.profile && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: BRAND_COLORS.neutral.whiteAlpha[80],
                          mb: 1,
                          fontStyle: "italic",
                        }}
                      >
                        {resume.profile}
                      </Typography>
                    )}

                    <FlexContainer gap={2} wrap sx={{ mb: 2 }}>
                      <FlexContainer align="center" gap={0.5}>
                        <BusinessCenter
                          sx={{
                            color: BRAND_COLORS.neutral.whiteAlpha[70],
                            fontSize: "1rem",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
                        >
                          {resume.experienceLevel} •{" "}
                          {resume.experienceYears || "N/A"} years
                        </Typography>
                      </FlexContainer>

                      {resume.emails.length > 0 && (
                        <FlexContainer align="center" gap={0.5}>
                          <Email
                            sx={{
                              color: BRAND_COLORS.neutral.whiteAlpha[70],
                              fontSize: "1rem",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
                          >
                            {resume.emails[0]}
                          </Typography>
                        </FlexContainer>
                      )}

                      {resume.phones.length > 0 && (
                        <FlexContainer align="center" gap={0.5}>
                          <Phone
                            sx={{
                              color: BRAND_COLORS.neutral.whiteAlpha[70],
                              fontSize: "1rem",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
                          >
                            {resume.phones[0]}
                          </Typography>
                        </FlexContainer>
                      )}
                    </FlexContainer>
                  </Box>

                  <ScoreIndicator score={resume.relevanceScore}>
                    <Star sx={{ fontSize: "1rem" }} />
                    {resume.relevanceScore}%
                  </ScoreIndicator>
                </FlexContainer>

                {/* Skills Preview */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: BRAND_COLORS.neutral.whiteAlpha[80],
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Code sx={{ fontSize: "1rem" }} />
                    Skills ({resume.skills.all.length})
                  </Typography>

                  <FlexContainer gap={0.5} wrap>
                    {resume.skills.all
                      .slice(0, expandedCards.has(resume.id) ? undefined : 8)
                      .map((skill) => (
                        <SkillChip
                          key={skill}
                          label={skill}
                          size="small"
                          category={categorizeSkill(skill, resume)}
                        />
                      ))}
                    {resume.skills.all.length > 8 &&
                      !expandedCards.has(resume.id) && (
                        <Chip
                          label={`+${resume.skills.all.length - 8} more`}
                          size="small"
                          sx={{
                            background: BRAND_COLORS.neutral.whiteAlpha[20],
                            color: BRAND_COLORS.neutral.whiteAlpha[80],
                          }}
                        />
                      )}
                  </FlexContainer>
                </Box>

                {/* Expanded Content */}
                <Collapse in={expandedCards.has(resume.id)}>
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: `1px solid ${BRAND_COLORS.neutral.whiteAlpha[20]}`,
                    }}
                  >
                    {resume.workExperience.companies.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: BRAND_COLORS.neutral.whiteAlpha[80],
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Work sx={{ fontSize: "1rem" }} />
                          Experience
                        </Typography>
                        <FlexContainer gap={1} wrap>
                          {resume.workExperience.companies.map(
                            (company, idx) => (
                              <StyledBadge key={idx} variant="info">
                                {company}
                              </StyledBadge>
                            )
                          )}
                        </FlexContainer>
                      </Box>
                    )}

                    {resume.education.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: BRAND_COLORS.neutral.whiteAlpha[80],
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <School sx={{ fontSize: "1rem" }} />
                          Education
                        </Typography>
                        <FlexContainer gap={1} wrap>
                          {resume.education.map((edu, idx) => (
                            <StyledBadge key={idx} variant="warning">
                              {edu}
                            </StyledBadge>
                          ))}
                        </FlexContainer>
                      </Box>
                    )}

                    {resume.matchReason && (
                      <Alert
                        severity="info"
                        sx={{
                          background: `${BRAND_COLORS.primary.blue}20`,
                          color: BRAND_COLORS.neutral.white,
                          border: `1px solid ${BRAND_COLORS.primary.blue}40`,
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Match Reason:</strong> {resume.matchReason}
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </Collapse>
              </CardContent>

              <CardActions
                sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
              >
                <Button
                  onClick={() => toggleCardExpansion(resume.id)}
                  sx={{
                    color: BRAND_COLORS.neutral.whiteAlpha[80],
                    "&:hover": { color: BRAND_COLORS.primary.blue },
                  }}
                  endIcon={
                    expandedCards.has(resume.id) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  }
                >
                  {expandedCards.has(resume.id) ? "Show Less" : "Show More"}
                </Button>

                <Typography
                  variant="caption"
                  sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
                >
                  Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                </Typography>
              </CardActions>
            </ResumeCard>
          </Slide>
        ))}

        {searchQuery && searchResults.length === 0 && !isLoading && (
          <GlassCard intensity="light" sx={{ textAlign: "center", py: 4 }}>
            <Insights
              sx={{
                fontSize: "3rem",
                color: BRAND_COLORS.neutral.whiteAlpha[50],
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: BRAND_COLORS.neutral.white, mb: 1 }}
            >
              No results found
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
            >
              Try adjusting your search terms or filters
            </Typography>
          </GlassCard>
        )}

        {!searchQuery && searchResults.length === 0 && !isLoading && (
          <GlassCard intensity="light" sx={{ textAlign: "center", py: 4 }}>
            <TrendingUp
              sx={{ fontSize: "3rem", color: BRAND_COLORS.primary.blue, mb: 2 }}
            />
            <AnimatedText
              variant="h6"
              sx={{ color: BRAND_COLORS.neutral.white, mb: 1 }}
            >
              Start Your Search
            </AnimatedText>
            <Typography
              variant="body2"
              sx={{ color: BRAND_COLORS.neutral.whiteAlpha[70] }}
            >
              Enter keywords, skills, or requirements to find matching resumes
            </Typography>
          </GlassCard>
        )}
      </Box>
    </Box>
  );
};

export default ResumeSearch;
