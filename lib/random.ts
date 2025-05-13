import { nanoid } from 'nanoid';
import type { CharacterRace, CharacterSex } from '@/rules/types';

export interface RandomTable<T> {
  id: string;
  name: string;
  description?: string;
  table: T[];
  roll: () => T;
}

export interface RandomNameRequest {
  race: CharacterRace;
  sex: CharacterSex;
  nameType: 'full' | 'first' | 'last';
  style: 'fantasy' | 'medieval' | 'noble' | 'common';
}

// Simple utility for random number generation
export const getRandomInt = (min: number, max: number): number => {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
};

// Factory function to create random tables
export const createRandomTable = <T>(
  name: string,
  description: string,
  items: T[]
): RandomTable<T> => {
  return {
    id: nanoid(),
    name,
    description,
    table: items,
    roll: () => items[getRandomInt(0, items.length - 1)],
  };
};
