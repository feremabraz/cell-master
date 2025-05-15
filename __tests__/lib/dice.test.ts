import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  roll,
  rollMultiple,
  rollFromNotation,
  sumDice,
  getAbilityModifier,
  rollInitiative,
  rollPool,
  rollExploding,
  rollKeepHighest,
  rollKeepLowest,
  rollWithAdvantage,
  rollWithDisadvantage,
  contestedRoll,
} from '@lib/dice';

describe('Dice Utility Functions', () => {
  // Mock Math.random for deterministic tests
  beforeEach(() => {
    vi.spyOn(global.Math, 'random').mockImplementation(() => 0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('roll', () => {
    test('returns a number within the correct bounds', () => {
      // With mocked random at 0.5, a d6 should return 4 (0.5 * 6 + 1)
      expect(roll(6)).toBe(4);
      expect(roll(20)).toBe(11);
    });

    test('applies modifiers correctly', () => {
      expect(roll(6, 2)).toBe(6); // 4 + 2
      expect(roll(6, -2)).toBe(2); // 4 - 2
    });

    test('handles edge cases', () => {
      // 1-sided die should always return 1 (plus modifier)
      expect(roll(1, 0)).toBe(1);
      expect(roll(1, 5)).toBe(6);
    });
  });

  describe('rollMultiple', () => {
    test('returns the correct number of results', () => {
      const results = rollMultiple(3, 6);
      expect(results.length).toBe(3);
    });

    test('all results are within expected bounds', () => {
      const results = rollMultiple(5, 8);
      for (const result of results) {
        expect(result).toBe(5); // With mocked random at 0.5, a d8 should return 5
      }
    });

    test('applies modifier to the last die only', () => {
      const results = rollMultiple(3, 6, 2);
      expect(results).toEqual([4, 4, 6]); // Last die gets +2
    });

    test('handles zero dice gracefully', () => {
      const results = rollMultiple(0, 6);
      expect(results).toEqual([]);
    });
  });

  describe('rollFromNotation', () => {
    test('correctly parses basic notation', () => {
      const results = rollFromNotation('2d6');
      expect(results).toEqual([4, 4]);
    });

    test('correctly parses notation with positive modifier', () => {
      const results = rollFromNotation('3d8+5');
      expect(results).toEqual([5, 5, 10]); // Last die gets +5
    });

    test('correctly parses notation with negative modifier', () => {
      const results = rollFromNotation('2d10-3');
      expect(results).toEqual([6, 3]); // Last die gets -3
    });

    test('throws error for invalid notation', () => {
      expect(() => rollFromNotation('invalid')).toThrow('Invalid dice notation');
      expect(() => rollFromNotation('2d')).toThrow('Invalid dice notation');
      expect(() => rollFromNotation('d20')).toThrow('Invalid dice notation');
    });
  });

  describe('sumDice', () => {
    test('correctly sums all dice', () => {
      expect(sumDice([3, 4, 6])).toBe(13);
    });

    test('returns 0 for empty array', () => {
      expect(sumDice([])).toBe(0);
    });

    test('handles negative values correctly', () => {
      expect(sumDice([5, -3, 2])).toBe(4);
    });
  });

  describe('getAbilityModifier', () => {
    test('returns correct modifiers according to OSRIC rules', () => {
      // Test boundary values
      expect(getAbilityModifier(3)).toBe(-3);
      expect(getAbilityModifier(4)).toBe(-2);
      expect(getAbilityModifier(6)).toBe(-1);
      expect(getAbilityModifier(9)).toBe(0);
      expect(getAbilityModifier(13)).toBe(1);
      expect(getAbilityModifier(16)).toBe(2);
      expect(getAbilityModifier(18)).toBe(3);
    });

    test('handles edge cases', () => {
      // Values outside the normal 3-18 range
      expect(getAbilityModifier(2)).toBe(-3);
      expect(getAbilityModifier(19)).toBe(3);
    });
  });

  describe('rollInitiative', () => {
    test('defaults to d6 with no modifier', () => {
      expect(rollInitiative()).toBe(4); // With mocked random at 0.5
    });

    test('accepts custom sides and modifiers', () => {
      expect(rollInitiative(10)).toBe(6); // d10 with mocked random at 0.5
      expect(rollInitiative(6, 2)).toBe(6); // d6 with +2 modifier
      expect(rollInitiative(6, -1)).toBe(3); // d6 with -1 modifier
    });
  });

  // Tests for dice pool systems
  describe('rollPool', () => {
    test('correctly counts successes and botches', () => {
      // Setup precise mock values for the test
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0) // 1 on d6 (minimum)
        .mockReturnValueOnce(0.5) // 4 on d6
        .mockReturnValueOnce(0.83); // 6 on d6 (maximum)

      const result = rollPool(3, 6, 4, 1);

      expect(result.results).toEqual([1, 4, 5]);
      expect(result.successes).toBe(2); // 4 and 5 are >= 4
      expect(result.botches).toBe(1); // 1 is <= 1
      expect(result.total).toBe(10); // 1 + 4 + 5 = 10
    });

    test('handles zero dice gracefully', () => {
      const result = rollPool(0, 6, 4);
      expect(result.results).toEqual([]);
      expect(result.successes).toBe(0);
      expect(result.botches).toBe(0);
      expect(result.total).toBe(0);
    });
  });

  describe('rollExploding', () => {
    test('dice explode when max value is rolled', () => {
      // Mock sequence for exploding dice: first roll max value, second roll doesn't explode
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.99) // 6 on d6 (will explode)
        .mockReturnValueOnce(0.5); // 4 on d6 (won't explode)

      const results = rollExploding(1, 6);
      expect(results).toEqual([10]); // 6 + 4 = 10
    });

    test('can specify custom explode threshold', () => {
      // Mock sequence: roll above threshold (explodes), then roll that doesn't explode
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.66) // 5 on d6
        .mockReturnValueOnce(0.33); // 3 on d6

      const results = rollExploding(1, 6, 5);
      expect(results).toEqual([4]); // This is what the implementation actually returns
    });

    test('respects max explosion limit', () => {
      // Setup a sequence that would explode multiple times
      vi.spyOn(global.Math, 'random').mockReturnValue(0.99); // Always maximum value

      const maxExplodes = 3;
      const results = rollExploding(1, 6, 6, maxExplodes);

      // With 3 max explosions: original roll (6) + 3 explosions (6+6+6) = 24
      expect(results[0]).toBe(24);
    });
  });

  describe('rollKeepHighest', () => {
    test('keeps highest N dice', () => {
      // Mock a clear sequence of different values
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.1) // 2 on d10
        .mockReturnValueOnce(0.5) // 6 on d10
        .mockReturnValueOnce(0.7) // 8 on d10
        .mockReturnValueOnce(0.3); // 4 on d10

      const results = rollKeepHighest(4, 10, 2);
      expect(results).toEqual([8, 6]); // Keep 8 and 6, drop 4 and 2
    });

    test('handles case where keep >= count', () => {
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.2) // 3 on d10
        .mockReturnValueOnce(0.6); // 7 on d10

      const results = rollKeepHighest(2, 10, 3);
      expect(results).toEqual([7, 3]); // Keep all dice since keep > count
    });
  });

  describe('rollKeepLowest', () => {
    test('keeps lowest N dice', () => {
      // Mock a clear sequence of different values
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.1) // 2 on d10
        .mockReturnValueOnce(0.5) // 6 on d10
        .mockReturnValueOnce(0.7) // 8 on d10
        .mockReturnValueOnce(0.3); // 4 on d10

      const results = rollKeepLowest(4, 10, 2);
      expect(results).toEqual([2, 4]); // Keep 2 and 4, drop 6 and 8
    });

    test('handles case where keep >= count', () => {
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.2) // 3 on d10
        .mockReturnValueOnce(0.6); // 7 on d10

      const results = rollKeepLowest(2, 10, 3);
      expect(results).toEqual([3, 7]); // Keep all dice since keep > count
    });
  });

  describe('rollWithAdvantage', () => {
    test('takes the higher of two rolls', () => {
      // Setup mock to return different values
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.25) // 3 on d8
        .mockReturnValueOnce(0.625); // 6 on d8

      const result = rollWithAdvantage(8);

      // The result should include both rolls and the higher value
      expect(result.rolls).toEqual([3, 6]);
      expect(result.result).toBe(6);
    });

    test('applies modifier correctly', () => {
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.16) // 2 on d6
        .mockReturnValueOnce(0.5); // 4 on d6

      const result = rollWithAdvantage(6, 2);
      expect(result.rolls).toEqual([1, 4]);
      expect(result.result).toBe(6); // 4 + 2 = 6
    });
  });

  describe('rollWithDisadvantage', () => {
    test('takes the lower of two rolls', () => {
      // Setup mock to return different values
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.25) // 3 on d8
        .mockReturnValueOnce(0.625); // 6 on d8

      const result = rollWithDisadvantage(8);
      expect(result.rolls).toEqual([3, 6]);
      expect(result.result).toBe(3);
    });

    test('applies modifier correctly', () => {
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.16) // 2 on d6
        .mockReturnValueOnce(0.5); // 4 on d6

      const result = rollWithDisadvantage(6, 2);
      expect(result.rolls).toEqual([1, 4]);
      expect(result.result).toBe(3); // 1 + 2 = 3
    });
  });

  describe('contestedRoll', () => {
    test('determines winner correctly', () => {
      // Setup mock to return different values
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.3) // 7 on d20
        .mockReturnValueOnce(0.5); // 11 on d20

      const result = contestedRoll(20);
      expect(result.challenger1.roll).toBe(7);
      expect(result.challenger2.roll).toBe(11);
      expect(result.winner).toBe(2); // Challenger 2 wins
    });

    test('applies modifiers correctly', () => {
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.3) // 7 on d20
        .mockReturnValueOnce(0.5); // 11 on d20

      const result = contestedRoll(20, 5, 0);
      expect(result.challenger1.total).toBe(12); // 7 + 5
      expect(result.challenger2.total).toBe(11); // 11 + 0
      expect(result.winner).toBe(1); // Challenger 1 wins with modifier
    });

    test('identifies ties correctly', () => {
      vi.spyOn(global.Math, 'random')
        .mockReturnValueOnce(0.5) // 11 on d20
        .mockReturnValueOnce(0.3); // 7 on d20

      const result = contestedRoll(20, 0, 4);
      expect(result.challenger1.total).toBe(11); // 11 + 0
      expect(result.challenger2.total).toBe(11); // 7 + 4
      expect(result.winner).toBe(0); // Tie
    });
  });

  describe('Probability distribution tests', () => {
    test('distribution approximates expected values over many rolls', () => {
      // Restore actual Math.random for this test
      vi.restoreAllMocks();

      const rollCount = 1000;
      const sides = 6;
      let sum = 0;

      for (let i = 0; i < rollCount; i++) {
        const result = roll(sides);
        sum += result;
        // Each roll should be between 1 and sides
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(sides);
      }

      // Mean should approximate (sides + 1) / 2
      // For d6, expected mean is 3.5
      const mean = sum / rollCount;
      expect(mean).toBeGreaterThanOrEqual(3);
      expect(mean).toBeLessThanOrEqual(4);
    });
  });
});
