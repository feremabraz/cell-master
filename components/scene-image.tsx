'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';
import { sceneImageUrlAtom } from '@/store/crt-effect-store';

interface SceneImageProps {
  imageUrl: string;
  alt: string;
}

export function SceneImage({ imageUrl, alt }: SceneImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sceneImageUrl, setSceneImageUrl] = useAtom(sceneImageUrlAtom);

  // Set the image URL in the atom if provided as a prop
  useEffect(() => {
    if (imageUrl) {
      setSceneImageUrl(imageUrl);
    } else if (!sceneImageUrl) {
      // Set default image if no URL is provided and atom is empty
      setSceneImageUrl(
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Wu0SISCKu7ZBqJGoiWgTQTy8iTBoaw.webp'
      );
    }
  }, [imageUrl, sceneImageUrl, setSceneImageUrl]);

  // Reset states when the image URL changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [sceneImageUrl]);

  return (
    <div className="relative w-full h-full bg-black border-2 border-green-500 overflow-hidden flex items-center justify-center">
      {sceneImageUrl && !hasError ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative"
          >
            {/* Next.js Image component with proper error handling */}
            <img
              src={sceneImageUrl || '/placeholder.svg'}
              alt={alt}
              className="object-cover w-full h-full"
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                console.error('Failed to load image:', sceneImageUrl);
                setHasError(true);
              }}
            />
          </motion.div>

          {/* Loading indicator */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center text-green-500 font-mono">
              <div className="text-center">
                <div className="text-xl mb-2">Loading Scene...</div>
                <div className="cursor-blink">_</div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Error or no image state
        <div className="text-center text-green-500 font-mono p-4">
          <div className="text-xl mb-2">
            {hasError ? 'Failed to load scene image' : 'No scene image available'}
          </div>
          <div className="text-sm mb-4">
            {hasError
              ? 'There was an error loading the image. Please try again.'
              : 'A scene image will appear here when available.'}
          </div>
          <div className="border-2 border-green-500 p-8 inline-block">
            <div className="text-4xl">[IMAGE]</div>
          </div>
        </div>
      )}
    </div>
  );
}
