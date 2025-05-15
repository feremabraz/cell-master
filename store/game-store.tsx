import { atom } from 'jotai';
import { clientGameMap } from '@lib/client/game-data';
import { QueryClient } from '@tanstack/react-query';

// Helper function to generate a UUID for user identification
function generateUserId() {
  return crypto.randomUUID();
}

// Game state atoms
export const userIdAtom = atom(generateUserId());
export const locationAtom = atom('start');
export const inventoryAtom = atom<string[]>([]);
export const gameHistoryAtom = atom<string[]>(['Loading game state...']);
export const gameMapAtom = atom(clientGameMap);
export const isLoadingAtom = atom(true);

// Derived atoms
export const currentRoomAtom = atom((get) => {
  const location = get(locationAtom);
  const gameMap = get(gameMapAtom);
  return gameMap[location];
});

export const availableExitsAtom = atom((get) => {
  const currentRoom = get(currentRoomAtom);
  return currentRoom?.exits ? Object.keys(currentRoom.exits) : [];
});

export const roomItemsAtom = atom((get) => {
  const currentRoom = get(currentRoomAtom);
  return currentRoom?.items || [];
});

// New atoms to replace useState instances
export const queryClientAtom = atom(() => new QueryClient());

export const isInitializedAtom = atom(false);

// Mobile detection atom for responsive UI
export const isMobileAtom = atom<boolean | undefined>(undefined);
