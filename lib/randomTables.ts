import { createRandomTable, getRandomInt } from '@lib/random';
import type { Environment, TerrainType } from '@rules/types';

// --- Weather Generator Tables ---

export const weatherTemperature = createRandomTable(
  'Weather Temperature',
  'Random temperature variation for the current climate',
  [
    'Unusually cold',
    'Colder than normal',
    'Slightly cool',
    'Normal for season',
    'Slightly warm',
    'Warmer than normal',
    'Unusually hot',
  ]
);

export const weatherPrecipitation = createRandomTable(
  'Weather Precipitation',
  'Precipitation conditions',
  [
    'Clear skies',
    'Light clouds',
    'Partly cloudy',
    'Overcast',
    'Fog/mist',
    'Light rain/snow',
    'Steady rain/snow',
    'Heavy rain/snow',
    'Thunderstorm/blizzard',
  ]
);

export const weatherWind = createRandomTable('Weather Wind', 'Wind conditions', [
  'Still air',
  'Light breeze',
  'Moderate wind',
  'Strong wind',
  'Very strong wind',
  'Gale',
  'Storm winds',
]);

// Weather generation interface
export interface WeatherResult {
  temperature: string;
  precipitation: string;
  wind: string;
  description: string;
}

// Generate a complete weather description
export const generateWeather = (_climate: string, _season: string): WeatherResult => {
  const temperature = weatherTemperature.roll();
  const precipitation = weatherPrecipitation.roll();
  const wind = weatherWind.roll();

  return {
    temperature,
    precipitation,
    wind,
    description: `${temperature}. ${precipitation}. ${wind}.`,
  };
};

// --- Random Encounter Tables by Terrain ---

export const forestEncounters = createRandomTable(
  'Forest Encounters',
  'Random encounters in forest terrain',
  [
    'Bandit group (1d6+2)',
    'Wolf pack (2d4)',
    'Black bear',
    'Deer (1d4)',
    'Giant spider',
    'Wild boar',
    'Elf patrol (1d4+1)',
    'Orc scouts (1d6)',
    'Goblin warband (2d4)',
    'Traveling merchant',
    'Lost traveler',
    'Ranger',
    'Giant centipede nest',
    'Dire wolves (1d3)',
    'Forest hag',
    'Wild elf hermit',
    'Owlbear',
    'Treant',
    'Unicorn',
    'Dryad grove',
  ]
);

export const plainsEncounters = createRandomTable(
  'Plains Encounters',
  'Random encounters in plains/grasslands',
  [
    'Merchant caravan',
    'Nomad group',
    'Wild horses (1d6)',
    'Lion',
    'Giant ants (1d6+2)',
    'Peasant farmers',
    'Knights on patrol (1d4)',
    'Bandits (2d4)',
    'Gnoll hunting party (1d6)',
    'Giant beetles (1d3)',
    'Wild dog pack (2d4)',
    'Ogre',
    'Armed tax collectors',
    'Hobgoblin raiders (2d6)',
    'Dire hyenas (1d4)',
    'Cyclops',
    'Griffon',
    'Hippogriff',
    'Wyvern (flying overhead)',
    'Wasteland troll',
  ]
);

export const mountainEncounters = createRandomTable(
  'Mountain Encounters',
  'Random encounters in mountainous terrain',
  [
    'Mountain lion',
    'Giant eagle',
    'Dwarf prospectors (1d3)',
    'Rock slide (no creatures)',
    'Mountain goats (1d6)',
    'Ogre',
    'Hill giant',
    'Goblin scouts (1d6)',
    'Orc war party (2d6)',
    'Harpy',
    'Griffin nest',
    'Stone giant',
    'Dwarf patrol (1d4+2)',
    'Young dragon',
    'Manticore',
    'Chimera',
    'Ettin',
    'Troll',
    'Roc',
    'Giant',
  ]
);

export const dungeonEncounters = createRandomTable(
  'Dungeon Encounters',
  'Random encounters in dungeon environments',
  [
    'Giant rats (2d6)',
    'Goblins (1d6+1)',
    'Skeletons (1d8)',
    'Zombies (1d6)',
    'Kobolds (2d4)',
    'Giant centipedes (1d4)',
    'Orc guards (1d6)',
    'Gelatinous cube',
    'Rust monster',
    'Carrion crawler',
    'Stirges (1d8)',
    'Giant spiders (1d4)',
    'Ghouls (1d4)',
    'Bugbears (1d3)',
    'Hobgoblin patrol (1d6+2)',
    'Mimic',
    'Gargoyle',
    'Ochre jelly',
    'Wight',
    'Ogre',
  ]
);

// Generate an encounter based on terrain
export const generateEncounter = (terrain: TerrainType | string, _level: number): string => {
  // Select appropriate table based on terrain
  let encounterTable: ReturnType<typeof createRandomTable<string>>;

  // Convert terrain to lowercase for case-insensitive comparison
  const terrainLower = typeof terrain === 'string' ? terrain.toLowerCase() : '';

  switch (terrainLower) {
    case 'forest':
      encounterTable = forestEncounters;
      break;
    case 'plains':
    case 'grassland':
      encounterTable = plainsEncounters;
      break;
    case 'mountain':
    case 'mountains':
      encounterTable = mountainEncounters;
      break;
    case 'dungeon':
      encounterTable = dungeonEncounters;
      break;
    default:
      encounterTable = forestEncounters;
  }

  // Roll on the table
  return encounterTable.roll();
};

// --- Calamity/Fortune Events ---

export const calamityEvents = createRandomTable(
  'Calamity Events',
  'Negative random events that can befall adventurers',
  [
    'Weapon breaks during critical moment',
    'Food supplies spoil',
    'Maps get soaked and become illegible',
    'Character falls ill (save vs. poison or -2 to all rolls for 1d3 days)',
    'Local authorities seek party for questioning',
    'Important item is stolen during the night',
    'Sudden weather change (severe storm)',
    'Pack animal goes lame or runs away',
    'Mistaken identity leads to hostile reception',
    'Rumors spread about the party (unfavorable)',
    'Magical items temporarily lose power',
    'Enemy from past returns seeking revenge',
    'Bandits target the party specifically',
    'Accidental fire in camp destroys equipment',
    'Religious holiday prevents normal activities',
    'Bridge/road ahead is washed out',
    'Poison in water source (save or become sick)',
    'Guide/contact goes missing',
    'Bounty hunters mistake party for wanted criminals',
    'Cursed area affects magic use and healing',
  ]
);

export const fortuneEvents = createRandomTable(
  'Fortune Events',
  'Positive random events that can benefit adventurers',
  [
    'Friendly traveler shares valuable information',
    'Discover cache of supplies or equipment',
    'Favorable weather improves travel speed',
    'Local festival provides free food and lodging',
    'Find minor magical trinket',
    'Encounter potential ally or hireling',
    'Rescue merchant who rewards the party',
    'Discover shortcut to destination',
    'Receive blessing from passing cleric (+1 to saves for 1 day)',
    'Find abandoned campsite with usable supplies',
    'Favorable rumors about party reach town before them',
    'Magical spring restores 1d6 HP to all who drink',
    'Letter of introduction to important NPC',
    'Discover rare herb with healing properties',
    'Local crafters offer services at discount',
    'Wild animal leads to hidden cave or resource',
    'Encounter traders willing to buy unwanted items at good price',
    'Witness event that provides adventure hook with good rewards',
    'Find map revealing hidden location nearby',
    'Favorable astrological alignment (+1 to one important roll)',
  ]
);

// Generate a random event (calamity or fortune)
export const generateRandomEvent = (isCalamity: boolean = Math.random() > 0.5): string => {
  return isCalamity ? calamityEvents.roll() : fortuneEvents.roll();
};
