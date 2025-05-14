import type { Character, Monster, InitiativeResult, Weapon } from '../types';
import { roll } from '../../lib/dice';

/**
 * Roll initiative for a single character or monster
 */
export const combatInitiativeRoll = (
  entity: Character | Monster,
  weapon?: Weapon
): InitiativeResult => {
  // Base initiative roll is 1d10 (using the existing dice utility)
  const baseRoll = roll(10);
  
  // Apply modifiers
  let modifier = 0;
  
  // Apply dexterity reaction adjustment for characters
  if ('abilities' in entity && entity.abilityModifiers.dexterityReaction) {
    modifier += entity.abilityModifiers.dexterityReaction;
  }
  
  // Apply weapon speed factor if applicable
  if (weapon) {
    modifier += weapon.speed;
  }
  
  // Lower is better for initiative in OSRIC
  const initiativeScore = baseRoll + modifier;
  
  return {
    roller: entity,
    initiative: initiativeScore,
    surprise: false, // Set in separate surprise check
    segmentOrder: initiativeScore
  };
};

/**
 * Roll initiative for a group (party or monsters).
 * Returns an array of InitiativeResult, sorted by initiative (lowest first).
 */
export const rollGroupInitiative = (
  entities: (Character | Monster)[],
  weapons?: Record<string, Weapon> // Map of entity.id to weapon
): InitiativeResult[] => {
  const results: InitiativeResult[] = entities.map(entity => {
    const weapon = weapons ? weapons[entity.id] : undefined;
    return combatInitiativeRoll(entity, weapon);
  });
  
  // Sort by initiative (lowest first)
  return results.sort((a, b) => a.initiative - b.initiative);
};

/**
 * Roll for group initiative. 
 * Returns a single value for the whole group.
 */
export const rollSingleGroupInitiative = (
  entities: (Character | Monster)[],
  weapons?: Record<string, Weapon>
): number => {
  // Roll 1d10 for the group
  const baseRoll = roll(10);
  
  // Find the best (lowest) dexterity reaction adjustment in the group
  let bestReactionAdj = 0;
  
  for (const entity of entities) {
    if ('abilities' in entity && entity.abilityModifiers.dexterityReaction) {
      const reactionAdj = entity.abilityModifiers.dexterityReaction;
      if (reactionAdj < bestReactionAdj) {
        bestReactionAdj = reactionAdj;
      }
    }
  }
  
  // Find the best (lowest) weapon speed factor in the group
  let bestSpeedFactor = Number.POSITIVE_INFINITY; // Initialize to a high value so first comparison will work
  
  if (weapons) {
    for (const entity of entities) {
      const weapon = weapons[entity.id];
      if (weapon && weapon.speed < bestSpeedFactor) {
        bestSpeedFactor = weapon.speed;
      }
    }
  }
  
  // If no weapons found, use 0 as default
  if (bestSpeedFactor === Number.POSITIVE_INFINITY) {
    bestSpeedFactor = 0;
  }
  
  // Calculate initiative (lower is better)
  return baseRoll + bestReactionAdj + bestSpeedFactor;
};

/**
 * Check for surprise
 * Returns true if the target is surprised
 */
export const checkSurprise = (
  target: Character | Monster,
  circumstanceModifier = 0
): boolean => {
  // Base chance of surprise is 2 in 6
  const roll6 = roll(6);
  
  // Calculate surprise threshold (1-2 is surprised by default)
  let surpriseThreshold = 2;
  
  // Adjust for race (some races are harder to surprise)
  if ('race' in target) {
    if (['Elf', 'Half-Elf'].includes(target.race)) {
      surpriseThreshold -= 1; // Elves and Half-Elves are only surprised on a 1
    }
  }
  
  // Apply circumstance modifier
  surpriseThreshold += circumstanceModifier;
  
  // Ensure threshold is between 0 and 6
  surpriseThreshold = Math.max(0, Math.min(6, surpriseThreshold));
  
  // Return true if roll is less than or equal to threshold
  return roll6 <= surpriseThreshold;
};

/**
 * Check for group surprise
 * Returns an array of booleans indicating which entities are surprised
 */
export const checkGroupSurprise = (
  entities: (Character | Monster)[],
  circumstanceModifier = 0
): boolean[] => {
  return entities.map(entity => checkSurprise(entity, circumstanceModifier));
};

/**
 * Manage a complete combat turn's initiative and ordering
 */
export const manageCombatOrder = (
  party: Character[],
  monsters: Monster[],
  partyWeapons?: Record<string, Weapon>,
  monsterWeapons?: Record<string, Weapon>
): {
  order: (Character | Monster)[];
  partyInitiative: number;
  monsterInitiative: number;
  surprised: Record<string, boolean>;
} => {
  // Roll initiative for both groups
  const partyInitiative = rollSingleGroupInitiative(party, partyWeapons);
  const monsterInitiative = rollSingleGroupInitiative(monsters, monsterWeapons);
  
  // Check for surprise
  const partySurprised = checkGroupSurprise(party);
  const monstersSurprised = checkGroupSurprise(monsters);
  
  // Build a surprise record by entity ID
  const surprised: Record<string, boolean> = {};
  
  party.forEach((char, i) => {
    surprised[char.id] = partySurprised[i];
  });
  
  monsters.forEach((monster, i) => {
    surprised[monster.id] = monstersSurprised[i];
  });
  
  // Determine order based on initiative
  let order: (Character | Monster)[];
  
  if (partyInitiative < monsterInitiative) {
    // Party goes first
    order = [...party, ...monsters];
  } else if (monsterInitiative < partyInitiative) {
    // Monsters go first
    order = [...monsters, ...party];
  } else {
    // Initiative tie - actions are simultaneous
    // For simplicity, we'll alternate between party and monsters
    order = [];
    const maxLength = Math.max(party.length, monsters.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < party.length) order.push(party[i]);
      if (i < monsters.length) order.push(monsters[i]);
    }
  }
  
  // Remove surprised entities from the first round
  const orderWithoutSurprised = order.filter(entity => !surprised[entity.id]);
  
  return {
    order: orderWithoutSurprised,
    partyInitiative,
    monsterInitiative,
    surprised
  };
}; 