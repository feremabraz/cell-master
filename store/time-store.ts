import { atom } from 'jotai';
import type { 
  GameTime, 
  TimeTracking, 
  TimeOfDayPhase, 
  Season, 
  TimedEffect 
} from '@rules/time/types';
import { 
  createNewGameTime, 
  determineTimeOfDayPhase, 
  determineSeason, 
  advanceTime,
  updateTimedEffects,
  getTimeDescription,
  getWeatherModifiers,
  getLightLevel
} from '@rules/time/timeSystem';

// Create base atoms
export const gameTimeAtom = atom<GameTime>(createNewGameTime());
export const inCombatAtom = atom<boolean>(false);
export const activeEffectsAtom = atom<TimedEffect[]>([]);

// Computed/derived atoms
export const timePhaseAtom = atom<TimeOfDayPhase>((get) => {
  const time = get(gameTimeAtom);
  return determineTimeOfDayPhase(time.hours);
});

export const seasonAtom = atom<Season>((get) => {
  const time = get(gameTimeAtom);
  return determineSeason(time.months);
});

export const timeTrackingAtom = atom<TimeTracking>((get) => {
  return {
    gameTime: get(gameTimeAtom),
    phase: get(timePhaseAtom),
    season: get(seasonAtom),
    inCombat: get(inCombatAtom),
    activeEffects: get(activeEffectsAtom)
  };
});

export const lightLevelAtom = atom<number>((get) => {
  const phase = get(timePhaseAtom);
  return getLightLevel(phase);
});

export const weatherModifiersAtom = atom((get) => {
  const season = get(seasonAtom);
  const phase = get(timePhaseAtom);
  return getWeatherModifiers(season, phase);
});

export const timeDescriptionAtom = atom<string>((get) => {
  const time = get(gameTimeAtom);
  return getTimeDescription(time);
});

export const isDaylightAtom = atom<boolean>((get) => {
  const phase = get(timePhaseAtom);
  return ['Dawn', 'Morning', 'Noon', 'Afternoon', 'Dusk'].includes(phase);
});

// Actions for modifying time
export const advanceTimeAtom = atom(
  null,
  (get, set, { amount, unit }: { amount: number; unit: 'Round' | 'Turn' | 'Hour' | 'Day' | 'Week' | 'Month' | 'Year' }) => {
    const currentTime = get(gameTimeAtom);
    const effects = get(activeEffectsAtom);
    
    // Update the game time
    const newTime = advanceTime(currentTime, amount, unit);
    
    // Process effects that may expire
    const updatedEffects = updateTimedEffects(effects, currentTime, amount, unit);
    
    // Update atoms
    set(gameTimeAtom, newTime);
    set(activeEffectsAtom, updatedEffects);
    
    // Return the new time state
    return {
      gameTime: newTime,
      phase: determineTimeOfDayPhase(newTime.hours),
      season: determineSeason(newTime.months),
      inCombat: get(inCombatAtom),
      activeEffects: updatedEffects
    };
  }
);

// Toggle combat state
export const toggleCombatAtom = atom(
  null,
  (get, set) => {
    const inCombat = get(inCombatAtom);
    set(inCombatAtom, !inCombat);
  }
);

// Add a timed effect
export const addTimedEffectAtom = atom(
  null,
  (get, set, effect: TimedEffect) => {
    const effects = get(activeEffectsAtom);
    set(activeEffectsAtom, [...effects, effect]);
  }
);

// Remove a timed effect by ID
export const removeTimedEffectAtom = atom(
  null,
  (get, set, effectId: string) => {
    const effects = get(activeEffectsAtom);
    set(activeEffectsAtom, effects.filter(effect => effect.id !== effectId));
  }
);

// Reset time to a new day (e.g., after resting)
export const resetToNewDayAtom = atom(
  null,
  (get, set) => {
    const currentTime = get(gameTimeAtom);
    set(gameTimeAtom, {
      ...currentTime,
      rounds: 0,
      turns: 0,
      hours: 6, // Dawn
      days: currentTime.days + 1
    });
  }
); 