import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BRAND_COLORS, Z_INDEX, ANIMATION_DURATION } from "../theme/constants";
import { animations } from "../theme/animations";

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  opacity: number;
  size: number;
  color: string;
}

const TrailParticle = styled(Box)<{
  x: number;
  y: number;
  opacity: number;
  size: number;
  color: string;
}>(({ x, y, opacity, size, color }) => ({
  position: "fixed",
  left: `${x}px`,
  top: `${y}px`,
  width: `${size}px`,
  height: `${size}px`,
  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
  borderRadius: "50%",
  pointerEvents: "none",
  opacity,
  transform: "translate(-50%, -50%)",
  zIndex: Z_INDEX.cursor,
  transition: `opacity ${ANIMATION_DURATION.normal} ease-out`,
  filter: "blur(0.5px)",
  mixBlendMode: "screen",
  animation: `${animations.cursorTrailFade} 1s ease-out forwards`,
}));

const CursorTrail = () => {
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Calculate mouse speed for dynamic effects
  const calculateSpeed = useCallback(
    (
      currentPos: { x: number; y: number },
      lastPos: { x: number; y: number }
    ) => {
      const dx = currentPos.x - lastPos.x;
      const dy = currentPos.y - lastPos.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    []
  );

  // Get dynamic color based on speed and position
  const getDynamicColor = useCallback((speed: number, x: number, y: number) => {
    const baseColors = [
      `${BRAND_COLORS.primary.blue}E6`, // 90% opacity
      `${BRAND_COLORS.accent.red}E6`,
      `${BRAND_COLORS.primary.blueDark}CC`, // 80% opacity
      `${BRAND_COLORS.accent.redDark}CC`,
    ];

    const speedFactor = Math.min(speed / 10, 1);
    const hue = (x + y) % 360;

    if (speedFactor > 0.7) {
      return `hsla(${hue}, 80%, 70%, 0.9)`;
    } else if (speedFactor > 0.4) {
      return `hsla(${hue + 60}, 75%, 65%, 0.7)`;
    } else {
      return baseColors[Math.floor((x + y) / 100) % baseColors.length];
    }
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      const speed = calculateSpeed(currentPos, lastMousePosition);

      setMousePosition(currentPos);
      setLastMousePosition(currentPos);

      if (!isVisible) {
        setIsVisible(true);
      }

      // Add new trail point
      const newPoint: TrailPoint = {
        id: Date.now() + Math.random(),
        x: currentPos.x,
        y: currentPos.y,
        timestamp: Date.now(),
        opacity: 1,
        size: Math.max(4, Math.min(12, 6 + speed * 0.5)),
        color: getDynamicColor(speed, currentPos.x, currentPos.y),
      };

      setTrailPoints((prev) => [...prev.slice(-15), newPoint]);
    },
    [calculateSpeed, getDynamicColor, isVisible, lastMousePosition]
  );

  // Hide cursor when mouse leaves window
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Setup mouse event listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

  // Animate trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrailPoints((prev) =>
        prev
          .map((point) => ({
            ...point,
            opacity: point.opacity * 0.95,
            size: point.size * 0.98,
          }))
          .filter((point) => point.opacity > 0.1)
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {trailPoints.map((point) => (
        <TrailParticle
          key={point.id}
          x={point.x}
          y={point.y}
          opacity={point.opacity}
          size={point.size}
          color={point.color}
        />
      ))}
    </>
  );
};

export default CursorTrail;
