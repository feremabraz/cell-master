import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'jotai';
import type { GameTime, TimedEffect } from '@rules/time/types';
import {
  gameTimeAtom,
  inCombatAtom,
  activeEffectsAtom,
  timePhaseAtom,
  seasonAtom,
  timeTrackingAtom,
  lightLevelAtom,
  weatherModifiersAtom,
  timeDescriptionAtom,
  isDaylightAtom,
  advanceTimeAtom,
  toggleCombatAtom,
  addTimedEffectAtom,
  removeTimedEffectAtom,
  resetToNewDayAtom
} from '@store/time-store';
import { createNewGameTime } from '@rules/time/timeSystem';

describe('Time Store', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe('Base atoms', () => {
    it('should initialize gameTimeAtom with default values', () => {
      const initialTime = store.get(gameTimeAtom);
      expect(initialTime).toEqual(createNewGameTime());
    });

    it('should initialize inCombatAtom as false', () => {
      expect(store.get(inCombatAtom)).toBe(false);
    });

    it('should initialize activeEffectsAtom as empty array', () => {
      expect(store.get(activeEffectsAtom)).toEqual([]);
    });
  });

  describe('Derived atoms', () => {
    it('should calculate timePhaseAtom based on current hour', () => {
      // Set the game time to 8:00 AM (already the default)
      const phase = store.get(timePhaseAtom);
      expect(phase).toBe('Morning');

      // Change the time to afternoon and check phase
      store.set(gameTimeAtom, { ...createNewGameTime(), hours: 14 });
      expect(store.get(timePhaseAtom)).toBe('Afternoon');
    });

    it('should calculate seasonAtom based on current month', () => {
      // Default is month 1, which is Winter
      expect(store.get(seasonAtom)).toBe('Winter');

      // Change to month 4 (Spring)
      store.set(gameTimeAtom, { ...createNewGameTime(), months: 4 });
      expect(store.get(seasonAtom)).toBe('Spring');
    });

    it('should combine values in timeTrackingAtom', () => {
      // Setup some state
      store.set(gameTimeAtom, createNewGameTime());
      store.set(inCombatAtom, true);
      store.set(activeEffectsAtom, []);

      // Check the derived atom
      const tracking = store.get(timeTrackingAtom);
      expect(tracking.inCombat).toBe(true);
      expect(tracking.phase).toBe('Morning');
      expect(tracking.season).toBe('Winter');
      expect(tracking.gameTime).toEqual(createNewGameTime());
    });

    it('should calculate light level based on time of day', () => {
      // Morning light level
      store.set(gameTimeAtom, { ...createNewGameTime(), hours: 8 });
      expect(store.get(lightLevelAtom)).toBe(9);

      // Evening light level
      store.set(gameTimeAtom, { ...createNewGameTime(), hours: 20 });
      expect(store.get(lightLevelAtom)).toBe(5);
    });

    it('should generate appropriate weather modifiers', () => {
      // Set to winter midnight
      store.set(gameTimeAtom, { ...createNewGameTime(), hours: 0, months: 1 });
      const winterNightMods = store.get(weatherModifiersAtom);
      
      // Set to summer noon
      store.set(gameTimeAtom, { ...createNewGameTime(), hours: 12, months: 7 });
      const summerDayMods = store.get(weatherModifiersAtom);
      
      expect(winterNightMods.temperature).toBeLessThan(summerDayMods.temperature);
      expect(winterNightMods.visibility).toBeLessThan(summerDayMods.visibility);
    });

    it('should generate a descriptive time string', () => {
      store.set(gameTimeAtom, { 
        rounds: 0,
        turns: 3,
        hours: 14, 
        days: 5,
        weeks: 2,
        months: 7,
        years: 1234
      });
      
      const description = store.get(timeDescriptionAtom);
      expect(description).toContain('afternoon');
      expect(description).toContain('summer');
    });

    it('should correctly determine if it is daylight', () => {
      // Morning (daylight)
      store.set(gameTimeAtom, { ...createNewGameTime(), hours: 10 });
      expect(store.get(isDaylightAtom)).toBe(true);
      
      // Night (not daylight)
      store.set(gameTimeAtom, { ...createNewGameTime(), hours: 22 });
      expect(store.get(isDaylightAtom)).toBe(false);
    });
  });

  describe('Action atoms', () => {
    it('should advance time correctly', () => {
      const initialTime = store.get(gameTimeAtom);
      
      store.set(advanceTimeAtom, { amount: 5, unit: 'Hour' });
      
      const newTime = store.get(gameTimeAtom);
      expect(newTime.hours).toBe(initialTime.hours + 5);
    });

    it('should advance time and handle effects', () => {
      // Setup an effect that should expire
      const mockExpire = vi.fn();
      const effect: TimedEffect = {
        id: 'test-effect',
        name: 'Test Effect',
        description: 'Effect for testing',
        duration: { type: 'Turn', value: 2 },
        remaining: { type: 'Turn', value: 2 },
        source: 'test',
        targetId: null,
        onExpire: mockExpire
      };
      
      store.set(activeEffectsAtom, [effect]);
      
      // Advance time enough to expire the effect
      store.set(advanceTimeAtom, { amount: 3, unit: 'Turn' });
      
      // Check if effect was removed
      expect(store.get(activeEffectsAtom)).toEqual([]);
      expect(mockExpire).toHaveBeenCalled();
    });

    it('should toggle combat state', () => {
      expect(store.get(inCombatAtom)).toBe(false);
      
      store.set(toggleCombatAtom);
      expect(store.get(inCombatAtom)).toBe(true);
      
      store.set(toggleCombatAtom);
      expect(store.get(inCombatAtom)).toBe(false);
    });

    it('should add timed effects', () => {
      const effect: TimedEffect = {
        id: 'test-effect',
        name: 'Test Effect',
        description: 'Effect for testing',
        duration: { type: 'Turn', value: 2 },
        remaining: { type: 'Turn', value: 2 },
        source: 'test',
        targetId: null,
        onExpire: vi.fn()
      };
      
      store.set(addTimedEffectAtom, effect);
      
      const effects = store.get(activeEffectsAtom);
      expect(effects).toHaveLength(1);
      expect(effects[0].id).toBe('test-effect');
    });

    it('should remove timed effects by ID', () => {
      const effect1: TimedEffect = {
        id: 'effect-1',
        name: 'Effect One',
        description: 'First effect',
        duration: { type: 'Turn', value: 2 },
        remaining: { type: 'Turn', value: 2 },
        source: 'test',
        targetId: null,
        onExpire: vi.fn()
      };
      
      const effect2: TimedEffect = {
        id: 'effect-2',
        name: 'Effect Two',
        description: 'Second effect',
        duration: { type: 'Turn', value: 3 },
        remaining: { type: 'Turn', value: 3 },
        source: 'test',
        targetId: null,
        onExpire: vi.fn()
      };
      
      store.set(activeEffectsAtom, [effect1, effect2]);
      
      // Remove the first effect
      store.set(removeTimedEffectAtom, 'effect-1');
      
      const effects = store.get(activeEffectsAtom);
      expect(effects).toHaveLength(1);
      expect(effects[0].id).toBe('effect-2');
    });

    it('should reset to a new day', () => {
      // Setup some time
      store.set(gameTimeAtom, {
        rounds: 5,
        turns: 4,
        hours: 22,
        days: 3,
        weeks: 1,
        months: 1,
        years: 1
      });
      
      store.set(resetToNewDayAtom);
      
      const newTime = store.get(gameTimeAtom);
      expect(newTime.rounds).toBe(0);
      expect(newTime.turns).toBe(0);
      expect(newTime.hours).toBe(6); // Dawn
      expect(newTime.days).toBe(4); // Incremented by 1
      expect(newTime.weeks).toBe(1); // Unchanged
      expect(newTime.months).toBe(1); // Unchanged
      expect(newTime.years).toBe(1); // Unchanged
    });
  });
}); 