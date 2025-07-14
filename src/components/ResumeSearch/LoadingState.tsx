import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";
import { Fade } from "@mui/material";
import { AppColors } from "./theme";
import { LoadingStateProps } from "./types";

// Skeleton Loading Component
const SearchResultSkeleton = () => (
  <Card
    sx={{
      borderRadius: 2,
      border: `1px solid ${AppColors.border.light}`,
      backgroundColor: AppColors.background.paper,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      {/* Header skeleton */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width="60%" height={28} />
      </Box>

      {/* Highlights skeleton */}
      <Box sx={{ mb: 3 }}>
        {[1, 2, 3].map((index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              sx={{ mt: 0.2 }}
            />
            <Skeleton
              variant="text"
              width={`${Math.random() * 40 + 60}%`}
              height={20}
            />
          </Box>
        ))}
      </Box>

      {/* Button skeleton */}
      <Skeleton variant="rounded" width={140} height={40} />
    </CardContent>
  </Card>
);

const LoadingState: React.FC<LoadingStateProps> = ({ isSearching }) => {
  if (!isSearching) return null;

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          minHeight: 400,
          borderRadius: 2,
          backgroundColor: AppColors.background.paper,
          border: `1px solid ${AppColors.border.light}`,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              pb: 3,
              borderBottom: `1px solid ${AppColors.border.light}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={200} height={32} />
            </Box>
            <Skeleton variant="rounded" width={120} height={36} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3, 4].map((index) => (
              <SearchResultSkeleton key={index} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default LoadingState;
