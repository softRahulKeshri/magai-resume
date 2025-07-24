import { UPLOAD_CONFIG } from "../theme/constants";

/**
 * Formats the file limit display for consistent UI presentation
 * @param currentCount - Current number of files selected
 * @param maxFiles - Maximum number of files allowed (defaults to UPLOAD_CONFIG.maxFiles)
 * @returns Formatted string like "5/100" or "100/100"
 */
export const formatFileLimit = (
  currentCount: number,
  maxFiles: number = UPLOAD_CONFIG.maxFiles
): string => {
  return `${currentCount}/${maxFiles}`;
};

/**
 * Formats the file limit display with descriptive text
 * @param currentCount - Current number of files selected
 * @param maxFiles - Maximum number of files allowed (defaults to UPLOAD_CONFIG.maxFiles)
 * @returns Formatted string like "5 of 100 files" or "100 of 100 files"
 */
export const formatFileLimitWithText = (
  currentCount: number,
  maxFiles: number = UPLOAD_CONFIG.maxFiles
): string => {
  return `${currentCount} of ${maxFiles} files`;
};

/**
 * Formats the total size limit display
 * @returns Formatted string like "200MB total"
 */
export const formatTotalSizeLimit = (): string => {
  return "200MB total";
};

/**
 * Checks if the file limit has been reached
 * @param currentCount - Current number of files selected
 * @param maxFiles - Maximum number of files allowed (defaults to UPLOAD_CONFIG.maxFiles)
 * @returns True if limit reached, false otherwise
 */
export const isFileLimitReached = (
  currentCount: number,
  maxFiles: number = UPLOAD_CONFIG.maxFiles
): boolean => {
  return currentCount >= maxFiles;
};

/**
 * Gets the remaining file slots available
 * @param currentCount - Current number of files selected
 * @param maxFiles - Maximum number of files allowed (defaults to UPLOAD_CONFIG.maxFiles)
 * @returns Number of remaining file slots
 */
export const getRemainingFileSlots = (
  currentCount: number,
  maxFiles: number = UPLOAD_CONFIG.maxFiles
): number => {
  return Math.max(0, maxFiles - currentCount);
};
