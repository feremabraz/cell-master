import type { GameMap } from '@lib/types';

// Basic client-side game map for initial rendering
export const clientGameMap: GameMap = {
  start: {
    id: 'start',
    description:
      'A dimly lit room with a strange device on a table. A heavy metal door stands to the north.',
    exits: {
      north: 'corridor',
    },
    items: ['device'],
  },
  corridor: {
    id: 'corridor',
    description:
      'A long corridor with flickering lights. Doors lead east and west, and the room you came from is to the south.',
    exits: {
      east: 'lab',
      west: 'storage',
      south: 'start',
    },
  },
  lab: {
    id: 'lab',
    description: 'A laboratory with various scientific equipment. Some of it looks damaged.',
    exits: {
      west: 'corridor',
    },
    items: ['keycard'],
  },
  storage: {
    id: 'storage',
    description:
      'A storage room with shelves of supplies. Most are empty, but some contain useful items.',
    exits: {
      east: 'corridor',
    },
    items: ['medkit'],
  },
};
