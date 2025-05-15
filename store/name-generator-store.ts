import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import type { RandomNameRequest } from '@lib/random';

export const nameRequestAtom = atom<RandomNameRequest | null>(null);
export const nameResultAtom = atom<string | null>(null);
export const nameGenerationLoadingAtom = atom<boolean>(false);

// Hook for name generation using AI
export const useRandomNameGenerator = () => {
  const [, setNameRequest] = useAtom(nameRequestAtom);
  const [nameResult, setNameResult] = useAtom(nameResultAtom);
  const [isLoading, setIsLoading] = useAtom(nameGenerationLoadingAtom);

  const generateName = useCallback(
    async (options: RandomNameRequest) => {
      setIsLoading(true);
      setNameRequest(options);
      
      try {
        const response = await fetch('/api/random/name', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(options),
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate name');
        }
        
        const data = await response.json();
        setNameResult(data.name);
        return data.name;
      } catch (error) {
        console.error('Error generating name:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setNameRequest, setNameResult]
  );

  return {
    generateName,
    nameResult,
    isLoading,
  };
}; 