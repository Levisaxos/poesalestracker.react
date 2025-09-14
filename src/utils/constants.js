// Navigation constants
export const ROUTES = {
  DASHBOARD: '/',
  ACTIVE_ITEMS: '/active',
  SOLD_ITEMS: '/sold'
};

export const NAV_ITEMS = [
  { id: 1, name: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
  { id: 2, name: 'Active Items', path: ROUTES.ACTIVE_ITEMS, icon: '🔥' },
  { id: 3, name: 'Sold Items', path: ROUTES.SOLD_ITEMS, icon: '✅' }
];

// Currency types with integer IDs
export const CURRENCIES = {
  CHAOS: 'chaos',
  DIVINE: 'divine',
  EXALTED: 'exalted'
};

export const CURRENCY_CONFIG = {
  [CURRENCIES.CHAOS]: { 
    id: 1, 
    name: 'Chaos Orb', 
    icon: 'chaos.png', 
    shortName: 'C',
    baseValue: 1
  },
  [CURRENCIES.DIVINE]: { 
    id: 2, 
    name: 'Divine Orb', 
    icon: 'divine.png', 
    shortName: 'D',
    baseValue: 200
  },
  [CURRENCIES.EXALTED]: { 
    id: 3, 
    name: 'Exalted Orb', 
    icon: 'exalted.png', 
    shortName: 'E',
    baseValue: 150
  }
};

// Item status with integer IDs
export const ITEM_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold'
};

export const STATUS_CONFIG = {
  [ITEM_STATUS.ACTIVE]: { id: 1, name: 'Active', color: 'orange' },
  [ITEM_STATUS.SOLD]: { id: 2, name: 'Sold', color: 'green' }
};

// Item rarities with integer IDs
export const RARITIES = {
  NORMAL: 'Normal',
  MAGIC: 'Magic',
  RARE: 'Rare',
  UNIQUE: 'Unique'
};

export const RARITY_CONFIG = {
  [RARITIES.NORMAL]: { id: 1, name: 'Normal', color: 'text-gray-300' },
  [RARITIES.MAGIC]: { id: 2, name: 'Magic', color: 'text-blue-400' },
  [RARITIES.RARE]: { id: 3, name: 'Rare', color: 'text-yellow-400' },
  [RARITIES.UNIQUE]: { id: 4, name: 'Unique', color: 'text-orange-500' }
};

// Item classes with integer IDs
export const ITEM_CLASSES = {
  WEAPONS: {
    WANDS: { id: 1, name: 'Wands', category: 'Weapons' },
    STAVES: { id: 2, name: 'Staves', category: 'Weapons' },
    SWORDS: { id: 3, name: 'Swords', category: 'Weapons' },
    AXES: { id: 4, name: 'Axes', category: 'Weapons' },
    MACES: { id: 5, name: 'Maces', category: 'Weapons' },
    BOWS: { id: 6, name: 'Bows', category: 'Weapons' },
    CROSSBOWS: { id: 7, name: 'Crossbows', category: 'Weapons' },
    DAGGERS: { id: 8, name: 'Daggers', category: 'Weapons' },
    CLAWS: { id: 9, name: 'Claws', category: 'Weapons' },
    SPEARS: { id: 10, name: 'Spears', category: 'Weapons' }
  },
  ARMOR: {
    HELMETS: { id: 11, name: 'Helmets', category: 'Armor' },
    BODY_ARMOUR: { id: 12, name: 'Body Armour', category: 'Armor' },
    GLOVES: { id: 13, name: 'Gloves', category: 'Armor' },
    BOOTS: { id: 14, name: 'Boots', category: 'Armor' },
    BELTS: { id: 15, name: 'Belts', category: 'Armor' },
    SHIELDS: { id: 16, name: 'Shields', category: 'Armor' }
  },
  ACCESSORIES: {
    RINGS: { id: 17, name: 'Rings', category: 'Accessories' },
    AMULETS: { id: 18, name: 'Amulets', category: 'Accessories' }
  },
  JEWELS: {
    JEWELS: { id: 19, name: 'Jewels', category: 'Jewels' }
  }
};

// Flattened item class list for easier access
export const ITEM_CLASS_LIST = Object.values(ITEM_CLASSES)
  .reduce((acc, category) => [...acc, ...Object.values(category)], []);

// LocalStorage keys
export const STORAGE_KEYS = {
  ITEMS: 'poe2_tracker_items',
  SETTINGS: 'poe2_tracker_settings'
};

// Sort options with integer IDs
export const SORT_OPTIONS = {
  NEWEST_FIRST: { id: 1, value: 'newest', name: 'Newest First' },
  OLDEST_FIRST: { id: 2, value: 'oldest', name: 'Oldest First' },
  PRICE_HIGH_TO_LOW: { id: 3, value: 'price-high', name: 'Price: High to Low' },
  PRICE_LOW_TO_HIGH: { id: 4, value: 'price-low', name: 'Price: Low to High' },
  NAME_A_TO_Z: { id: 5, value: 'name', name: 'Name A-Z' },
  RECENTLY_SOLD: { id: 6, value: 'recently-sold', name: 'Recently Sold' },
  FASTEST_SALE: { id: 7, value: 'fastest-sale', name: 'Fastest Sale' }
};

// Validation rules
export const VALIDATION_RULES = {
  ITEM_NAME_MAX_LENGTH: 100,
  ITEM_NAME_MIN_LENGTH: 1,
  PRICE_MIN_VALUE: 0.01,
  PRICE_MAX_VALUE: 999999,
  PROPERTIES_MAX_COUNT: 50
};

// Default currency rates (in chaos orbs)
export const DEFAULT_CURRENCY_RATES = {
  [CURRENCIES.CHAOS]: 1,
  [CURRENCIES.DIVINE]: 200,
  [CURRENCIES.EXALTED]: 150
};