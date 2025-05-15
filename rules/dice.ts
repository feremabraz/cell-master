/**
 * Dice module for OSRIC rules
 * This is a wrapper around lib/dice for use in the rules engine
 */

import * as DiceLib from '@lib/dice';

export interface DiceResult {
  roll: number;
  sides: number;
  modifier: number;
  result: number;
}

/**
 * Roll a specific number of dice with a given number of sides
 * @param count Number of dice to roll
 * @param sides Number of sides per die 
 * @param modifier Modifier to add to the total
 * @returns The dice result object
 */
export function rollDice(count: number, sides: number, modifier = 0): DiceResult {
  const results = DiceLib.rollMultiple(count, sides);
  const total = DiceLib.sumDice(results) + modifier;
  
  return {
    roll: count,
    sides,
    modifier,
    result: total
  };
}

/**
 * Roll a dice expression using standard RPG notation (e.g., "2d6+3")
 * @param notation Dice notation to roll
 * @returns The total result
 */
export function rollExpression(notation: string): number {
  const results = DiceLib.rollFromNotation(notation);
  return DiceLib.sumDice(results);
}

// Re-export utilities we need
export const rollWithAdvantage = DiceLib.rollWithAdvantage;
export const rollWithDisadvantage = DiceLib.rollWithDisadvantage;
export const rollKeepHighest = DiceLib.rollKeepHighest;
export const rollKeepLowest = DiceLib.rollKeepLowest; 