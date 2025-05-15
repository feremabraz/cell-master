'use client';

import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { noiseOpacityAtom, noiseSpeedAtom } from '@store/crt-effect-store';

export function NoiseEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCountRef = useRef(0);

  // Get settings from store
  const noiseOpacity = useAtomValue(noiseOpacityAtom);
  const noiseSpeed = useAtomValue(noiseSpeedAtom);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Generate static noise
    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Random grayscale value with controlled opacity
        const value = Math.floor(Math.random() * 255);
        data[i] = value; // r
        data[i + 1] = value; // g
        data[i + 2] = value; // b
        data[i + 3] = Math.random() * 20 * (noiseOpacity / 0.3); // alpha (scaled by noiseOpacity)
      }

      ctx.putImageData(imageData, 0, 0);
    };

    // Initial setup
    resize();
    window.addEventListener('resize', resize);

    // Animate noise
    let animationId: number;
    const animateNoise = () => {
      // Only update noise every noiseSpeed frames for performance
      frameCountRef.current += 1;
      if (frameCountRef.current >= noiseSpeed) {
        frameCountRef.current = 0;
        generateNoise();
      }
      animationId = requestAnimationFrame(animateNoise);
    };
    animateNoise();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [noiseOpacity, noiseSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[6] mix-blend-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: noiseOpacity,
      }}
    />
  );
}
