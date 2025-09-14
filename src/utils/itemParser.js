import { RARITIES, ITEM_STATUS } from './constants';

export const parseItemText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  const lines = rawText.trim().split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) {
    return null;
  }

  const item = {
    id: Date.now(), // Temporary ID, will be replaced by proper ID system
    rawText: rawText.trim(),
    name: '',
    baseType: '',
    itemClass: '',
    rarity: RARITIES.NORMAL,
    requirements: {},
    properties: [],
    sockets: '',
    itemLevel: null,
    price: null,
    status: ITEM_STATUS.ACTIVE,
    dateAdded: new Date().toISOString()
  };

  let currentIndex = 0;

  // Parse Item Class (first line)
  if (lines[currentIndex]?.startsWith('Item Class:')) {
    item.itemClass = lines[currentIndex].replace('Item Class:', '').trim();
    currentIndex++;
  }

  // Parse Rarity (second line)
  if (lines[currentIndex]?.startsWith('Rarity:')) {
    const rarityText = lines[currentIndex].replace('Rarity:', '').trim();
    item.rarity = rarityText;
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
    // Parse Properties (everything else)
    else if (line && !line.startsWith('--------')) {
      item.properties.push(line);
    }

    currentIndex++;
  }

  return item;
};

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

// Validate parsed item
export const validateItem = (item) => {
  const errors = [];

  if (!item) {
    errors.push('Invalid item data');
    return errors;
  }

  if (!item.name || item.name.trim() === '') {
    errors.push('Item name is required');
  }

  if (!item.itemClass || item.itemClass.trim() === '') {
    errors.push('Item class is required');
  }

  if (!item.rarity || !Object.values(RARITIES).includes(item.rarity)) {
    errors.push('Valid rarity is required');
  }

  return errors;
};

// Generate a preview of the parsed item (for testing)
export const generateItemPreview = (item) => {
  if (!item) return 'Invalid item';

  let preview = `${item.name}`;
  if (item.baseType) preview += ` (${item.baseType})`;
  preview += `\nClass: ${item.itemClass}`;
  preview += `\nRarity: ${item.rarity}`;
  
  if (item.requirements.level) {
    preview += `\nRequires Level: ${item.requirements.level}`;
  }
  
  if (item.itemLevel) {
    preview += `\nItem Level: ${item.itemLevel}`;
  }
  
  if (item.properties.length > 0) {
    preview += `\nProperties: ${item.properties.length}`;
  }

  return preview;
};