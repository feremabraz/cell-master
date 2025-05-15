import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRandomInt, createRandomTable, type RandomTable } from '@lib/random';

describe('Random Utility Functions', () => {
  // Mock Math.random for deterministic tests
  beforeEach(() => {
    vi.spyOn(global.Math, 'random').mockImplementation(() => 0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getRandomInt', () => {
    test('returns the middle value when Math.random is 0.5', () => {
      expect(getRandomInt(1, 5)).toBe(3);
      expect(getRandomInt(0, 10)).toBe(5);
    });

    test('handles min and max being the same', () => {
      expect(getRandomInt(7, 7)).toBe(7);
    });

    test('handles negative ranges', () => {
      // With Math.random mocked to 0.5, and range -10 to -5
      // We expect: Math.floor(0.5 * (-5 - -10 + 1)) + -10 = Math.floor(0.5 * 6) + -10 = 3 + -10 = -7
      expect(getRandomInt(-10, -5)).toBe(-7);
    });
  });

  describe('createRandomTable', () => {
    test('creates a table with correct structure', () => {
      const items = ['item1', 'item2', 'item3'];
      const table = createRandomTable('Test Table', 'A test table', items);
      
      expect(table.name).toBe('Test Table');
      expect(table.description).toBe('A test table');
      expect(table.table).toEqual(items);
      expect(typeof table.id).toBe('string');
      expect(table.id.length).toBeGreaterThan(0);
    });

    test('roll method returns an item from the table', () => {
      const items = ['item1', 'item2', 'item3', 'item4', 'item5'];
      const table = createRandomTable('Test Table', 'A test table', items);
      
      // With mocked random at 0.5, should return middle item
      expect(table.roll()).toBe('item3');
    });

    test('handles a table with a single item', () => {
      const items = ['only item'];
      const table = createRandomTable('Single Item', 'A single item table', items);
      
      expect(table.roll()).toBe('only item');
    });
  });
}); 