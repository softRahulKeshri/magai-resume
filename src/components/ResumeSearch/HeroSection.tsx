import React from "react";
import { Box } from "@mui/material";
import { AutoAwesome, TextFields, Description } from "@mui/icons-material";
import {
  HeroSection as StyledHeroSection,
  HeroTitle,
  HeroSubtitle,
  StyledTabs,
  StyledTab,
  SearchOptionsContainer,
} from "./theme";
import { HeroSectionProps } from "./types";

const HeroSection: React.FC<HeroSectionProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <StyledHeroSection elevation={0}>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Animated Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            "& svg": {
              fontSize: "2.5rem",
              color: "white",
              animation: "float 3s ease-in-out infinite",
            },
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0)",
              },
              "50%": {
                transform: "translateY(-10px)",
              },
            },
          }}
        >
          <AutoAwesome />
        </Box>

        {/* Enhanced Title */}
        <HeroTitle variant="h1">AI-Powered Resume Matching</HeroTitle>

        {/* Enhanced Subtitle */}
        <HeroSubtitle>
          Let our advanced AI find your perfect candidates. We analyze skills,
          experience, and potential matches using state-of-the-art language
          models to deliver precise results.
        </HeroSubtitle>

        <SearchOptionsContainer>
          {/* Enhanced Tabs */}
          <StyledTabs value={activeTab} onChange={onTabChange} centered>
            <StyledTab
              icon={<TextFields />}
              label="Search by Text"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            />
            <StyledTab
              icon={<Description />}
              label="Upload JD"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            />
          </StyledTabs>

          {/* Children (Search Input or Upload Area) */}
          {children}
        </SearchOptionsContainer>
      </Box>
    </StyledHeroSection>
  );
};

export default HeroSection;
