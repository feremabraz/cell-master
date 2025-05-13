import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  roll, 
  rollMultiple, 
  rollFromNotation, 
  sumDice, 
  getAbilityModifier,
  rollInitiative
} from '../../lib/dice';

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
