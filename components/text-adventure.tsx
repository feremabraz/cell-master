'use client';

import { useAtom } from 'jotai';
import { Card } from '@/components/ui/card';
import { GameHistory } from './game-story';
import { CommandInput } from './command-input';
import { gameHistoryAtom, locationAtom, inventoryAtom, isLoadingAtom } from '@/store/game-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function TextAdventure() {
  // Use Jotai atoms instead of React useState
  const [gameHistory, setGameHistory] = useAtom(gameHistoryAtom);
  const [, setLocation] = useAtom(locationAtom);
  const [, setInventory] = useAtom(inventoryAtom);
  // biome-ignore lint/correctness/noUnusedVariables: Used in the GameHistory component
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  // We're handling streaming responses directly with fetch in the handleCommand function

  // Initialize game state
  const { data: initialState } = useQuery({
    queryKey: ['gameInit'],
    queryFn: async () => {
      try {
        // Call the AI to generate an initial greeting/scene
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
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize game with AI');
        }

        // Get the response text and clean it if needed
        let initialGreeting = await response.text();

        // Remove any metadata or formatting that might be in the response
        // This regex looks for JSON-like content or numbered chunks and removes them
        initialGreeting = initialGreeting
          .replace(/[\w]+:\{.*?\}/g, '') // Remove JSON objects
          .replace(/\d+:"/g, '') // Remove numbered chunks
          .replace(/"\s*\d+:/g, '') // Remove trailing numbers
          .replace(/[\w]+:\{.*$/g, '') // Remove incomplete JSON
          .replace(/^f:|^e:|^d:/g, '') // Remove prefixes
          .trim(); // Remove extra whitespace

        return {
          location: 'start',
          inventory: [],
          gameHistory: [
            'Welcome to Cell Master, a text-based adventure game!',
            initialGreeting,
            'What would you like to do?',
          ],
        };
      } catch (error) {
        console.error('Failed to initialize game:', error);
        // Fallback to a default response if AI call fails
        return {
          location: 'start',
          inventory: [],
          gameHistory: [
            'Welcome to Cell Master, a text-based adventure game!',
            'You awaken in a dimly lit room, disoriented. As your eyes adjust, you notice a strange device on a nearby table, its surface glowing with an eerie blue light. A heavy metal door stands to the north, your only apparent exit.',
            'What would you like to do?',
          ],
        };
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
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
  }, [initialState, isInitialized, setLocation, setInventory, setGameHistory, setIsLoading]);

  // Function to handle user commands
  const handleCommand = async (command: string) => {
    // Add the command to history
    setGameHistory((prev) => [...prev, `> ${command}`]);
    setIsLoading(true);

    try {
      // Instead of using the complete function, we'll use fetch directly for more control
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
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

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
    } catch (error) {
      console.error('Error processing command:', error);
      setGameHistory((prev) => [...prev, 'Something went wrong. Please try again.']);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl h-[80vh] flex flex-col bg-black border-2 border-green-500 p-4 rounded-none">
      {/* Display game history */}
      <GameHistory />

      {/* Command input form */}
      <CommandInput onSubmitCommand={handleCommand} />
    </Card>
  );
}

