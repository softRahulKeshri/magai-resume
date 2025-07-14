// Types for search results
export interface RawChunkResult {
  chunk_index: number;
  id: string;
  score: number;
  source_file: string;
  text: string;
  group?: string;
}

export interface CandidateDetail {
  candidate_name: string;
  details: string;
  file_name: string;
  score_card: ScoreCard;
  comment?: string | null;
  commented_at?: string | null;
}

export interface ScoreCard {
  clarity_score: number;
  experience_score: number;
  loyalty_score: number;
  reputation_score: number;
}

export interface SearchApiResponse {
  answer: {
    candidate_details: CandidateDetail[];
    summary: string;
  };
  results: RawChunkResult[];
}

export interface CandidateResult {
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
  rawText?: string;
  highlights?: string[];
  // Updated score field names to match API response
  clarityScore?: number;
  experienceScore?: number;
  loyaltyScore?: number;
  reputationScore?: number;
  averageScore?: number;
  details?: string;
  group?: string;
  // Comment fields
  comment?: string | null;
  commentedAt?: string | null;
}

// Props interfaces
export interface ResumeSearchProps {
  onSearchResults: (results: CandidateResult[]) => void;
}

export interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  groups: any[];
  groupsError: string | null;
}

export interface UploadJDProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  onUpload: () => void;
  isUploading: boolean;
  groups: any[];
  groupsError: string | null;
  error: string | null;
  setError: (error: string | null) => void;
}

export interface SearchResultsProps {
  searchResults: CandidateResult[];
  searchSummary: string | null;
  selectedGroup: string;
  onClearSearch: () => void;
}

export interface CandidateCardProps {
  candidate: CandidateResult;
  index: number;
}

export interface HeroSectionProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  children: React.ReactNode;
}

export interface SearchTabsProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export interface LoadingStateProps {
  isSearching: boolean;
}

export interface EmptyStateProps {
  hasSearched: boolean;
  isSearching: boolean;
}

export interface NoResultsProps {
  onClearSearch: () => void;
}
