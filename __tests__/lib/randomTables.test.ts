import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  weatherTemperature, 
  weatherPrecipitation, 
  weatherWind, 
  generateWeather, 
  forestEncounters,
  plainsEncounters, 
  mountainEncounters, 
  dungeonEncounters, 
  generateEncounter,
  calamityEvents,
  fortuneEvents,
  generateRandomEvent
} from '@lib/randomTables';

describe('Random Tables', () => {
  // Mock Math.random for deterministic tests
  beforeEach(() => {
    vi.spyOn(global.Math, 'random').mockImplementation(() => 0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Weather Tables', () => {
    test('weatherTemperature returns expected value', () => {
      const midIndex = Math.floor(weatherTemperature.table.length / 2);
      expect(weatherTemperature.roll()).toBe(weatherTemperature.table[midIndex]);
    });

    test('weatherPrecipitation returns expected value', () => {
      const midIndex = Math.floor(weatherPrecipitation.table.length / 2);
      expect(weatherPrecipitation.roll()).toBe(weatherPrecipitation.table[midIndex]);
    });

    test('weatherWind returns expected value', () => {
      const midIndex = Math.floor(weatherWind.table.length / 2);
      expect(weatherWind.roll()).toBe(weatherWind.table[midIndex]);
    });

    test('generateWeather returns a properly formatted weather result', () => {
      const result = generateWeather('temperate', 'summer');
      
      expect(result).toHaveProperty('temperature');
      expect(result).toHaveProperty('precipitation');
      expect(result).toHaveProperty('wind');
      expect(result).toHaveProperty('description');
      
      // With mocked random, we should get deterministic middle values
      const tempMidIndex = Math.floor(weatherTemperature.table.length / 2);
      const precipMidIndex = Math.floor(weatherPrecipitation.table.length / 2);
      const windMidIndex = Math.floor(weatherWind.table.length / 2);
      
      expect(result.temperature).toBe(weatherTemperature.table[tempMidIndex]);
      expect(result.precipitation).toBe(weatherPrecipitation.table[precipMidIndex]);
      expect(result.wind).toBe(weatherWind.table[windMidIndex]);
      
      // Description should combine all three components
      expect(result.description).toBe(`${result.temperature}. ${result.precipitation}. ${result.wind}.`);
    });
  });

  describe('Encounter Tables', () => {
    test('forestEncounters returns expected value', () => {
      const midIndex = Math.floor(forestEncounters.table.length / 2);
      expect(forestEncounters.roll()).toBe(forestEncounters.table[midIndex]);
    });

    test('plainsEncounters returns expected value', () => {
      const midIndex = Math.floor(plainsEncounters.table.length / 2);
      expect(plainsEncounters.roll()).toBe(plainsEncounters.table[midIndex]);
    });

    test('mountainEncounters returns expected value', () => {
      const midIndex = Math.floor(mountainEncounters.table.length / 2);
      expect(mountainEncounters.roll()).toBe(mountainEncounters.table[midIndex]);
    });

    test('dungeonEncounters returns expected value', () => {
      const midIndex = Math.floor(dungeonEncounters.table.length / 2);
      expect(dungeonEncounters.roll()).toBe(dungeonEncounters.table[midIndex]);
    });

    test('generateEncounter selects appropriate table based on terrain', () => {
      const forestResult = generateEncounter('forest', 5);
      const forestMidIndex = Math.floor(forestEncounters.table.length / 2);
      expect(forestResult).toBe(forestEncounters.table[forestMidIndex]);
      
      const plainsResult = generateEncounter('plains', 5);
      const plainsMidIndex = Math.floor(plainsEncounters.table.length / 2);
      expect(plainsResult).toBe(plainsEncounters.table[plainsMidIndex]);
      
      const mountainResult = generateEncounter('mountain', 5);
      const mountainMidIndex = Math.floor(mountainEncounters.table.length / 2);
      expect(mountainResult).toBe(mountainEncounters.table[mountainMidIndex]);
      
      const dungeonResult = generateEncounter('dungeon', 5);
      const dungeonMidIndex = Math.floor(dungeonEncounters.table.length / 2);
      expect(dungeonResult).toBe(dungeonEncounters.table[dungeonMidIndex]);
    });
    
    test('generateEncounter handles case-insensitive terrain', () => {
      const result = generateEncounter('FOREST', 5);
      const forestMidIndex = Math.floor(forestEncounters.table.length / 2);
      expect(result).toBe(forestEncounters.table[forestMidIndex]);
    });
    
    test('generateEncounter defaults to forest for unknown terrain', () => {
      const result = generateEncounter('unknown', 5);
      const forestMidIndex = Math.floor(forestEncounters.table.length / 2);
      expect(result).toBe(forestEncounters.table[forestMidIndex]);
    });
  });

  describe('Event Tables', () => {
    test('calamityEvents returns expected value', () => {
      const midIndex = Math.floor(calamityEvents.table.length / 2);
      expect(calamityEvents.roll()).toBe(calamityEvents.table[midIndex]);
    });

    test('fortuneEvents returns expected value', () => {
      const midIndex = Math.floor(fortuneEvents.table.length / 2);
      expect(fortuneEvents.roll()).toBe(fortuneEvents.table[midIndex]);
    });

    test('generateRandomEvent returns calamity when param is true', () => {
      const result = generateRandomEvent(true);
      const calamityMidIndex = Math.floor(calamityEvents.table.length / 2);
      expect(result).toBe(calamityEvents.table[calamityMidIndex]);
    });

    test('generateRandomEvent returns fortune when param is false', () => {
      const result = generateRandomEvent(false);
      const fortuneMidIndex = Math.floor(fortuneEvents.table.length / 2);
      expect(result).toBe(fortuneEvents.table[fortuneMidIndex]);
    });

    test('generateRandomEvent uses Math.random to decide type when not specified', () => {
      // Clear previous mocks to avoid interference
      vi.restoreAllMocks();
      
      // First test: Random value > 0.5 should give calamity (isCalamity = true)
      const mockRandom = vi.spyOn(Math, 'random');
      
      // First call determines calamity/fortune, second call selects the item
      mockRandom
        .mockReturnValueOnce(0.6) // > 0.5 means calamity
        .mockReturnValueOnce(0.5); // For selecting the table item
        
      const result1 = generateRandomEvent();
      const calamityMidIndex = Math.floor(calamityEvents.table.length / 2);
      expect(result1).toBe(calamityEvents.table[calamityMidIndex]);
      
      // Reset mocks for the second part of the test
      vi.restoreAllMocks();
      
      // Second test: Random value <= 0.5 should give fortune (isCalamity = false)
      const mockRandom2 = vi.spyOn(Math, 'random');
      mockRandom2
        .mockReturnValueOnce(0.4) // <= 0.5 means fortune
        .mockReturnValueOnce(0.5); // For selecting the table item
        
      const result2 = generateRandomEvent();
      const fortuneMidIndex = Math.floor(fortuneEvents.table.length / 2);
      expect(result2).toBe(fortuneEvents.table[fortuneMidIndex]);
    });
  });
}); 