import React from "react";
import { Box, Typography, Button, Paper, CardContent } from "@mui/material";
import {
  Person,
  CheckCircle,
  Comment,
  AccessTime,
  Download,
  Visibility,
  TrendingUp,
} from "@mui/icons-material";
import { Zoom } from "@mui/material";
import {
  ResultCard,
  ScoreBadge,
  ScoreMetricsSection,
  ScoreMetricsGrid,
  ScoreMetricItem,
  ScoreLabel,
  AppColors,
} from "./theme";
import { CandidateCardProps } from "./types";
import { getDisplayFilename, formatCommentDate } from "./utils";
import { API_CONFIG } from "../../theme/constants";

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index }) => {
  return (
    <Zoom in timeout={300 + index * 100}>
      <ResultCard>
        <CardContent sx={{ p: 0 }}>
          {/* Enhanced Header with Score */}
          <Box
            sx={{
              background:
                "linear-gradient(135deg, rgba(248, 250, 252, 0.06) 0%, rgba(241, 245, 249, 0.02) 100%)",
              backdropFilter: "blur(20px)",
              p: 4,
              borderRadius: "12px 12px 0 0",
              position: "relative",
              borderBottom: "1px solid rgba(203, 213, 225, 0.08)",
            }}
          >
            {/* Compact Score Display - Top Right */}
            <Box
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Score Label */}
              <ScoreLabel
                sx={{
                  color: AppColors.text.secondary,
                  fontSize: "0.75rem",
                  mb: 1,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {candidate.clarityScore ||
                candidate.experienceScore ||
                candidate.loyaltyScore ||
                candidate.reputationScore
                  ? "Overall Score"
                  : "No Score Available"}
              </ScoreLabel>
              <ScoreBadge score={candidate.averageScore || 0}>
                {candidate.clarityScore ||
                candidate.experienceScore ||
                candidate.loyaltyScore ||
                candidate.reputationScore ? (
                  <>
                    {(candidate.averageScore || 0).toFixed(1)}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.8rem",
                        opacity: 0.8,
                        ml: 0.3,
                      }}
                    >
                      /10
                    </Typography>
                  </>
                ) : (
                  "N/A"
                )}
              </ScoreBadge>
            </Box>

            {/* Candidate Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mr: 14, // Make room for score badge
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                  border: "2px solid rgba(59, 130, 246, 0.2)",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "10px",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  },
                }}
              >
                <Person
                  sx={{
                    fontSize: "2rem",
                    color: "white",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: AppColors.text.primary,
                    fontSize: "1.5rem",
                    mb: 1,
                    wordBreak: "break-word",
                    lineHeight: 1.2,
                    fontFamily:
                      '"SF Pro Display", -apple-system, system-ui, sans-serif',
                    letterSpacing: "-0.02em",
                  }}
                >
                  {candidate.name ||
                    getDisplayFilename(candidate.filename || "")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: AppColors.text.secondary,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    opacity: 0.9,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {candidate.group ? `${candidate.group} • ` : ""}Candidate
                  Profile
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 4 }}>
            {/* Performance Metrics Section */}
            <ScoreMetricsSection>
              <Typography
                variant="h6"
                sx={{
                  color: AppColors.text.primary,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <TrendingUp
                  sx={{
                    fontSize: "1.2rem",
                    color: AppColors.primary.main,
                  }}
                />
                {candidate.clarityScore ||
                candidate.experienceScore ||
                candidate.loyaltyScore ||
                candidate.reputationScore
                  ? "Performance Metrics"
                  : "Performance Metrics Not Available"}
              </Typography>

              {candidate.clarityScore ||
              candidate.experienceScore ||
              candidate.loyaltyScore ||
              candidate.reputationScore ? (
                <ScoreMetricsGrid>
                  <ScoreMetricItem score={candidate.clarityScore || 0}>
                    <Typography className="metric-label">Clarity</Typography>
                    <Typography className="metric-value">
                      {candidate.clarityScore || 0}
                    </Typography>
                    <Box className="metric-bar">
                      <Box className="metric-fill" />
                    </Box>
                  </ScoreMetricItem>

                  <ScoreMetricItem score={candidate.experienceScore || 0}>
                    <Typography className="metric-label">Experience</Typography>
                    <Typography className="metric-value">
                      {candidate.experienceScore || 0}
                    </Typography>
                    <Box className="metric-bar">
                      <Box className="metric-fill" />
                    </Box>
                  </ScoreMetricItem>

                  <ScoreMetricItem score={candidate.loyaltyScore || 0}>
                    <Typography className="metric-label">Loyalty</Typography>
                    <Typography className="metric-value">
                      {candidate.loyaltyScore || 0}
                    </Typography>
                    <Box className="metric-bar">
                      <Box className="metric-fill" />
                    </Box>
                  </ScoreMetricItem>

                  <ScoreMetricItem score={candidate.reputationScore || 0}>
                    <Typography className="metric-label">Reputation</Typography>
                    <Typography className="metric-value">
                      {candidate.reputationScore || 0}
                    </Typography>
                    <Box className="metric-bar">
                      <Box className="metric-fill" />
                    </Box>
                  </ScoreMetricItem>
                </ScoreMetricsGrid>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    color: AppColors.text.secondary,
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Typography variant="body1">
                    Performance metrics are not available for this candidate.
                  </Typography>
                </Box>
              )}
            </ScoreMetricsSection>

            {/* Premium highlights section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: AppColors.text.primary,
                  fontWeight: 700,
                  mb: 3,
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: "1.3rem",
                    color: "#10b981",
                  }}
                />
                Profile Summary
              </Typography>

              {candidate.highlights && candidate.highlights.length > 0 ? (
                <Box
                  sx={{
                    background:
                      "linear-gradient(145deg, rgba(248, 250, 252, 0.06) 0%, rgba(241, 245, 249, 0.03) 100%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 2,
                    padding: 3,
                    border: "1px solid rgba(203, 213, 225, 0.12)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background:
                        "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                      borderRadius: "16px 16px 0 0",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {candidate.highlights.map((highlight, highlightIndex) => (
                      <Box
                        key={highlightIndex}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          position: "relative",
                          pl: 1,
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 4,
                            height: 4,
                            backgroundColor: "#10b981",
                            borderRadius: "50%",
                            boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: AppColors.text.primary,
                            lineHeight: 1.6,
                            fontSize: "1rem",
                            fontWeight: 500,
                            pl: 2,
                          }}
                        >
                          {highlight}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : candidate.details ? (
                // Show structured details if no highlights
                <Box
                  sx={{
                    background:
                      "linear-gradient(145deg, rgba(248, 250, 252, 0.06) 0%, rgba(241, 245, 249, 0.03) 100%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 2,
                    padding: 3,
                    border: "1px solid rgba(203, 213, 225, 0.12)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background:
                        "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                      borderRadius: "16px 16px 0 0",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      position: "relative",
                      pl: 1,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: 4,
                        backgroundColor: "#10b981",
                        borderRadius: "50%",
                        boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: AppColors.text.primary,
                        lineHeight: 1.6,
                        fontSize: "1rem",
                        fontWeight: 500,
                        pl: 2,
                      }}
                    >
                      {candidate.details.replace(/\*/g, "").trim()}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                // Fallback to skills and role if no highlights
                <>
                  {candidate.skills && candidate.skills.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2.5,
                        mb: 3,
                        p: 3,
                        backgroundColor: "rgba(248, 250, 252, 0.04)",
                        borderRadius: 2,
                        border: "1px solid rgba(203, 213, 225, 0.08)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(248, 250, 252, 0.07)",
                          borderColor: "rgba(203, 213, 225, 0.15)",
                          transform: "translateX(8px)",
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.2,
                          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        <CheckCircle
                          sx={{
                            color: "white",
                            fontSize: "14px",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: AppColors.text.primary,
                          lineHeight: 1.6,
                          fontSize: "1rem",
                          fontWeight: 500,
                        }}
                      >
                        Skilled in {candidate.skills.slice(0, 5).join(", ")}
                        {candidate.skills.length > 5 &&
                          ` and ${
                            candidate.skills.length - 5
                          } more technologies`}
                      </Typography>
                    </Box>
                  )}

                  {candidate.currentRole && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2.5,
                        mb: 3,
                        p: 3,
                        backgroundColor: "rgba(248, 250, 252, 0.04)",
                        borderRadius: 2,
                        border: "1px solid rgba(203, 213, 225, 0.08)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(248, 250, 252, 0.07)",
                          borderColor: "rgba(203, 213, 225, 0.15)",
                          transform: "translateX(8px)",
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.2,
                          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        <CheckCircle
                          sx={{
                            color: "white",
                            fontSize: "14px",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: AppColors.text.primary,
                          lineHeight: 1.6,
                          fontSize: "1rem",
                          fontWeight: 500,
                        }}
                      >
                        {candidate.currentRole}
                      </Typography>
                    </Box>
                  )}

                  {(!candidate.skills || candidate.skills.length === 0) &&
                    !candidate.currentRole &&
                    candidate.rawText && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2.5,
                          mb: 3,
                          p: 3,
                          backgroundColor: "rgba(248, 250, 252, 0.04)",
                          borderRadius: 2,
                          border: "1px solid rgba(203, 213, 225, 0.08)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(248, 250, 252, 0.07)",
                            borderColor: "rgba(203, 213, 225, 0.15)",
                            transform: "translateX(8px)",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            mt: 0.2,
                            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          <CheckCircle
                            sx={{
                              color: "white",
                              fontSize: "14px",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: AppColors.text.primary,
                            lineHeight: 1.6,
                            fontSize: "1rem",
                            fontWeight: 500,
                          }}
                        >
                          {candidate.rawText.substring(0, 120)}...
                        </Typography>
                      </Box>
                    )}
                </>
              )}
            </Box>

            {/* Comment Section */}
            {candidate.comment && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: AppColors.text.primary,
                    fontWeight: 700,
                    mb: 2,
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  <Comment
                    sx={{
                      fontSize: "1.1rem",
                      color: AppColors.secondary.main,
                    }}
                  />
                  Recruiter Comment
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: "#FFF8E1",
                    borderRadius: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 2.5,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: AppColors.secondary.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    <Comment
                      sx={{
                        color: "#fff",
                        fontSize: "1.3rem",
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: AppColors.text.primary,
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        fontStyle: "normal",
                        mb: 0.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {candidate.comment}
                    </Typography>
                    {candidate.commentedAt && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <AccessTime
                          sx={{
                            fontSize: "1rem",
                            color: AppColors.text.secondary,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: AppColors.text.secondary,
                            fontSize: "0.8rem",
                            fontWeight: 400,
                          }}
                        >
                          {formatCommentDate(candidate.commentedAt)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Premium Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${AppColors.border.light}`,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -1,
                  right: 0,
                  width: "30%",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #3b82f6)",
                  borderRadius: "2px",
                },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={async () => {
                  try {
                    const originalFilename = candidate.filename || candidate.id;
                    if (!originalFilename) {
                      throw new Error("Filename not available for download");
                    }
                    const downloadUrl = `${API_CONFIG.baseURL}/uploads/${originalFilename}`;

                    // Fetch the file
                    const response = await fetch(downloadUrl);
                    if (!response.ok) throw new Error("Download failed");

                    // Get the blob from response
                    const blob = await response.blob();

                    // Create a temporary URL for the blob
                    const url = window.URL.createObjectURL(blob);

                    // Create a temporary link element
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = originalFilename; // Set the download filename

                    // Append to document, click, and cleanup
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Error downloading CV:", error);
                    alert("Failed to download CV. Please try again.");
                  }
                }}
                sx={{
                  borderColor: AppColors.primary.main,
                  color: AppColors.primary.main,
                  backgroundColor: `${AppColors.primary.main}08`,
                  "&:hover": {
                    backgroundColor: `${AppColors.primary.main}15`,
                    borderColor: AppColors.primary.main,
                    transform: "translateY(-1px)",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                }}
              >
                Download CV
              </Button>
              <Button
                variant="contained"
                startIcon={<Visibility />}
                onClick={() => {
                  try {
                    const originalFilename = candidate.filename || candidate.id;
                    if (!originalFilename) {
                      throw new Error("Filename not available for viewing");
                    }
                    const viewUrl = `${API_CONFIG.baseURL}/uploads/${originalFilename}`;
                    window.open(viewUrl, "_blank");
                  } catch (error) {
                    console.error("Error viewing CV:", error);
                    alert("Failed to view CV. Please try again.");
                  }
                }}
                sx={{
                  backgroundColor: AppColors.primary.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: AppColors.primary.dark,
                    transform: "translateY(-1px)",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                }}
              >
                View Resume
              </Button>
            </Box>
          </Box>
        </CardContent>
      </ResultCard>
    </Zoom>
  );
};

export default CandidateCard;
