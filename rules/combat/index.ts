// Import types used in this file
import type { 
  Action, 
  ActionResult, 
  Weapon,
  WeaponProficiency
} from '../types';

// Import only the functions needed for resolveCombat
import { attackRoll } from './attackRoll';
import { applyDamage } from './damage';
import { applyWeaponVsArmorAdjustment } from './weaponVsArmor';
import { getNonProficiencyPenalty } from './proficiency';

// Export all combat-related functions for easy importing
export * from './attackRoll';
export * from './weaponVsArmor';
export * from './proficiency';
export * from './damage';
export * from './initiative';
export * from './death';

/**
 * Main combat resolution function that combines all aspects of combat
 */
export const resolveCombat = (
  action: Action
): ActionResult => {
  const { actor, target, item } = action;
  
  if (!target || typeof target === 'string') {
    return {
      success: false,
      message: 'No valid target specified for combat action.',
      damage: null,
      effects: null
    };
  }
  
  // Check if the actor has a weapon
  const weapon = item as Weapon | undefined;
  
  // Get weapon vs. armor adjustment if applicable
  let attackModifier = 0;
  if (weapon) {
    attackModifier += applyWeaponVsArmorAdjustment(target, weapon);
  }
  
  // Check if character is proficient with the weapon
  if ('class' in actor && weapon) {
    if (!actor.proficiencies.some((wp: WeaponProficiency) => wp.weapon === weapon.name)) {
      attackModifier += getNonProficiencyPenalty(actor.class);
    }
  }
  
  // Resolve the attack
  const combatResult = attackRoll(actor, target, weapon, attackModifier);
  
  // If the attack hit, apply damage
  if (combatResult.hit && combatResult.damage.length > 0) {
    const damageResult = applyDamage(actor, target, combatResult.damage, combatResult.critical);
    
    return {
      success: true,
      message: damageResult.message,
      damage: damageResult.damage,
      effects: damageResult.specialEffects ? 
        damageResult.specialEffects.map(effect => effect.name) : null
    };
  }
  
  // Attack missed
  return {
    success: false,
    message: combatResult.message,
    damage: null,
    effects: null
  };
};