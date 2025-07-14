import { RawChunkResult, CandidateResult } from "./types";

// Helper function to clean up filename for display
export const getDisplayFilename = (originalFilename: string): string => {
  if (!originalFilename) return "Unknown file";
  const cleaned = originalFilename.replace(/^[a-zA-Z0-9]+_[a-zA-Z0-9]+_/, "");
  return cleaned.length < 5 ? originalFilename : cleaned;
};

// Helper function to format comment date
export const formatCommentDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid date";
  }
};

// Helper function to extract meaningful highlights from resume text
export const extractHighlights = (text: string): string[] => {
  const highlights: string[] = [];
  const lines = text.split("\n").filter((line) => line.trim());

  // Look for lines that start with bullets, dashes, or are in bullet point format
  const bulletPatterns = [
    /^[-•·*]\s*(.+)/, // Lines starting with bullet points
    /^-\s*(.+)/, // Lines starting with dashes
    /^(.+using\s+.+)/i, // Lines mentioning "using" (technical implementations)
    /^(.+developed?\s+.+)/i, // Lines mentioning development
    /^(.+implemented?\s+.+)/i, // Lines mentioning implementation
    /^(.+built?\s+.+)/i, // Lines mentioning building
    /^(.+created?\s+.+)/i, // Lines mentioning creation
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 20 && trimmedLine.length < 200) {
      for (const pattern of bulletPatterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          const highlight = match[1] || match[0];
          if (highlight && !highlights.includes(highlight)) {
            highlights.push(highlight);
            break; // Only match one pattern per line
          }
        }
      }
    }
  }

  // If no bullet points found, extract meaningful sentences
  if (highlights.length === 0) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 30);
    for (const sentence of sentences.slice(0, 3)) {
      const cleanSentence = sentence.trim();
      if (cleanSentence.length > 20 && cleanSentence.length < 150) {
        highlights.push(cleanSentence);
      }
    }
  }

  return highlights.slice(0, 3); // Return max 3 highlights
};

// Helper function to parse candidate information from raw text
export const parseCandidateFromText = (
  chunk: RawChunkResult
): CandidateResult => {
  const text = chunk.text;

  // Extract email using regex
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  const email = emailMatch ? emailMatch[0] : undefined;

  // Extract phone using regex (various formats)
  const phoneMatch = text.match(
    /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}|\+?[0-9]{10,15}/
  );
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  // Extract location (look for city, state patterns)
  const locationMatch = text.match(
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z]{2}|[A-Z][a-z]+)/
  );
  const location = locationMatch
    ? `${locationMatch[1]}, ${locationMatch[2]}`
    : undefined;

  // Extract name (usually appears at the beginning or after contact info)
  const lines = text.split("\n").filter((line) => line.trim());
  let name = "Unknown Candidate";

  // Look for name patterns - typically first line or after contact info
  for (const line of lines.slice(0, 5)) {
    const trimmedLine = line.trim();
    // Skip lines with common resume sections
    if (
      trimmedLine &&
      !trimmedLine.includes("@") &&
      !trimmedLine.match(/^\d/) &&
      !trimmedLine.toUpperCase().includes("EDUCATION") &&
      !trimmedLine.toUpperCase().includes("EXPERIENCE") &&
      !trimmedLine.toUpperCase().includes("SKILLS") &&
      !trimmedLine.includes("linkedin") &&
      trimmedLine.length > 3 &&
      trimmedLine.length < 50
    ) {
      // Check if it looks like a name (contains letters and possibly spaces)
      if (/^[a-zA-Z\s.]+$/.test(trimmedLine)) {
        name = trimmedLine;
        break;
      }
    }
  }

  // Extract skills - look for common tech skills
  const skillsText = text.toLowerCase();
  const commonSkills = [
    "react",
    "javascript",
    "python",
    "java",
    "node",
    "nodejs",
    "angular",
    "vue",
    "typescript",
    "html",
    "css",
    "sql",
    "mongodb",
    "postgresql",
    "mysql",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "linux",
    "tensorflow",
    "pytorch",
    "machine learning",
    "data science",
    "artificial intelligence",
    "ai",
    "streamlit",
    "flask",
    "django",
    "express",
    "spring",
    "bootstrap",
    "tailwind",
    "sass",
    "graphql",
    "rest api",
    "microservices",
    "devops",
    "ci/cd",
    "jenkins",
    "github",
    "gitlab",
    "figma",
    "photoshop",
  ];

  const foundSkills = commonSkills.filter((skill) =>
    skillsText.includes(skill.toLowerCase())
  );

  // Extract current role/position
  const roleKeywords = [
    "developer",
    "engineer",
    "manager",
    "analyst",
    "scientist",
    "architect",
    "consultant",
  ];
  let currentRole = undefined;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (roleKeywords.some((keyword) => lowerLine.includes(keyword))) {
      currentRole = line.trim();
      break;
    }
  }

  // Use the original source_file name as stored on the server
  // Don't modify the filename as it needs to match the server's file storage
  const filename = chunk.source_file;

  // Extract highlights
  const highlights = extractHighlights(text);

  return {
    id: chunk.id,
    name,
    email,
    phone,
    location,
    currentRole,
    skills: foundSkills.length > 0 ? foundSkills : undefined,
    matchScore: chunk.score ? Math.min(chunk.score / 2, 1) : undefined, // Normalize score
    filename,
    rawText: text,
    highlights,
  };
};

// Helper function to get search suggestions based on selected group
export const getGroupBasedSuggestions = (groupName: string): string[] => {
  const defaultSuggestions = [
    "React Developer with 3+ years experience",
    "Senior Python Engineer with ML background",
    "Data Scientist with statistics expertise",
    "Full Stack Developer with cloud experience",
  ];

  if (!groupName) return defaultSuggestions;

  const lowerGroupName = groupName.toLowerCase();

  // Technology/Engineering groups
  if (
    lowerGroupName.includes("tech") ||
    lowerGroupName.includes("engineering") ||
    lowerGroupName.includes("software") ||
    lowerGroupName.includes("dev")
  ) {
    return [
      "React Developer",
      "Python Engineer",
      "Full Stack Developer",
      "Mobile Developer",
    ];
  }

  // Data/Analytics groups
  if (
    lowerGroupName.includes("data") ||
    lowerGroupName.includes("analytics") ||
    lowerGroupName.includes("ml") ||
    lowerGroupName.includes("ai")
  ) {
    return [
      "Data Scientist",
      "Machine Learning Engineer",
      "Data Analyst",
      "Python Developer",
    ];
  }

  // Marketing groups
  if (
    lowerGroupName.includes("marketing") ||
    lowerGroupName.includes("digital")
  ) {
    return [
      "Digital Marketing Specialist",
      "Content Creator",
      "SEO Specialist",
      "Social Media Manager",
    ];
  }

  // Sales groups
  if (lowerGroupName.includes("sales") || lowerGroupName.includes("business")) {
    return [
      "Sales Representative",
      "Account Manager",
      "Business Development",
      "Customer Success",
    ];
  }

  // Design groups
  if (
    lowerGroupName.includes("design") ||
    lowerGroupName.includes("creative") ||
    lowerGroupName.includes("ui") ||
    lowerGroupName.includes("ux")
  ) {
    return [
      "UI/UX Designer",
      "Graphic Designer",
      "Product Designer",
      "Creative Director",
    ];
  }

  // Finance groups
  if (
    lowerGroupName.includes("finance") ||
    lowerGroupName.includes("accounting")
  ) {
    return [
      "Financial Analyst",
      "Accountant",
      "Investment Analyst",
      "Risk Manager",
    ];
  }

  // HR/People groups
  if (
    lowerGroupName.includes("hr") ||
    lowerGroupName.includes("people") ||
    lowerGroupName.includes("human")
  ) {
    return [
      "HR Specialist",
      "Recruiter",
      "People Operations",
      "Training Manager",
    ];
  }

  // Operations groups
  if (lowerGroupName.includes("operations") || lowerGroupName.includes("ops")) {
    return [
      "Operations Manager",
      "Project Manager",
      "Supply Chain",
      "Process Improvement",
    ];
  }

  // Healthcare groups
  if (
    lowerGroupName.includes("health") ||
    lowerGroupName.includes("medical") ||
    lowerGroupName.includes("nurse") ||
    lowerGroupName.includes("doctor")
  ) {
    return [
      "Registered Nurse",
      "Medical Assistant",
      "Healthcare Administrator",
      "Clinical Researcher",
    ];
  }

  // Education groups
  if (
    lowerGroupName.includes("education") ||
    lowerGroupName.includes("teacher") ||
    lowerGroupName.includes("academic")
  ) {
    return [
      "Teacher",
      "Educational Coordinator",
      "Academic Advisor",
      "Training Specialist",
    ];
  }

  // Legal groups
  if (lowerGroupName.includes("legal") || lowerGroupName.includes("law")) {
    return [
      "Legal Advisor",
      "Paralegal",
      "Compliance Officer",
      "Contract Specialist",
    ];
  }

  // Default fallback with some variety
  return [
    "Senior Professional",
    "Team Lead",
    "Subject Matter Expert",
    "5+ years experience",
  ];
};
