/**
 * Custom Hook for Particle System Management
 * Handles particle generation, updates, and cleanup with performance optimization
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { PARTICLE_CONFIG, BRAND_COLORS } from "../theme/constants";

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  color: string;
  opacity: number;
}

interface UseParticlesProps {
  isActive?: boolean;
  magneticRange?: number;
  particleCount?: number;
}

interface UseParticlesReturn {
  particles: Particle[];
  mousePosition: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useParticles = ({
  isActive = true,
  magneticRange = PARTICLE_CONFIG.magneticRange,
  particleCount = PARTICLE_CONFIG.count,
}: UseParticlesProps = {}): UseParticlesReturn => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);

  // Generate random particle properties
  const generateParticle = useCallback((): Particle => {
    const colors = [
      BRAND_COLORS.primary.blue,
      BRAND_COLORS.primary.blueLight,
      BRAND_COLORS.accent.red,
      BRAND_COLORS.neutral.whiteAlpha[70],
    ];

    return {
      id: ++particleIdRef.current,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size:
        Math.random() * (PARTICLE_CONFIG.maxSize - PARTICLE_CONFIG.minSize) +
        PARTICLE_CONFIG.minSize,
      duration:
        Math.random() *
          (PARTICLE_CONFIG.maxDuration - PARTICLE_CONFIG.minDuration) +
        PARTICLE_CONFIG.minDuration,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.3,
    };
  }, []);

  // Initialize particles
  const initializeParticles = useCallback(() => {
    if (!isActive) return;

    const newParticles = Array.from(
      { length: particleCount },
      generateParticle
    );
    setParticles(newParticles);
  }, [isActive, particleCount, generateParticle]);

  // Update mouse position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Magnetic effect for particles
  const updateParticles = useCallback(() => {
    if (!isActive) return;

    setParticles((prevParticles) =>
      prevParticles.map((particle) => {
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply magnetic effect if mouse is nearby
        if (distance < magneticRange) {
          const force = ((magneticRange - distance) / magneticRange) * 0.02;
          const angle = Math.atan2(dy, dx);

          return {
            ...particle,
            x: particle.x + Math.cos(angle) * force * 10,
            y: particle.y + Math.sin(angle) * force * 10,
            opacity: Math.min(1, particle.opacity + force * 2),
          };
        }

        // Gradually return to original opacity
        return {
          ...particle,
          opacity: Math.max(0.3, particle.opacity - 0.01),
        };
      })
    );
  }, [isActive, mousePosition, magneticRange]);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!isActive) return;

    // Regenerate particles on resize to maintain proper distribution
    initializeParticles();
  }, [isActive, initializeParticles]);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      updateParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, updateParticles]);

  // Event listeners setup
  useEffect(() => {
    if (!isActive) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, handleMouseMove, handleResize]);

  // Initialize particles on mount
  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  // Periodic particle regeneration
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Replace a few particles periodically to keep the effect fresh
      setParticles((prevParticles) => {
        const newParticles = [...prevParticles];
        const particlesToReplace = Math.ceil(particleCount * 0.1); // Replace 10% of particles

        for (let i = 0; i < particlesToReplace; i++) {
          const randomIndex = Math.floor(Math.random() * newParticles.length);
          newParticles[randomIndex] = generateParticle();
        }

        return newParticles;
      });
    }, PARTICLE_CONFIG.regenerationInterval);

    return () => clearInterval(interval);
  }, [isActive, particleCount, generateParticle]);

  return {
    particles,
    mousePosition,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
  };
};
