import { RARITIES, ITEM_STATUS, ITEM_CLASS_LIST, VALIDATION_RULES, CURRENCIES } from './constants';

/**
 * Parse item text from Path of Exile 2 clipboard format
 * @param {string} rawText - Raw item text from PoE2
 * @returns {Object|null} Parsed item object or null if invalid
 */
export const parseItemText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  const lines = rawText.trim().split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) {
    return null;
  }

  const item = {
    id: null, // Will be assigned by context
    rawText: rawText.trim(),
    name: '',
    baseType: '',
    itemClass: '',
    itemClassId: null,
    rarity: RARITIES.NORMAL,
    rarityId: getRarityId(RARITIES.NORMAL),
    requirements: {},
    properties: [],
    sockets: '',
    itemLevel: null,
    price: null,
    status: ITEM_STATUS.ACTIVE,
    statusId: 1,
    dateAdded: new Date().toISOString(),
    dateSold: null
  };

  let currentIndex = 0;

  // Parse Item Class (first line)
  if (lines[currentIndex]?.startsWith('Item Class:')) {
    const itemClassText = lines[currentIndex].replace('Item Class:', '').trim();
    item.itemClass = itemClassText;
    item.itemClassId = getItemClassId(itemClassText);
    currentIndex++;
  }

  // Parse Rarity (second line)
  if (lines[currentIndex]?.startsWith('Rarity:')) {
    const rarityText = lines[currentIndex].replace('Rarity:', '').trim();
    item.rarity = rarityText;
    item.rarityId = getRarityId(rarityText);
    currentIndex++;
  }

  // Parse Item Name and Base Type
  if (currentIndex < lines.length) {
    item.name = lines[currentIndex].trim();
    currentIndex++;
  }

  if (currentIndex < lines.length && lines[currentIndex] !== '--------') {
    item.baseType = lines[currentIndex].trim();
    currentIndex++;
  } else if (item.name && !item.baseType) {
    // If no base type found, use name as base type for unique items
    item.baseType = item.name;
  }

  // Skip separator lines
  while (currentIndex < lines.length && lines[currentIndex] === '--------') {
    currentIndex++;
  }

  // Parse remaining properties
  while (currentIndex < lines.length) {
    const line = lines[currentIndex].trim();
    
    if (line === '--------') {
      currentIndex++;
      continue;
    }

    // Parse Requirements
    if (line.startsWith('Requires:')) {
      const requiresText = line.replace('Requires:', '').trim();
      item.requirements = parseRequirements(requiresText);
    }
    // Parse Sockets
    else if (line.startsWith('Sockets:')) {
      item.sockets = line.replace('Sockets:', '').trim();
    }
    // Parse Item Level
    else if (line.startsWith('Item Level:')) {
      const levelText = line.replace('Item Level:', '').trim();
      item.itemLevel = parseInt(levelText) || null;
    }
    // Parse Note (buyout price)
    else if (line.startsWith('Note:')) {
      const noteText = line.replace('Note:', '').trim();
      const parsedPrice = parseNotePrice(noteText);
      if (parsedPrice) {
        item.price = parsedPrice;
      }
      // Don't add the note to properties since it's parsed as price
    }
    // Parse Properties (everything else)
    else if (line && !line.startsWith('--------')) {
      if (item.properties.length < VALIDATION_RULES.PROPERTIES_MAX_COUNT) {
        item.properties.push(line);
      }
    }

    currentIndex++;
  }

  return item;
};

/**
 * Parse buyout price from note text
 * @param {string} noteText - Note text containing price information
 * @returns {Object|null} Price object with amount and currency, or null if not found
 */
const parseNotePrice = (noteText) => {
  if (!noteText || typeof noteText !== 'string') {
    return null;
  }

  // Common price patterns in PoE:
  // ~b/o 34 divine
  // ~price 15 chaos
  // ~buyout 2.5 exalt
  // b/o 10 div
  // price 50 c
  
  const patterns = [
    // Standard patterns with currency names
    /(?:~?(?:b\/o|buyout|price)\s+)(\d+(?:\.\d+)?)\s+(divine?|div)/i,
    /(?:~?(?:b\/o|buyout|price)\s+)(\d+(?:\.\d+)?)\s+(chaos?|c)/i,
    /(?:~?(?:b\/o|buyout|price)\s+)(\d+(?:\.\d+)?)\s+(exalt(?:ed)?|ex|e)/i,
    
    // Just number and currency without prefix
    /(\d+(?:\.\d+)?)\s+(divine?|div)/i,
    /(\d+(?:\.\d+)?)\s+(chaos?|c)/i,
    /(\d+(?:\.\d+)?)\s+(exalt(?:ed)?|ex|e)/i
  ];

  for (const pattern of patterns) {
    const match = noteText.match(pattern);
    if (match) {
      const amount = parseFloat(match[1]);
      const currencyText = match[2].toLowerCase();
      
      let currency = CURRENCIES.CHAOS; // default
      
      if (currencyText.includes('div') || currencyText.includes('divine')) {
        currency = CURRENCIES.DIVINE;
      } else if (currencyText.includes('ex') || currencyText.includes('exalt')) {
        currency = CURRENCIES.EXALTED;
      } else if (currencyText.includes('c') || currencyText.includes('chaos')) {
        currency = CURRENCIES.CHAOS;
      }
      
      return {
        amount: amount,
        currency: currency
      };
    }
  }
  
  return null;
};

/**
 * Parse item requirements string
 * @param {string} requiresText - Requirements text
 * @returns {Object} Requirements object
 */
const parseRequirements = (requiresText) => {
  const requirements = {};
  
  // Parse level requirement
  const levelMatch = requiresText.match(/Level\s+(\d+)/i);
  if (levelMatch) {
    requirements.level = parseInt(levelMatch[1]);
  }

  // Parse attribute requirements
  const intMatch = requiresText.match(/(\d+)\s+Int/i);
  if (intMatch) {
    requirements.intelligence = parseInt(intMatch[1]);
  }

  const strMatch = requiresText.match(/(\d+)\s+Str/i);
  if (strMatch) {
    requirements.strength = parseInt(strMatch[1]);
  }

  const dexMatch = requiresText.match(/(\d+)\s+Dex/i);
  if (dexMatch) {
    requirements.dexterity = parseInt(dexMatch[1]);
  }

  return requirements;
};

/**
 * Get rarity ID from rarity name
 * @param {string} rarityName - Rarity name
 * @returns {number} Rarity ID
 */
const getRarityId = (rarityName) => {
  switch (rarityName) {
    case RARITIES.NORMAL: return 1;
    case RARITIES.MAGIC: return 2;
    case RARITIES.RARE: return 3;
    case RARITIES.UNIQUE: return 4;
    default: return 1;
  }
};

/**
 * Get item class ID from item class name
 * @param {string} itemClassName - Item class name
 * @returns {number|null} Item class ID or null if not found
 */
const getItemClassId = (itemClassName) => {
  const itemClass = ITEM_CLASS_LIST.find(cls => 
    cls.name.toLowerCase() === itemClassName.toLowerCase()
  );
  return itemClass ? itemClass.id : null;
};

/**
 * Validate parsed item
 * @param {Object} item - Parsed item object
 * @returns {Array} Array of validation errors
 */
export const validateItem = (item) => {
  const errors = [];

  if (!item) {
    errors.push('Invalid item data');
    return errors;
  }

  // Validate name
  if (!item.name || item.name.trim() === '') {
    errors.push('Item name is required');
  } else if (item.name.length > VALIDATION_RULES.ITEM_NAME_MAX_LENGTH) {
    errors.push(`Item name must be less than ${VALIDATION_RULES.ITEM_NAME_MAX_LENGTH} characters`);
  }

  // Validate item class
  if (!item.itemClass || item.itemClass.trim() === '') {
    errors.push('Item class is required');
  }

  // Validate rarity
  if (!item.rarity || !Object.values(RARITIES).includes(item.rarity)) {
    errors.push('Valid rarity is required');
  }

  // Validate base type
  if (!item.baseType || item.baseType.trim() === '') {
    errors.push('Base type is required');
  }

  // Validate item level if present
  if (item.itemLevel !== null && (item.itemLevel < 1 || item.itemLevel > 100)) {
    errors.push('Item level must be between 1 and 100');
  }

  // Validate requirements
  if (item.requirements) {
    if (item.requirements.level && (item.requirements.level < 1 || item.requirements.level > 100)) {
      errors.push('Level requirement must be between 1 and 100');
    }
    
    ['intelligence', 'strength', 'dexterity'].forEach(attr => {
      if (item.requirements[attr] && (item.requirements[attr] < 1 || item.requirements[attr] > 1000)) {
        errors.push(`${attr} requirement must be between 1 and 1000`);
      }
    });
  }

  // Validate properties count
  if (item.properties && item.properties.length > VALIDATION_RULES.PROPERTIES_MAX_COUNT) {
    errors.push(`Too many properties (max ${VALIDATION_RULES.PROPERTIES_MAX_COUNT})`);
  }

  return errors;
};

/**
 * Validate item price
 * @param {Object} price - Price object with amount and currency
 * @returns {Array} Array of validation errors
 */
export const validatePrice = (price) => {
  const errors = [];

  if (!price) {
    errors.push('Price is required');
    return errors;
  }

  if (!price.amount || isNaN(price.amount)) {
    errors.push('Valid price amount is required');
  } else {
    const amount = parseFloat(price.amount);
    if (amount < VALIDATION_RULES.PRICE_MIN_VALUE) {
      errors.push(`Price must be at least ${VALIDATION_RULES.PRICE_MIN_VALUE}`);
    }
    if (amount > VALIDATION_RULES.PRICE_MAX_VALUE) {
      errors.push(`Price cannot exceed ${VALIDATION_RULES.PRICE_MAX_VALUE}`);
    }
  }

  if (!price.currency || typeof price.currency !== 'string') {
    errors.push('Valid currency is required');
  }

  return errors;
};

/**
 * Generate a preview of the parsed item (for testing/debugging)
 * @param {Object} item - Parsed item object
 * @returns {string} Item preview string
 */
export const generateItemPreview = (item) => {
  if (!item) return 'Invalid item';

  let preview = `${item.name}`;
  if (item.baseType && item.baseType !== item.name) {
    preview += ` (${item.baseType})`;
  }
  preview += `\nClass: ${item.itemClass} (ID: ${item.itemClassId || 'Unknown'})`;
  preview += `\nRarity: ${item.rarity} (ID: ${item.rarityId})`;
  
  if (item.requirements.level) {
    preview += `\nRequires Level: ${item.requirements.level}`;
  }
  
  if (item.itemLevel) {
    preview += `\nItem Level: ${item.itemLevel}`;
  }
  
  if (item.properties.length > 0) {
    preview += `\nProperties: ${item.properties.length}`;
  }

  if (item.price) {
    preview += `\nPrice: ${item.price.amount} ${item.price.currency}`;
  }

  return preview;
};

/**
 * Clean and normalize item text for better parsing
 * @param {string} rawText - Raw item text
 * @returns {string} Cleaned item text
 */
export const cleanItemText = (rawText) => {
  if (!rawText) return '';
  
  return rawText
    .trim()
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n')   // Handle old Mac line endings
    .replace(/\n+/g, '\n')  // Remove multiple consecutive newlines
    .replace(/^\n|\n$/g, ''); // Remove leading/trailing newlines
};