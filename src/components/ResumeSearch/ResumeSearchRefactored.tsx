import React, { useState, useCallback, useEffect } from "react";
import { Box, Container, Fade } from "@mui/material";
import { API_CONFIG } from "../../theme/constants";
import { useGroups } from "../../hooks/useGroups";
import { AppColors } from "./theme";
import { StyledAlert } from "./theme";
import {
  HeroSection,
  SearchInput,
  UploadJD,
  LoadingState,
  EmptyState,
  NoResults,
  SearchResults,
  ResumeSearchProps,
  CandidateResult,
  SearchApiResponse,
  parseCandidateFromText,
} from "./index";

const ResumeSearch: React.FC<ResumeSearchProps> = ({ onSearchResults }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CandidateResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [searchSummary, setSearchSummary] = useState<string | null>(null);

  // Groups management
  const { groups, error: groupsError } = useGroups();

  // Add new state for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Add tab state
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Clear previous search/upload state
    setSearchQuery("");
    setSelectedFile(null);
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
  };

  // API search handler with POST method
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    if (searchQuery.trim().length < 5) {
      setError(
        "Please enter at least 5 characters for your search query or job description."
      );
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      // Prepare the request body
      const requestBody: any = {
        query: searchQuery.trim(),
        group: selectedGroup && selectedGroup !== "" ? selectedGroup : null,
      };

      const response = await fetch(`${API_CONFIG.baseURL}/search_api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Search failed: ${response.status} ${response.statusText}`
        );
      }

      const data: SearchApiResponse = await response.json();

      // Check if we have candidate details in the answer
      if (
        data.answer &&
        data.answer.candidate_details &&
        data.answer.candidate_details.length > 0
      ) {
        const candidateDetails = data.answer.candidate_details;

        // Calculate average score from all score categories
        // Formula: (Clarity + Experience + Loyalty + Reputation) ÷ 4
        // Each score is rated 1-10, so average will also be 1-10
        const calculateAverageScore = (scores: any) => {
          if (!scores) return 0;
          const total =
            scores.clarity_score +
            scores.experience_score +
            scores.loyalty_score +
            scores.reputation_score;
          return total / 4;
        };

        // Create candidate objects from the structured response
        const candidates: CandidateResult[] = candidateDetails.map(
          (detail, index) => {
            // Find corresponding chunk for additional text data
            const matchingChunk = data.results.find(
              (chunk) => chunk.source_file === detail.file_name
            );

            const parsedCandidate = matchingChunk
              ? parseCandidateFromText(matchingChunk)
              : null;

            // Add null check for score_card
            const scoreCard = detail.score_card || null;
            const averageScore = scoreCard
              ? ((scoreCard.clarity_score || 0) +
                  (scoreCard.experience_score || 0) +
                  (scoreCard.loyalty_score || 0) +
                  (scoreCard.reputation_score || 0)) /
                4
              : 0;

            return {
              id: matchingChunk?.id || `candidate-${index}`,
              name: detail.candidate_name,
              filename: detail.file_name,
              details: detail.details,
              // Include all individual scores with null checks
              clarityScore: scoreCard?.clarity_score || 0,
              experienceScore: scoreCard?.experience_score || 0,
              loyaltyScore: scoreCard?.loyalty_score || 0,
              reputationScore: scoreCard?.reputation_score || 0,
              averageScore: averageScore,
              // Include chunk-based match score if available
              matchScore: matchingChunk?.score || averageScore / 10,
              // Include parsed data if available
              email: parsedCandidate?.email,
              phone: parsedCandidate?.phone,
              location: parsedCandidate?.location,
              currentRole: parsedCandidate?.currentRole,
              skills: parsedCandidate?.skills,
              rawText: matchingChunk?.text,
              highlights: detail.details
                .split("*")
                .filter((item) => item.trim())
                .map((item) => item.trim().replace(/^,\s*/, "")),
              group: matchingChunk?.group,
              // Include comment fields
              comment: detail.comment || null,
              commentedAt: detail.commented_at || null,
            };
          }
        );

        // Sort candidates by average score in descending order
        const sortedCandidates = candidates.sort((a, b) => {
          const scoreA = a.averageScore || 0;
          const scoreB = b.averageScore || 0;
          return scoreB - scoreA; // Descending order
        });

        setSearchResults(sortedCandidates);
        setSearchSummary(data.answer.summary);
        onSearchResults(sortedCandidates);
      } else {
        setSearchResults([]);
        setSearchSummary(null);
        onSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Search failed. Please try again."
      );
      setSearchResults([]);
      setSearchSummary(null);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedGroup, onSearchResults]);

  // Handle JD upload and search
  const handleJDUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (selectedGroup) {
        formData.append("group", selectedGroup);
      }

      const response = await fetch(`${API_CONFIG.baseURL}/upload_jd`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      const data: SearchApiResponse = await response.json();
      console.log("JD Upload Response:", data);

      // Use the same logic as text search
      if (
        data.answer &&
        data.answer.candidate_details &&
        data.answer.candidate_details.length > 0
      ) {
        const candidateDetails = data.answer.candidate_details;

        // Calculate average score from all score categories
        const candidates: CandidateResult[] = candidateDetails.map(
          (detail, index) => {
            const scoreCard = detail.score_card;
            const averageScore = scoreCard
              ? (scoreCard.clarity_score +
                  scoreCard.experience_score +
                  scoreCard.loyalty_score +
                  scoreCard.reputation_score) /
                4
              : 0;

            // Extract name from filename if candidate_name is "Name not found"
            let displayName = detail.candidate_name;
            if (displayName === "Name not found" && detail.file_name) {
              const nameParts = detail.file_name.split("_");
              if (nameParts.length > 1) {
                displayName = nameParts
                  .slice(1, -1)
                  .join(" ")
                  .replace(/\.pdf$|\.docx$/i, "");
              }
            }

            return {
              id: detail.file_name || `candidate-${index}`,
              name: displayName || "Unknown Candidate",
              filename: detail.file_name,
              details: detail.details,
              clarityScore: scoreCard.clarity_score,
              experienceScore: scoreCard.experience_score,
              loyaltyScore: scoreCard.loyalty_score,
              reputationScore: scoreCard.reputation_score,
              averageScore,
              matchScore: scoreCard.clarity_score / 10,
              highlights: detail.details
                .split("\n")
                .map((line) => line.trim().replace(/^[-•]\s*/, ""))
                .filter((line) => line.length > 0),
              rawText: detail.details,
              // Include comment fields
              comment: detail.comment || null,
              commentedAt: detail.commented_at || null,
            };
          }
        );

        // Sort candidates by average score in descending order
        const sortedCandidates = candidates.sort(
          (a, b) => (b.averageScore || 0) - (a.averageScore || 0)
        );

        setSearchResults(sortedCandidates);
        setSearchSummary(data.answer.summary);
        onSearchResults(sortedCandidates);
      } else {
        setSearchResults([]);
        setSearchSummary(null);
        onSearchResults([]);
      }

      // Clear the file input
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again."
      );
      setSearchResults([]);
      setSearchSummary(null);
      onSearchResults([]);
    } finally {
      setIsUploading(false);
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSelectedGroup("");
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    setSearchSummary(null);
    onSearchResults([]);
  }, [onSearchResults]);

  return (
    <Box
      sx={{
        backgroundColor: AppColors.background.default,
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Enhanced Hero Section */}
        <HeroSection activeTab={activeTab} onTabChange={handleTabChange}>
          {activeTab === 0 ? (
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              onSearch={handleSearch}
              isSearching={isSearching}
              groups={groups || []}
              groupsError={groupsError}
            />
          ) : (
            <UploadJD
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              onUpload={handleJDUpload}
              isUploading={isUploading}
              groups={groups || []}
              groupsError={groupsError}
              error={error}
              setError={setError}
            />
          )}
        </HeroSection>

        {/* Error Display */}
        <Fade in={!!(error || groupsError)}>
          <Box>
            {error && (
              <StyledAlert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </StyledAlert>
            )}
            {groupsError && (
              <StyledAlert severity="warning" sx={{ mb: 3 }}>
                Failed to load groups: {groupsError}. Searching in all groups.
              </StyledAlert>
            )}
          </Box>
        </Fade>

        {/* Loading State */}
        <LoadingState isSearching={isSearching} />

        {/* Empty State */}
        <EmptyState hasSearched={hasSearched} isSearching={isSearching} />

        {/* Search Results or No Results */}
        {hasSearched && !isSearching && (
          <>
            {searchResults.length > 0 ? (
              <SearchResults
                searchResults={searchResults}
                searchSummary={searchSummary}
                selectedGroup={selectedGroup}
                onClearSearch={clearSearch}
              />
            ) : (
              <NoResults onClearSearch={clearSearch} />
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default ResumeSearch;
