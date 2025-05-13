// Additional game data types beyond OSRIC

export interface Room {
  id: string;
  description: string;
  exits: Record<string, string>;
  items?: string[];
}

export interface GameMap {
  [locationId: string]: Room;
}

export interface GameState {
  location: string;
  inventory: string[];
  gameHistory: string[];
}
