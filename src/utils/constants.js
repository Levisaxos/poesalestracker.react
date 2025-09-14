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

// Currency types
export const CURRENCIES = {
  CHAOS: 'chaos',
  DIVINE: 'divine',
  EXALTED: 'exalted'
};

export const CURRENCY_CONFIG = {
  [CURRENCIES.CHAOS]: { name: 'Chaos Orb', icon: 'chaos.png', shortName: 'C' },
  [CURRENCIES.DIVINE]: { name: 'Divine Orb', icon: 'divine.png', shortName: 'D' },
  [CURRENCIES.EXALTED]: { name: 'Exalted Orb', icon: 'exalted.png', shortName: 'E' }
};

// Item status
export const ITEM_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold'
};

// Item rarities
export const RARITIES = {
  NORMAL: 'Normal',
  MAGIC: 'Magic',
  RARE: 'Rare',
  UNIQUE: 'Unique'
};

// Item classes
export const ITEM_CLASSES = {
  WEAPONS: {
    WANDS: 'Wands',
    STAVES: 'Staves',
    SWORDS: 'Swords',
    AXES: 'Axes',
    MACES: 'Maces',
    BOWS: 'Bows',
    CROSSBOWS: 'Crossbows',
    DAGGERS: 'Daggers',
    CLAWS: 'Claws',
    SPEARS: 'Spears'
  },
  ARMOR: {
    HELMETS: 'Helmets',
    BODY_ARMOUR: 'Body Armour',
    GLOVES: 'Gloves',
    BOOTS: 'Boots',
    BELTS: 'Belts',
    SHIELDS: 'Shields'
  },
  ACCESSORIES: {
    RINGS: 'Rings',
    AMULETS: 'Amulets'
  },
  JEWELS: {
    JEWELS: 'Jewels'
  }
};

// LocalStorage keys
export const STORAGE_KEYS = {
  ITEMS: 'poe2_tracker_items',
  SETTINGS: 'poe2_tracker_settings'
};

// Sort options
export const SORT_OPTIONS = {
  NEWEST_FIRST: 'newest',
  OLDEST_FIRST: 'oldest',
  PRICE_HIGH_TO_LOW: 'price-high',
  PRICE_LOW_TO_HIGH: 'price-low',
  NAME_A_TO_Z: 'name',
  RECENTLY_SOLD: 'recently-sold',
  FASTEST_SALE: 'fastest-sale'
};