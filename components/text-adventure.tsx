'use client';

import { useAtom } from 'jotai';
import { Card } from '@/components/ui/card';
import { GameHistory } from './game-story';
import { CommandInput } from './command-input';
import { gameHistoryAtom, locationAtom, inventoryAtom, isLoadingAtom } from '@/store/game-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function TextAdventure() {
  // Use Jotai atoms instead of React useState
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [gameHistory, setGameHistory] = useAtom(gameHistoryAtom);
  const [, setLocation] = useAtom(locationAtom);
  const [, setInventory] = useAtom(inventoryAtom);
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  // Initialize game state
  const { data: initialState } = useQuery({
    queryKey: ['gameInit'],
    queryFn: async () => {
      try {
        // This would normally call the API, but since it's not implemented yet,
        // we'll return a mock response
        return {
          location: 'start',
          inventory: [],
          gameHistory: [
            'Welcome to Cell Master, a text-based adventure game!',
            'You awaken in a dimly lit room, disoriented. As your eyes adjust, you notice a strange device on a nearby table, its surface glowing with an eerie blue light. A heavy metal door stands to the north, your only apparent exit.',
            'What would you like to do?',
          ],
        };
      } catch (error) {
        console.error('Failed to initialize game:', error);
        return null;
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  // Update atoms when initial state is loaded
  useEffect(() => {
    if (initialState) {
      setLocation(initialState.location);
      setInventory(initialState.inventory);
      setGameHistory(initialState.gameHistory);
      setIsLoading(false);
    }
  }, [initialState, setLocation, setInventory, setGameHistory, setIsLoading]);

  // Function to handle user commands
  const handleCommand = async (command: string) => {
    // Add the command to history
    setGameHistory((prev) => [...prev, `> ${command}`]);
    setIsLoading(true);

    try {
      // This would normally call the API, but since it's not implemented yet,
      // we'll simulate a response
      const response = {
        message: `You entered: ${command}. API integration coming soon!`,
        newLocation: undefined,
        inventoryChange: undefined,
      };

      // Update game history with response
      setGameHistory((prev) => [...prev, response.message]);

      // Update location if changed
      if (response.newLocation) {
        setLocation(response.newLocation);
      }

      // Update inventory if changed
      if (response.inventoryChange) {
        // TODO: Update inventory
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setGameHistory((prev) => [...prev, 'Something went wrong. Please try again.']);
    } finally {
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
