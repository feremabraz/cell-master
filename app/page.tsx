'use client';

import { TextAdventure } from '@components/text-adventure';
import { EnhancedCRTEffect } from '@components/crt-effect';
import { CRTControls } from '@components/crt-controls';
import { useAtom, useAtomValue } from 'jotai';
import { showControlsAtom, sceneImageUrlAtom } from '@store/crt-effect-store';
import { SceneImage } from '@components/scene-image';

export default function Home() {
  const showControls = useAtomValue(showControlsAtom);
  const [sceneImageUrl] = useAtom(sceneImageUrlAtom);

  return (
    <main className="min-h-screen bg-black p-4 flex items-center justify-center">
      {/* Main content layout */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl ">
        {/* Scene Image - takes 40% of the width on larger screens */}
        <div className="w-full md:w-2/5 h-[300px] md:h-[80vh]">
          <SceneImage imageUrl={sceneImageUrl} alt="Current scene" />
          {/* Debug info */}
          <div className="mt-2 text-green-500 text-xs font-mono">
            Image URL: {sceneImageUrl ? '✓' : 'None'}
          </div>
        </div>

        {/* Text Adventure - takes 60% of the width on larger screens */}
        <div className="w-full md:w-3/5 h-[60vh] md:h-[80vh]">
          <TextAdventure />
        </div>
      </div>

      {/* Add the global CRT effects */}
      <EnhancedCRTEffect />

      {/* Add the controls (can be removed later) */}
      {showControls && <CRTControls />}
    </main>
  );
}
