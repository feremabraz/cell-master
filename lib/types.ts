// Game data types

export interface Room {
  id: string;
  description: string;
  exits: Record<string, string>;
  items?: string[];
}

export interface GameMap {
  [locationId: string]: Room;
}

export interface InventoryChange {
  add?: string[];
  remove?: string[];
}

export interface CommandResponse {
  message: string;
  newLocation?: string;
  inventoryChange?: InventoryChange;
}

export interface GameState {
  userId: string;
  location: string;
  inventory: string[];
  gameHistory: string[];
}
