'use client';

import { useAtom } from 'jotai';
import { Card } from '@/components/ui/card';
import { GameHistory } from './game-story';
import { CommandInput } from './command-input';
import { 
  gameHistoryAtom, 
  locationAtom, 
  inventoryAtom, 
  isLoadingAtom, 
  userIdAtom,
  isInitializedAtom
} from '@/store/game-store';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

interface GameState {
  location: string;
  inventory: string[];
  gameHistory: string[];
}

async function initializeGame(userId: string): Promise<GameState> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: 'start game',
      body: {
        command: 'start game',
        gameHistory: ['Welcome to Cell Master, a text-based adventure game!'],
        userId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize game with AI');
  }

  const initialGreeting = await response.text();

  return {
    location: 'start',
    inventory: [],
    gameHistory: ['Welcome to Cell Master, a text-based adventure game!', initialGreeting],
  };
}

async function processCommand({ command, gameHistory, userId }: { 
  command: string; 
  gameHistory: string[]; 
  userId: string;
}): Promise<Response> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: command,
      body: {
        command,
        gameHistory,
        userId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  return response;
}

export function TextAdventure() {
  const [gameHistory, setGameHistory] = useAtom(gameHistoryAtom);
  const [, setLocation] = useAtom(locationAtom);
  const [, setInventory] = useAtom(inventoryAtom);
  // biome-ignore lint/correctness/noUnusedVariables: Used in the GameHistory component
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [userId] = useAtom(userIdAtom);
  const [isInitialized, setIsInitialized] = useAtom(isInitializedAtom);

  // Initialize game state with React Query
  const { data } = useQuery<GameState>({
    queryKey: ['gameInit', userId],
    queryFn: () => initializeGame(userId),
    staleTime: Number.POSITIVE_INFINITY,
    retry: 1,
  });

  // Extract initialState with proper typing
  const initialState = data as GameState | undefined;

  // Handle initialization errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('game')) {
        console.error('Failed to initialize game:', event.error);
        setGameHistory(['Failed to initialize game. Please refresh to try again.']);
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [setGameHistory]);

  // React Query mutation for command processing
  const { mutateAsync: processCommandMutation } = useMutation<
    Response, 
    Error,
    { command: string; gameHistory: string[]; userId: string }
  >({
    mutationFn: processCommand,
    onMutate: (variables) => {
      // Update history optimistically
      setGameHistory((prev) => [...prev, `> ${variables.command}`]);
      setIsLoading(true);
    },
    onError: (error) => {
      console.error('Error processing command:', error);
      setGameHistory((prev) => [...prev, 'Something went wrong. Please try again.']);
      setIsLoading(false);
    },
  });

  // Update atoms when initial state is loaded
  useEffect(() => {
    if (initialState && !isInitialized) {
      setLocation(initialState.location);
      setInventory(initialState.inventory);
      setGameHistory(initialState.gameHistory);
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [initialState, isInitialized, setLocation, setInventory, setGameHistory, setIsLoading, setIsInitialized]);

  // Function to handle user commands using React Query mutation
  const handleCommand = async (command: string) => {
    try {
      const response = await processCommandMutation({ command, gameHistory, userId });
      
      // Process the response as a stream to show text as it arrives
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is null');

      let accumulatedText = '';

      // Create a temporary array to hold the updated history
      const newHistory = [...gameHistory, `> ${command}`];

      // Read the stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        accumulatedText += chunk;

        // Update the game history with the accumulated text so far
        // This creates the streaming effect in the UI
        setGameHistory([...newHistory, accumulatedText]);
      }

      setIsLoading(false);
    } catch {
      // Error handling is already in the mutation's onError
    }
  };

  return (
    <Card className="w-full max-w-3xl h-[80vh] flex flex-col bg-black border-2 border-green-500 p-4 rounded-none">
      {/* Display game history */}
      <div className="flex-1 overflow-y-auto">
        <GameHistory />
      </div>

      {/* Command input form */}
      <CommandInput onSubmitCommand={handleCommand} />
    </Card>
  );
}
