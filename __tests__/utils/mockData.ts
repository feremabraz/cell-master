import type { Character, Item, CharacterRace, AbilityScoreModifiers } from '../../rules/types';

/**
 * Creates a mock character for testing
 * 
 * @param options Configuration options for the mock character
 * @returns A mock character instance
 */
export const createMockCharacter = (options: {
  strength?: number;
  race?: CharacterRace;
  inventory?: Item[];
  equipLightSource?: boolean;
} = {}): Character => {
  const {
    strength = 10,
    race = 'Human',
    inventory = [],
    equipLightSource = false,
  } = options;

  // If equipLightSource is true, add a torch to the inventory
  const finalInventory = [...inventory];
  if (equipLightSource && !inventory.some(item => item.name === 'Torch')) {
    const lightSource: Item = {
      id: 'torch-1',
      name: 'Torch',
      weight: 0.5,
      description: 'A wooden stick wrapped with oil-soaked cloth.',
      value: 1,
      equipped: equipLightSource,
      magicBonus: null,
      charges: null
    };
    finalInventory.push(lightSource);
  }

  const abilityModifiers: AbilityScoreModifiers = {
    // Strength
    strengthHitAdj: null,
    strengthDamageAdj: null,
    strengthEncumbrance: null,
    strengthOpenDoors: null,
    strengthBendBars: null,
    
    // Dexterity
    dexterityReaction: null,
    dexterityMissile: null,
    dexterityDefense: null,
    dexterityPickPockets: null,
    dexterityOpenLocks: null,
    dexterityFindTraps: null,
    dexterityMoveSilently: null,
    dexterityHideInShadows: null,
    
    // Constitution
    constitutionHitPoints: null,
    constitutionSystemShock: null,
    constitutionResurrectionSurvival: null,
    constitutionPoisonSave: null,
    
    // Intelligence
    intelligenceLanguages: null,
    intelligenceLearnSpells: null,
    intelligenceMaxSpellLevel: null,
    intelligenceIllusionImmunity: false,
    
    // Wisdom
    wisdomMentalSave: null,
    wisdomBonusSpells: null,
    wisdomSpellFailure: null,
    
    // Charisma
    charismaReactionAdj: null,
    charismaLoyaltyBase: null,
    charismaMaxHenchmen: null
  };

  return {
    id: 'test-char',
    name: 'Test Character',
    level: 1,
    hitPoints: { current: 10, maximum: 10 },
    armorClass: 10,
    thac0: 20,
    experience: { current: 0, requiredForNextLevel: 2000, level: 1 },
    alignment: 'Lawful Good',
    inventory: finalInventory,
    position: 'standing',
    statusEffects: [],
    race,
    class: 'Fighter',
    abilities: {
      strength,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    abilityModifiers,
    savingThrows: {
      'Poison or Death': 14,
      'Wands': 15,
      'Paralysis, Polymorph, or Petrification': 16,
      'Breath Weapons': 17,
      'Spells, Rods, or Staves': 17
    },
    spells: [],
    currency: { platinum: 0, gold: 10, electrum: 0, silver: 0, copper: 0 },
    encumbrance: 0,
    movementRate: 36,
    classes: { Fighter: 1 },
    primaryClass: null,
    spellSlots: {},
    memorizedSpells: {},
    spellbook: [],
    thiefSkills: null,
    turnUndead: null,
    languages: ['Common'],
    age: 25,
    ageCategory: 'Adult',
    henchmen: [],
    racialAbilities: [],
    classAbilities: [],
    proficiencies: [],
    secondarySkills: []
  };
};

/**
 * Creates a mock item for testing
 * 
 * @param weight The weight of the item
 * @returns A mock item instance
 */
export const createMockItem = (weight: number): Item => ({
  id: `item-${weight}`,
  name: `Test Item ${weight}kg`,
  weight,
  description: 'Test item',
  value: 1,
  equipped: false,
  magicBonus: null,
  charges: null
}); 