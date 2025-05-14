import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import {
  type ExplorationState,
  initializeExplorationState,
  advanceExplorationTurn,
  moveCharacter,
  calculateVisibility,
  calculateDailyMovement,
} from '../rules/travel';
import type { Character, Environment, TerrainType, LightingCondition } from '../rules/types';
import type { ActiveLightSource } from '../rules/travel/lighting';

export const explorationAtom = atomWithReset<ExplorationState | null>(null);

export const characterPositionAtom = atom((get) => get(explorationAtom)?.currentPosition);

export const visibilityAtom = atom((get) => get(explorationAtom)?.visibility);

export const terrainInfoAtom = atom((get) => {
  const state = get(explorationAtom);
  return state
    ? {
        terrain: state.terrain,
        environment: state.environment,
        environmentalFeature: state.environmentalFeature,
      }
    : null;
});

export const movementRateAtom = atom((get) => {
  const state = get(explorationAtom);
  return state ? state.kilometersPerDay : 0;
});

export const lightSourcesAtom = atom((get) => get(explorationAtom)?.activeLightSources || []);

export const turnsElapsedAtom = atom((get) => get(explorationAtom)?.turnsElapsed || 0);

export const initializeExplorationAtom = atom(
  null,
  (
    _get,
    set,
    params: {
      character: Character;
      environment: Environment;
      terrain: TerrainType;
      lightingCondition: LightingCondition;
      environmentalFeature?: string;
    }
  ) => {
    const { character, environment, terrain, lightingCondition, environmentalFeature } = params;
    const newState = initializeExplorationState(
      character,
      environment,
      terrain,
      lightingCondition,
      environmentalFeature
    );
    set(explorationAtom, newState);
  }
);

export const advanceTurnAtom = atom(null, (get, set, turnsToAdvance: number | undefined = 1) => {
  const currentState = get(explorationAtom);
  if (currentState) {
    const newState = advanceExplorationTurn(currentState, turnsToAdvance);
    set(explorationAtom, newState);
  }
});

export const moveCharacterAtom = atom(
  null,
  (get, set, params: { distance: number; direction: { x: number; y: number; z: number } }) => {
    const { distance, direction } = params;
    const currentState = get(explorationAtom);
    if (currentState) {
      const newState = moveCharacter(currentState, distance, direction);
      set(explorationAtom, newState);
    }
  }
);

export const addLightSourceAtom = atom(null, (get, set, lightSource: ActiveLightSource) => {
  const currentState = get(explorationAtom);
  if (currentState) {
    const updatedLightSources = [...currentState.activeLightSources, lightSource];
    const newVisibility = calculateVisibility(currentState.lightingCondition, updatedLightSources);

    set(explorationAtom, {
      ...currentState,
      activeLightSources: updatedLightSources,
      visibility: newVisibility,
    });
  }
});

export const removeLightSourceAtom = atom(null, (get, set, lightSourceName: string) => {
  const currentState = get(explorationAtom);
  if (currentState) {
    const updatedLightSources = currentState.activeLightSources.filter(
      (source) => source.source.name !== lightSourceName
    );
    const newVisibility = calculateVisibility(currentState.lightingCondition, updatedLightSources);

    set(explorationAtom, {
      ...currentState,
      activeLightSources: updatedLightSources,
      visibility: newVisibility,
    });
  }
});

export const updateTerrainAtom = atom(
  null,
  (
    get,
    set,
    params: {
      terrain?: TerrainType;
      environment?: Environment;
      environmentalFeature?: string;
      lightingCondition?: LightingCondition;
    }
  ) => {
    const currentState = get(explorationAtom);
    if (currentState) {
      const newState = {
        ...currentState,
        terrain: params.terrain || currentState.terrain,
        environment: params.environment || currentState.environment,
        environmentalFeature:
          params.environmentalFeature !== undefined
            ? params.environmentalFeature
            : currentState.environmentalFeature,
        lightingCondition: params.lightingCondition || currentState.lightingCondition,
      };

      // Recalculate movement rate and visibility based on new terrain and environment
      newState.kilometersPerDay = calculateDailyMovement(
        newState.character,
        newState.terrain,
        newState.environment,
        newState.environmentalFeature
      );

      newState.visibility = calculateVisibility(
        newState.lightingCondition,
        newState.activeLightSources
      );

      set(explorationAtom, newState);
    }
  }
);

// Reset atom to clear exploration state
export const resetExplorationAtom = atom(null, (_, set) => {
  set(explorationAtom, null);
});
