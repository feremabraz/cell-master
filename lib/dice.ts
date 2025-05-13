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

/**
 * DICE POOL SYSTEMS
 * The following functions implement more advanced dice rolling mechanics
 */

/**
 * Represents the result of a dice pool roll
 */
export interface DicePoolResult {
  results: number[];      // Individual die results
  successes: number;      // Number of successes
  botches: number;        // Number of botches/critical failures
  total: number;          // Sum of all dice
}

/**
 * Roll a pool of dice and count successes based on a target number
 * @param count Number of dice to roll
 * @param sides Number of sides on each die
 * @param target Target number for success (roll >= target)
 * @param botchThreshold Value at or below which a die counts as a botch/critical failure
 * @returns DicePoolResult containing roll information
 */
export const rollPool = (
  count: number, 
  sides: number, 
  target: number, 
  botchThreshold = 1
): DicePoolResult => {
  const results = rollMultiple(count, sides);
  const successes = results.filter(r => r >= target).length;
  const botches = results.filter(r => r <= botchThreshold).length;
  const total = sumDice(results);
  
  return {
    results,
    successes,
    botches,
    total
  };
};

/**
 * Roll dice with the "exploding" mechanic (reroll and add when max value is rolled)
 * @param count Number of dice to roll
 * @param sides Number of sides on each die
 * @param explodeOn Value at which dice "explode" (usually the max value)
 * @param maxExplodes Maximum number of times a single die can explode
 * @returns Array of individual die results, including explosions
 */
export const rollExploding = (
  count: number, 
  sides: number, 
  explodeOn = sides, 
  maxExplodes = 10
): number[] => {
  const results: number[] = [];
  
  for (let i = 0; i < count; i++) {
    let dieValue = roll(sides);
    let explosions = 0;
    let dieTotal = dieValue;
    
    results.push(dieTotal);
    
    // Handle explosions
    while (dieValue >= explodeOn && explosions < maxExplodes) {
      dieValue = roll(sides);
      dieTotal += dieValue;
      
      // Replace the previous value with the total
      results[results.length - 1] = dieTotal;
      explosions++;
    }
  }
  
  return results;
};

/**
 * Roll multiple dice and keep only the highest N results
 * @param count Number of dice to roll
 * @param sides Number of sides on each die
 * @param keep Number of highest dice to keep
 * @returns Array of the highest kept die results
 */
export const rollKeepHighest = (
  count: number, 
  sides: number, 
  keep: number
): number[] => {
  const keepCount = Math.min(keep, count);
  
  const results = rollMultiple(count, sides);
  return results.sort((a, b) => b - a).slice(0, keepCount);
};

/**
 * Roll multiple dice and keep only the lowest N results
 * @param count Number of dice to roll
 * @param sides Number of sides on each die
 * @param keep Number of lowest dice to keep
 * @returns Array of the lowest kept die results
 */
export const rollKeepLowest = (
  count: number, 
  sides: number, 
  keep: number
): number[] => {
  const keepCount = Math.min(keep, count);
  
  const results = rollMultiple(count, sides);
  return results.sort((a, b) => a - b).slice(0, keepCount);
};

/**
 * Roll with advantage (roll twice, take higher result)
 * @param sides Number of sides on the die
 * @param modifier Optional modifier to add to the result
 * @returns Object with both rolls and the final result
 */
export const rollWithAdvantage = (sides: number, modifier = 0): { rolls: number[], result: number } => {
  const rolls = rollMultiple(2, sides);
  const highestRoll = Math.max(...rolls);
  
  return {
    rolls,
    result: highestRoll + modifier
  };
};

/**
 * Roll with disadvantage (roll twice, take lower result)
 * @param sides Number of sides on the die
 * @param modifier Optional modifier to add to the result
 * @returns Object with both rolls and the final result
 */
export const rollWithDisadvantage = (sides: number, modifier = 0): { rolls: number[], result: number } => {
  const rolls = rollMultiple(2, sides);
  const lowestRoll = Math.min(...rolls);
  
  return {
    rolls,
    result: lowestRoll + modifier
  };
};

/**
 * Contested roll between two characters
 * @param sides Number of sides on the die
 * @param challenger1Modifier Modifier for the first challenger
 * @param challenger2Modifier Modifier for the second challenger
 * @returns Object with both rolls, modified values, and the winner (1, 2, or 0 for tie)
 */
export const contestedRoll = (
  sides: number, 
  challenger1Modifier = 0, 
  challenger2Modifier = 0
): { 
  challenger1: { roll: number, total: number }, 
  challenger2: { roll: number, total: number }, 
  winner: number 
} => {
  const roll1 = roll(sides);
  const roll2 = roll(sides);
  
  const total1 = roll1 + challenger1Modifier;
  const total2 = roll2 + challenger2Modifier;
  
  let winner = 0;
  if (total1 > total2) {
    winner = 1;
  } else if (total2 > total1) {
    winner = 2;
  }
  
  return {
    challenger1: { roll: roll1, total: total1 },
    challenger2: { roll: roll2, total: total2 },
    winner
  };
}; 