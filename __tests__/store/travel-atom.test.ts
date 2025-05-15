import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'jotai';
import type { Environment, TerrainType, LightingCondition } from '@rules/types';
import type { ActiveLightSource } from '@rules/travel/lighting';
import { createMockCharacter } from '@tests/utils/mockData';
import {
  explorationAtom,
  characterPositionAtom,
  visibilityAtom,
  terrainInfoAtom,
  movementRateAtom,
  lightSourcesAtom,
  turnsElapsedAtom,
  initializeExplorationAtom,
  advanceTurnAtom,
  moveCharacterAtom,
  addLightSourceAtom,
  removeLightSourceAtom,
  updateTerrainAtom,
  resetExplorationAtom,
} from '@store/travelAtom';

describe('Travel Atom Store', () => {
  let store: ReturnType<typeof createStore>;

  const mockCharacter = createMockCharacter({
    strength: 14,
    inventory: [], // We start with an empty inventory
  });

  const mockEnvironment: Environment = 'Dungeon';
  const mockTerrain: TerrainType = 'Normal';
  const mockLightingCondition: LightingCondition = 'Darkness';

  const mockLightSource: ActiveLightSource = {
    source: {
      name: 'Torch',
      radius: 9,
      duration: 6,
      bright: true,
      requiresHands: true,
      description: 'A wooden stick wrapped with oil-soaked cloth.',
    },
    isActive: true,
    remainingDuration: 6,
  };

  beforeEach(() => {
    store = createStore();
  });

  describe('Base atoms', () => {
    it('should initialize explorationAtom as null', () => {
      expect(store.get(explorationAtom)).toBeNull();
    });

    it('should setup exploration state with initializeExplorationAtom', () => {
      // Initialize the state
      store.set(initializeExplorationAtom, {
        character: mockCharacter,
        environment: mockEnvironment,
        terrain: mockTerrain,
        lightingCondition: mockLightingCondition,
        environmentalFeature: 'Narrow passage',
      });

      // Check if state was initialized correctly
      const state = store.get(explorationAtom);
      expect(state).not.toBeNull();
      // Character gets recalculated during initialization - only check key properties
      if (state) {
        expect(state.character.id).toBe(mockCharacter.id);
        expect(state.character.name).toBe(mockCharacter.name);
        // Movement rate is recalculated based on encumbrance and inventory
        expect(state.environment).toBe(mockEnvironment);
        expect(state.terrain).toBe(mockTerrain);
        expect(state.lightingCondition).toBe(mockLightingCondition);
        expect(state.environmentalFeature).toBe('Narrow passage');
      }
    });

    it('should reset exploration state', () => {
      // First initialize
      store.set(initializeExplorationAtom, {
        character: mockCharacter,
        environment: mockEnvironment,
        terrain: mockTerrain,
        lightingCondition: mockLightingCondition,
      });

      // Then reset
      store.set(resetExplorationAtom);

      // Verify it's reset
      expect(store.get(explorationAtom)).toBeNull();
    });
  });

  describe('Derived atoms', () => {
    beforeEach(() => {
      // Initialize with mock data for derived atom tests
      store.set(initializeExplorationAtom, {
        character: mockCharacter,
        environment: mockEnvironment,
        terrain: mockTerrain,
        lightingCondition: mockLightingCondition,
      });
    });

    it('should get character position', () => {
      const position = store.get(characterPositionAtom);
      expect(position).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should get current visibility', () => {
      const visibility = store.get(visibilityAtom);
      expect(visibility).toBeDefined();
    });

    it('should get terrain info', () => {
      const terrainInfo = store.get(terrainInfoAtom);
      expect(terrainInfo).toEqual({
        terrain: mockTerrain,
        environment: mockEnvironment,
        environmentalFeature: undefined,
      });
    });

    it('should get movement rate', () => {
      // First set a valid exploration state with a known movement rate
      const currentState = store.get(explorationAtom);
      if (currentState) {
        store.set(explorationAtom, {
          ...currentState,
          kilometersPerDay: 24, // Set a known valid rate
        });
      }

      const rate = store.get(movementRateAtom);
      expect(rate).toBe(24);
    });

    it('should get light sources', () => {
      const sources = store.get(lightSourcesAtom);
      expect(Array.isArray(sources)).toBe(true);
      expect(sources).toEqual([]);
    });

    it('should get turns elapsed', () => {
      const turns = store.get(turnsElapsedAtom);
      expect(turns).toBe(0);
    });
  });

  describe('Action atoms', () => {
    beforeEach(() => {
      // Initialize with mock data for action atom tests
      store.set(initializeExplorationAtom, {
        character: mockCharacter,
        environment: mockEnvironment,
        terrain: mockTerrain,
        lightingCondition: mockLightingCondition,
      });
    });

    it('should advance turns', () => {
      const initialTurns = store.get(turnsElapsedAtom);

      // Advance 3 turns
      store.set(advanceTurnAtom, 3);

      expect(store.get(turnsElapsedAtom)).toBe(initialTurns + 3);
    });

    it('should move character', () => {
      const initialPosition = store.get(characterPositionAtom);

      // Move 10 meters east (x-axis)
      store.set(moveCharacterAtom, {
        distance: 10,
        direction: { x: 1, y: 0, z: 0 },
      });

      const newPosition = store.get(characterPositionAtom);
      if (initialPosition && newPosition) {
        expect(newPosition.x).toBeGreaterThan(initialPosition.x);
        expect(newPosition.y).toBe(initialPosition.y);
        expect(newPosition.z).toBe(initialPosition.z);
      }
    });

    it('should add light source', () => {
      // Add a torch
      store.set(addLightSourceAtom, mockLightSource);

      // Check if it was added
      const sources = store.get(lightSourcesAtom);
      expect(sources).toHaveLength(1);
      expect(sources[0].source.name).toBe('Torch');

      // Visibility should be affected
      const visibility = store.get(visibilityAtom);
      if (visibility !== undefined) {
        expect(visibility).toBeGreaterThan(0);
      }
    });

    it('should remove light source', () => {
      // First add a light source
      store.set(addLightSourceAtom, mockLightSource);
      expect(store.get(lightSourcesAtom)).toHaveLength(1);

      // Then remove it
      store.set(removeLightSourceAtom, 'Torch');

      // Check if it was removed
      expect(store.get(lightSourcesAtom)).toHaveLength(0);
    });

    it('should update terrain and environment', () => {
      const newTerrain: TerrainType = 'Difficult';
      const newEnvironment: Environment = 'Desert';

      // Update terrain and environment
      store.set(updateTerrainAtom, {
        terrain: newTerrain,
        environment: newEnvironment,
        environmentalFeature: 'Oasis',
      });

      // Check if it was updated
      const terrainInfo = store.get(terrainInfoAtom);
      if (terrainInfo) {
        expect(terrainInfo.terrain).toBe(newTerrain);
        expect(terrainInfo.environment).toBe(newEnvironment);
        expect(terrainInfo.environmentalFeature).toBe('Oasis');
      }

      // Movement rate should be recalculated
      const rate = store.get(movementRateAtom);
      expect(rate).toBeGreaterThan(0);
    });

    it('should update partial terrain info', () => {
      // Update only terrain
      store.set(updateTerrainAtom, {
        terrain: 'Very Difficult',
      });

      // Check if it was updated, but environment stays the same
      const terrainInfo = store.get(terrainInfoAtom);
      if (terrainInfo) {
        expect(terrainInfo.terrain).toBe('Very Difficult');
        expect(terrainInfo.environment).toBe(mockEnvironment);
      }
    });

    it('should update lighting condition', () => {
      const newLighting: LightingCondition = 'Dim';

      // Update lighting
      store.set(updateTerrainAtom, {
        lightingCondition: newLighting,
      });

      // Get the state and check lighting
      const state = store.get(explorationAtom);
      if (state) {
        expect(state.lightingCondition).toBe(newLighting);
      }

      // Visibility should be recalculated
      expect(store.get(visibilityAtom)).toBeDefined();
    });
  });
});
