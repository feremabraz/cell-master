'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { queryClientAtom } from '@store/game-store';

export function Providers({ children }: { children: React.ReactNode }) {
  // We get the QueryClient from Jotai atom instead of useState
  const queryClient = useAtomValue(queryClientAtom);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
