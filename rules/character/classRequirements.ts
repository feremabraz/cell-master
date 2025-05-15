import type { AbilityScores, CharacterClass, CharacterRace } from '@rules/types';

/**
 * Minimum ability score requirements for each class
 */
export const CLASS_MINIMUM_SCORES: Record<CharacterClass, Partial<AbilityScores>> = {
  Fighter: {
    strength: 9
  },
  Paladin: {
    strength: 12,
    constitution: 9,
    wisdom: 13,
    charisma: 17
  },
  Ranger: {
    strength: 13,
    dexterity: 13,
    constitution: 14,
    wisdom: 14
  },
  'Magic-User': {
    intelligence: 9
  },
  Illusionist: {
    dexterity: 16,
    intelligence: 15
  },
  Cleric: {
    wisdom: 9
  },
  Druid: {
    wisdom: 12,
    charisma: 15
  },
  Thief: {
    dexterity: 9
  },
  Assassin: {
    strength: 12,
    dexterity: 12,
    intelligence: 11
  }
};

/**
 * Level limitations for non-human races by class
 * 'Unlimited' is represented by -1
 */
export const RACIAL_LEVEL_LIMITS: Record<CharacterRace, Partial<Record<CharacterClass, number>>> = {
  Human: {
    Fighter: -1,
    Paladin: -1,
    Ranger: -1,
    'Magic-User': -1,
    Illusionist: -1,
    Cleric: -1,
    Druid: 14,
    Thief: -1,
    Assassin: 15
  },
  Dwarf: {
    Fighter: 9,
    Cleric: 8,
    Thief: -1,
    Assassin: 9
  },
  Elf: {
    Fighter: 7,
    'Magic-User': 11,
    Thief: -1,
    Assassin: 10,
    Cleric: 7
  },
  Gnome: {
    Fighter: 6,
    Illusionist: 7,
    Thief: -1,
    Assassin: 8,
    Cleric: 7
  },
  'Half-Elf': {
    Fighter: 8,
    Ranger: 8,
    'Magic-User': 8,
    Thief: -1,
    Assassin: 11,
    Cleric: 5
  },
  Halfling: {
    Fighter: 4,
    Thief: -1,
    Druid: 6
  },
  'Half-Orc': {
    Fighter: 10,
    Thief: 7,
    Assassin: 15,
    Cleric: 4
  }
};

/**
 * Class options available to each race
 */
export const RACIAL_CLASS_OPTIONS: Record<CharacterRace, CharacterClass[]> = {
  Human: ['Fighter', 'Paladin', 'Ranger', 'Magic-User', 'Illusionist', 'Cleric', 'Druid', 'Thief', 'Assassin'],
  Dwarf: ['Fighter', 'Cleric', 'Thief', 'Assassin'],
  Elf: ['Fighter', 'Magic-User', 'Thief', 'Assassin', 'Cleric'],
  Gnome: ['Fighter', 'Illusionist', 'Thief', 'Assassin', 'Cleric'],
  'Half-Elf': ['Fighter', 'Ranger', 'Magic-User', 'Thief', 'Assassin', 'Cleric'],
  Halfling: ['Fighter', 'Thief', 'Druid'],
  'Half-Orc': ['Fighter', 'Thief', 'Assassin', 'Cleric']
};

/**
 * Checks if a character meets minimum requirements for a class
 */
export function meetsClassRequirements(
  abilityScores: AbilityScores, 
  characterClass: CharacterClass
): boolean {
  const requirements = CLASS_MINIMUM_SCORES[characterClass];
  
  // Check each ability score requirement
  for (const [ability, minimumScore] of Object.entries(requirements)) {
    const characterScore = abilityScores[ability as keyof AbilityScores];
    if (characterScore < minimumScore) {
      return false;
    }
  }
  
  return true;
}

/**
 * Checks if a race can be a particular class
 */
export function canRaceBeClass(
  race: CharacterRace, 
  characterClass: CharacterClass
): boolean {
  return RACIAL_CLASS_OPTIONS[race].includes(characterClass);
}

/**
 * Gets maximum level for a race/class combination
 * Returns -1 for unlimited advancement
 */
export function getMaxLevelForRaceClass(
  race: CharacterRace, 
  characterClass: CharacterClass
): number {
  const maxLevel = RACIAL_LEVEL_LIMITS[race][characterClass];
  
  // If not specified, the race cannot be this class
  if (maxLevel === undefined) {
    return 0;
  }
  
  return maxLevel;
} 