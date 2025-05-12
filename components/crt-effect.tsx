'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAtomValue } from 'jotai';
import { NoiseEffect } from './noise-effect';
import {
  scanlineOpacityAtom,
  scanlineSpacingAtom,
  scanlineAngleAtom,
  scanlineColorAtom,
  scanlineBlendModeAtom,
  scanlineAnimationSpeedAtom,
  flickerIntensityAtom,
  flickerSpeedAtom,
  glowIntensityAtom,
  glowSizeAtom,
  curvatureIntensityAtom,
  vignetteIntensityAtom,
} from '@/store/crt-effect-store';

export function EnhancedCRTEffect() {
  const [flickerValue, setFlickerValue] = useState(1);
  const [scanlineOffset, setScanlineOffset] = useState(0);

  // Get settings from store
  const scanlineOpacity = useAtomValue(scanlineOpacityAtom);
  const scanlineSpacing = useAtomValue(scanlineSpacingAtom);
  const scanlineAngle = useAtomValue(scanlineAngleAtom);
  const scanlineColor = useAtomValue(scanlineColorAtom);
  const scanlineBlendMode = useAtomValue(scanlineBlendModeAtom);
  const scanlineAnimationSpeed = useAtomValue(scanlineAnimationSpeedAtom);
  const flickerIntensity = useAtomValue(flickerIntensityAtom);
  const flickerSpeed = useAtomValue(flickerSpeedAtom);
  const glowIntensity = useAtomValue(glowIntensityAtom);
  const glowSize = useAtomValue(glowSizeAtom);
  const curvatureIntensity = useAtomValue(curvatureIntensityAtom);
  const vignetteIntensity = useAtomValue(vignetteIntensityAtom);

  // Random flicker effect
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      // Random value between 0.85 and 1.15
      const newFlicker = 0.85 + Math.random() * 0.3;
      setFlickerValue(newFlicker);
    }, flickerSpeed);

    return () => clearInterval(flickerInterval);
  }, [flickerSpeed]);

  // Moving scanlines
  useEffect(() => {
    const scanlineInterval = setInterval(() => {
      setScanlineOffset((prev) => (prev + 1) % 100);
    }, scanlineAnimationSpeed);

    return () => clearInterval(scanlineInterval);
  }, [scanlineAnimationSpeed]);

  return (
    <>
      {/* Noise effect */}
      <NoiseEffect />

      {/* Enhanced scanlines - more visible */}
      <div
        className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
        style={{
          backgroundImage: `repeating-linear-gradient(
            ${scanlineAngle}deg,
            rgba(${scanlineColor}, ${scanlineOpacity}) 0px,
            rgba(${scanlineColor}, ${scanlineOpacity}) ${scanlineSpacing / 2}px,
            transparent ${scanlineSpacing / 2}px,
            transparent ${scanlineSpacing}px
          )`,
          backgroundSize: `100% ${scanlineSpacing}px`,
          transform: `translateY(${scanlineOffset}%)`,
          mixBlendMode: scanlineBlendMode,
        }}
      />

      {/* Enhanced screen glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[4]"
        style={{
          boxShadow: `inset 0 0 ${glowSize}px rgba(34, 197, 94, ${glowIntensity})`,
          background: `radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, ${glowIntensity * 1.33}) 100%
          )`,
        }}
      />

      {/* Enhanced screen curvature - more pronounced */}
      <div
        className="pointer-events-none fixed inset-0 z-[3]"
        style={{
          borderRadius: `${curvatureIntensity}%`,
          boxShadow: `inset 0 0 ${curvatureIntensity * 4}px rgba(0, 0, 0, 0.7)`,
        }}
      />

      {/* Enhanced vignette effect */}
      <div
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background: `radial-gradient(
            circle at center,
            transparent ${50 - curvatureIntensity * 2}%,
            rgba(0, 0, 0, ${vignetteIntensity}) 100%
          )`,
        }}
      />

      {/* Enhanced flicker effect - more pronounced */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1] bg-black opacity-0"
        animate={{
          opacity: Math.abs(flickerValue - 1) * flickerIntensity,
        }}
        transition={{ duration: 0.05 }}
      />
    </>
  );
}
