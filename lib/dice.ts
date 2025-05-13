/**
 * Dice utility functions for OSRIC rule implementation
 */

/**
 * Roll a die with the specified number of sides
 * @param sides Number of sides on the die
 * @param modifier Optional modifier to add to the result
 * @returns Object containing roll information
 */
export const roll = (sides: number, modifier = 0): number => {
  return Math.floor(Math.random() * sides) + 1 + modifier;
};

/**
 * Roll multiple dice of the same type
 * @param count Number of dice to roll
 * @param sides Number of sides on each die
 * @param modifier Optional modifier to add to the total
 * @returns Array of individual die results
 */
export const rollMultiple = (count: number, sides: number, modifier = 0): number[] => {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(roll(sides));
  }
  
  // Apply modifier to the last die if provided
  if (modifier !== 0 && results.length > 0) {
    results[results.length - 1] += modifier;
  }
  
  return results;
};

/**
 * Parse and roll dice from standard dice notation (e.g., "2d6+3")
 * @param notation Dice notation string (e.g., "2d6+3", "1d20-2", "3d8")
 * @returns Array of individual die results
 */
export const rollFromNotation = (notation: string): number[] => {
  // Parse the notation using regex
  const match = notation.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  
  if (!match) {
    throw new Error(`Invalid dice notation: ${notation}`);
  }
  
  const count = Number.parseInt(match[1], 10);
  const sides = Number.parseInt(match[2], 10);
  const modifier = match[3] ? Number.parseInt(match[3], 10) : 0;
  
  return rollMultiple(count, sides, modifier);
};

/**
 * Sum the results of multiple dice rolls
 * @param results Array of die results
 * @returns Sum of all dice
 */
export const sumDice = (results: number[]): number => {
  return results.reduce((sum, result) => sum + result, 0);
};

/**
 * Get ability score modifier as per OSRIC rules
 * @param score Ability score value (3-18)
 * @returns Modifier value
 */
export const getAbilityModifier = (score: number): number => {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3; // 18
};

/**
 * Roll for initiative as per OSRIC rules
 * @param sides Usually 6 for initiative in OSRIC
 * @param modifier Dexterity or other modifiers
 * @returns Initiative roll result (lower is better in OSRIC)
 */
export const rollInitiative = (sides = 6, modifier = 0): number => {
  return roll(sides, modifier);
}; 