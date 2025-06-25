/**
 * Animation Keyframes for MAGURE.AI Resume Platform
 * Centralized animation definitions for consistent motion design
 */

import { keyframes } from "@mui/material/styles";

// Core Motion Animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Floating and Movement Animations
export const floatingAnimation = keyframes`
  0% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) translateX(20px) rotate(120deg);
  }
  66% {
    transform: translateY(20px) translateX(-20px) rotate(240deg);
  }
  100% {
    transform: translateY(0px) translateX(0px) rotate(360deg);
  }
`;

export const gentleFloat = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Rotation Animations
export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const reverseSpin = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

// Background and Gradient Animations
export const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const morphingBg = keyframes`
  0% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
  25% {
    border-radius: 58% 42% 75% 25% / 76% 24% 76% 24%;
  }
  50% {
    border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
  }
  75% {
    border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
  }
  100% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
`;

// Glow and Pulse Effects
export const pulseGlow = keyframes`
  0% {
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
  }
  50% {
    box-shadow: 0 8px 40px rgba(37, 99, 235, 0.6);
  }
  100% {
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
  }
`;

export const redPulseGlow = keyframes`
  0% {
    box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
  }
  50% {
    box-shadow: 0 8px 40px rgba(220, 38, 38, 0.6);
  }
  100% {
    box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
  }
`;

export const subtlePulse = keyframes`
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
`;

// Sparkle and Shine Effects
export const sparkleAnimation = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  25% {
    transform: scale(1) rotate(90deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: scale(1) rotate(270deg);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Scale and Transform Animations
export const scaleIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

export const hoverLift = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-4px);
  }
`;

// Shake and Vibration Effects
export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
`;

export const vibrate = keyframes`
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-1px, 1px);
  }
  40% {
    transform: translate(-1px, -1px);
  }
  60% {
    transform: translate(1px, 1px);
  }
  80% {
    transform: translate(1px, -1px);
  }
`;

// Loading Animations
export const loadingDots = keyframes`
  0%, 20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const progressBar = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`;

// Cursor Trail Animation
export const cursorTrailFade = keyframes`
  to {
    opacity: 0;
    transform: scale(0.5);
  }
`;

// Success/Error State Animations
export const successPulse = keyframes`
  0% {
    background-color: rgba(39, 174, 96, 0.1);
  }
  50% {
    background-color: rgba(39, 174, 96, 0.2);
  }
  100% {
    background-color: rgba(39, 174, 96, 0.1);
  }
`;

export const errorShake = keyframes`
  0%, 100% {
    transform: translateX(0);
    background-color: rgba(231, 76, 60, 0.1);
  }
  25% {
    transform: translateX(-5px);
    background-color: rgba(231, 76, 60, 0.15);
  }
  75% {
    transform: translateX(5px);
    background-color: rgba(231, 76, 60, 0.15);
  }
`;

// Export all animations as a single object for easier imports
export const animations = {
  fadeIn,
  slideUp,
  slideDown,
  bounceIn,
  floatingAnimation,
  gentleFloat,
  spin,
  reverseSpin,
  gradientShift,
  morphingBg,
  pulseGlow,
  redPulseGlow,
  subtlePulse,
  sparkleAnimation,
  shimmer,
  scaleIn,
  hoverLift,
  shake,
  vibrate,
  loadingDots,
  progressBar,
  cursorTrailFade,
  successPulse,
  errorShake,
} as const;
