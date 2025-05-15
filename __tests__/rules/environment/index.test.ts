import { describe, it, expect } from 'vitest';
import * as environmentModule from '../../../rules/environment';

describe('Environment Module', () => {
  it('should export all required functions', () => {
    // Falling damage
    expect(environmentModule.calculateFallingDamage).toBeDefined();
    expect(typeof environmentModule.calculateFallingDamage).toBe('function');
    
    // Swimming and drowning
    expect(environmentModule.resolveSwimming).toBeDefined();
    expect(typeof environmentModule.resolveSwimming).toBe('function');
    expect(environmentModule.resolveDrowning).toBeDefined();
    expect(typeof environmentModule.resolveDrowning).toBe('function');
    
    // Survival needs
    expect(environmentModule.resolveSurvivalNeeds).toBeDefined();
    expect(typeof environmentModule.resolveSurvivalNeeds).toBe('function');
    expect(environmentModule.findFoodAndWater).toBeDefined();
    expect(typeof environmentModule.findFoodAndWater).toBe('function');
    
    // Temperature
    expect(environmentModule.resolveTemperatureEffects).toBeDefined();
    expect(typeof environmentModule.resolveTemperatureEffects).toBe('function');
  });
  
  it('should export types from the environment module', () => {
    // Check for the presence of type definitions by verifying some constant arrays
    expect(environmentModule.SwimmingDifficultyLevels).toBeDefined();
    expect(Array.isArray(environmentModule.SwimmingDifficultyLevels)).toBe(true);
    
    expect(environmentModule.TemperatureRanges).toBeDefined();
    expect(Array.isArray(environmentModule.TemperatureRanges)).toBe(true);
  });
}); 