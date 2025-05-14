/**
 * Unit conversion utilities for translating between metric and imperial measurements
 * Used for displaying values in player-familiar units and working with original OSRIC materials
 */

/**
 * Distance conversion factors
 */
export const METERS_TO_FEET = 3.28084;
export const FEET_TO_METERS = 0.3048;
export const KILOMETERS_TO_MILES = 0.621371;
export const MILES_TO_KILOMETERS = 1.60934;

/**
 * Weight conversion factors
 */
export const KILOGRAMS_TO_POUNDS = 2.20462;
export const POUNDS_TO_KILOGRAMS = 0.453592;

/**
 * Temperature conversion factors (for weather effects)
 */
export const CELSIUS_TO_FAHRENHEIT_FACTOR = 9/5;
export const CELSIUS_TO_FAHRENHEIT_OFFSET = 32;
export const FAHRENHEIT_TO_CELSIUS_FACTOR = 5/9;
export const FAHRENHEIT_TO_CELSIUS_OFFSET = 32;

/**
 * Distance conversions
 */
export function metersToFeet(meters: number): number {
  return meters * METERS_TO_FEET;
}

export function feetToMeters(feet: number): number {
  return feet * FEET_TO_METERS;
}

export function kilometersToMiles(kilometers: number): number {
  return kilometers * KILOMETERS_TO_MILES;
}

export function milesToKilometers(miles: number): number {
  return miles * MILES_TO_KILOMETERS;
}

/**
 * Weight conversions
 */
export function kilogramsToPounds(kilograms: number): number {
  return kilograms * KILOGRAMS_TO_POUNDS;
}

export function poundsToKilograms(pounds: number): number {
  return pounds * POUNDS_TO_KILOGRAMS;
}

/**
 * Temperature conversions
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * CELSIUS_TO_FAHRENHEIT_FACTOR) + CELSIUS_TO_FAHRENHEIT_OFFSET;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - FAHRENHEIT_TO_CELSIUS_OFFSET) * FAHRENHEIT_TO_CELSIUS_FACTOR;
}

/**
 * Format a distance value with appropriate unit
 * @param value The numeric value
 * @param useMetric Whether to use metric (true) or imperial (false)
 * @param precision Number of decimal places to round to
 */
export function formatDistance(value: number, useMetric = true, precision = 1): string {
  if (useMetric) {
    if (value < 1000) {
      // Small distances in meters
      return `${Math.round(value * (10 ** precision)) / (10 ** precision)}m`;
    }
    
    // Larger distances in kilometers
    const km = value / 1000;
    return `${Math.round(km * (10 ** precision)) / (10 ** precision)}km`;
  }
  
  const feet = metersToFeet(value);
  if (feet < 1000) {
    // Small distances in feet
    return `${Math.round(feet * (10 ** precision)) / (10 ** precision)}ft`;
  }
  
  // Larger distances in miles
  const miles = feet / 5280;
  return `${Math.round(miles * (10 ** precision)) / (10 ** precision)}mi`;
}

/**
 * Format a weight value with appropriate unit
 * @param value The numeric value in kilograms
 * @param useMetric Whether to use metric (true) or imperial (false)
 * @param precision Number of decimal places to round to
 */
export function formatWeight(value: number, useMetric = true, precision = 1): string {
  if (useMetric) {
    return `${Math.round(value * (10 ** precision)) / (10 ** precision)}kg`;
  }
  
  const pounds = kilogramsToPounds(value);
  return `${Math.round(pounds * (10 ** precision)) / (10 ** precision)}lb`;
}

/**
 * Convert original OSRIC encumbrance values (in coins) to kilograms
 * In OSRIC, 10 coins = 1 pound, and we convert pounds to kilograms
 */
export function coinsToKilograms(coins: number): number {
  const pounds = coins / 10;
  return poundsToKilograms(pounds);
}

/**
 * Convert kilograms back to OSRIC coin weight
 */
export function kilogramsToCoins(kilograms: number): number {
  const pounds = kilogramsToPounds(kilograms);
  return pounds * 10;
}

/**
 * Helper to convert multiple values in a record/object from imperial to metric 
 * @param record An object with numeric values (like movement rates or distances)
 * @param conversionFactor The factor to multiply each value by
 */
export function convertObjectValues<T extends Record<string, number>>(
  record: T, 
  conversionFactor: number
): T {
  const result = { ...record } as T;
  
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = (result[key] * conversionFactor) as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

/**
 * Setting to control display preferences
 */
export interface UnitDisplayPreferences {
  useMetric: boolean;
  distancePrecision: number;
  weightPrecision: number;
}

/**
 * Default unit display preferences - metric by default
 */
export const defaultUnitPreferences: UnitDisplayPreferences = {
  useMetric: true,
  distancePrecision: 1,
  weightPrecision: 1
}; 