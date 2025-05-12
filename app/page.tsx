'use client';

import { TextAdventure } from '@/components/text-adventure';
import { EnhancedCRTEffect } from '@/components/crt-effect';
import { CRTControls } from '@/components/crt-controls';
import { CRTEffectWrapper } from '@/components/crt-effect-wrapper';
import { useAtomValue } from 'jotai';
import { showControlsAtom } from '@/store/crt-effect-store';

export default function Home() {
  const showControls = useAtomValue(showControlsAtom);

  return (
    <main className="min-h-screen bg-black p-4 flex items-center justify-center">
      {/* Wrap your TextAdventure with the CRTEffectWrapper */}
      <CRTEffectWrapper>
        <TextAdventure />
      </CRTEffectWrapper>

      {/* Add the global CRT effects */}
      <EnhancedCRTEffect />

      {/* Add the controls (can be removed later) */}
      {showControls && <CRTControls />}
    </main>
  );
}
