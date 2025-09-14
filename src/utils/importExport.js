// src/utils/importExport.js
import { STORAGE_KEYS } from './constants';

/**
 * Export items data to JSON file
 * @param {Array} items - Array of items to export
 * @param {string} filename - Optional custom filename
 */
export const exportItemsToFile = (items, filename = null) => {
  try {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      totalItems: items.length,
      activeItems: items.filter(item => item.status === 'active').length,
      soldItems: items.filter(item => item.status === 'sold').length,
      items: items
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const defaultFilename = `poe-sales-tracker-${new Date().toISOString().split('T')[0]}.json`;
    link.download = filename || defaultFilename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    return { success: true, itemCount: items.length };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Parse and validate imported JSON file
 * @param {File} file - File object from input
 * @returns {Promise} Promise resolving to parsed data or error
 */
export const importItemsFromFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.name.endsWith('.json')) {
      reject(new Error('Please select a valid JSON file'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      reject(new Error('File is too large. Maximum size is 10MB'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const validationResult = validateImportData(jsonData);
        
        if (validationResult.isValid) {
          resolve({
            success: true,
            data: jsonData,
            items: jsonData.items || [],
            metadata: {
              version: jsonData.version || 'unknown',
              exportDate: jsonData.exportDate,
              totalItems: jsonData.totalItems || jsonData.items?.length || 0
            }
          });
        } else {
          reject(new Error(validationResult.errors.join(', ')));
        }
      } catch (parseError) {
        reject(new Error('Invalid JSON file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validate imported data structure
 * @param {Object} data - Parsed JSON data
 * @returns {Object} Validation result
 */
const validateImportData = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format');
    return { isValid: false, errors };
  }
  
  if (!Array.isArray(data.items)) {
    errors.push('Items array is missing or invalid');
    return { isValid: false, errors };
  }
  
  // Validate each item has required fields
  const requiredFields = ['name', 'baseType', 'rarity', 'status'];
  const invalidItems = [];
  
  data.items.forEach((item, index) => {
    const missingFields = requiredFields.filter(field => !item[field]);
    if (missingFields.length > 0) {
      invalidItems.push(`Item ${index + 1}: missing ${missingFields.join(', ')}`);
    }
  });
  
  if (invalidItems.length > 0 && invalidItems.length > data.items.length * 0.1) {
    // If more than 10% of items are invalid, reject the import
    errors.push('Too many invalid items found');
    errors.push(...invalidItems.slice(0, 5)); // Show first 5 errors
    if (invalidItems.length > 5) {
      errors.push(`... and ${invalidItems.length - 5} more errors`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: invalidItems.length > 0 && invalidItems.length <= data.items.length * 0.1 ? 
      [`${invalidItems.length} items have missing data and will be skipped`] : []
  };
};

/**
 * Merge imported items with existing items
 * @param {Array} existingItems - Current items array
 * @param {Array} importedItems - Items from import
 * @param {Object} options - Merge options
 * @returns {Object} Merge result
 */
export const mergeImportedItems = (existingItems, importedItems, options = {}) => {
  const {
    skipDuplicates = true,
    overwriteExisting = false,
    preserveIds = false
  } = options;
  
  let mergedItems = [...existingItems];
  let addedCount = 0;
  let skippedCount = 0;
  let updatedCount = 0;
  
  // Get the next available ID
  const getNextId = () => {
    const maxId = Math.max(0, ...mergedItems.map(item => item.id || 0));
    return maxId + 1;
  };
  
  let nextId = getNextId();
  
  importedItems.forEach(importedItem => {
    // Clean up the imported item
    const cleanItem = {
      ...importedItem,
      id: preserveIds && importedItem.id ? importedItem.id : nextId++,
      dateAdded: importedItem.dateAdded || new Date().toISOString(),
      priceHistory: importedItem.priceHistory || (importedItem.price ? [{
        id: 1,
        price: importedItem.price,
        date: importedItem.dateAdded || new Date().toISOString()
      }] : [])
    };
    
    if (skipDuplicates) {
      // Check for duplicates based on name and baseType
      const duplicate = mergedItems.find(existing => 
        existing.name === cleanItem.name && 
        existing.baseType === cleanItem.baseType &&
        existing.rarity === cleanItem.rarity
      );
      
      if (duplicate) {
        if (overwriteExisting) {
          const index = mergedItems.findIndex(item => item.id === duplicate.id);
          mergedItems[index] = { ...cleanItem, id: duplicate.id };
          updatedCount++;
        } else {
          skippedCount++;
        }
        return;
      }
    }
    
    mergedItems.push(cleanItem);
    addedCount++;
  });
  
  return {
    items: mergedItems,
    stats: {
      added: addedCount,
      skipped: skippedCount,
      updated: updatedCount,
      total: mergedItems.length
    }
  };
};

/**
 * Create a backup of current data before import
 * @param {Array} items - Current items to backup
 */
export const createBackup = (items) => {
  try {
    const backupKey = `${STORAGE_KEYS.ITEMS}_backup_${Date.now()}`;
    const backupData = {
      timestamp: new Date().toISOString(),
      items: items,
      originalKey: STORAGE_KEYS.ITEMS
    };
    
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    
    // Keep only the 3 most recent backups
    const allKeys = Object.keys(localStorage);
    const backupKeys = allKeys
      .filter(key => key.startsWith(`${STORAGE_KEYS.ITEMS}_backup_`))
      .sort()
      .reverse();
    
    // Remove old backups beyond the 3 most recent
    backupKeys.slice(3).forEach(key => {
      localStorage.removeItem(key);
    });
    
    return { success: true, backupKey };
  } catch (error) {
    console.error('Backup creation failed:', error);
    return { success: false, error: error.message };
  }
};