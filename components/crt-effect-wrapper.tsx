'use client';

import type React from 'react';
import { useAtomValue } from 'jotai';
import { curvatureIntensityAtom, glowIntensityAtom } from '@/store/crt-effect-store';

interface CRTEffectWrapperProps {
  children: React.ReactNode;
}

export function CRTEffectWrapper({ children }: CRTEffectWrapperProps) {
  const curvatureIntensity = useAtomValue(curvatureIntensityAtom);
  const glowIntensity = useAtomValue(glowIntensityAtom);

  return (
    <div
      className="crt-container relative"
      style={{
        borderRadius: `${curvatureIntensity / 2}%`,
        boxShadow: `0 0 ${curvatureIntensity * 2}px rgba(34, 197, 94, ${glowIntensity / 2})`,
      }}
    >
      {children}
    </div>
  );
}
