import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      if (error.name === 'QuotaExceededError') {
        // We'll handle this with a modal instead of alert
        throw new Error('Storage quota exceeded. Consider exporting and clearing old items.');
      }
    }
  };

  return [storedValue, setValue];
};

// Helper functions for PoE items
export const usePoEItems = () => {
  const [items, setItems] = useLocalStorage('poeItems', []);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  console.log('🏗️ usePoEItems hook - items length:', items.length, 'updateTrigger:', updateTrigger);

  // Force re-render by incrementing trigger
  const forceUpdate = () => {
    console.log('💫 forceUpdate called, current trigger:', updateTrigger);
    setUpdateTrigger(prev => {
      const newValue = prev + 1;
      console.log('💫 updateTrigger changed from', prev, 'to', newValue);
      return newValue;
    });
  };

  const addItem = (newItem) => {
    const now = new Date().toISOString();
    const item = {
      id: Date.now() + Math.random(),
      createdAt: now,
      status: 'active', // 'active' or 'sold'
      currency: 'divine', // default currency
      priceHistory: [
        {
          price: newItem.expectedPrice,
          changedAt: now,
          reason: 'initial_listing'
        }
      ],
      ...newItem
    };
    setItems(prev => [item, ...prev]);
    forceUpdate();
    return item.id;
  };

  const updateItem = (id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    forceUpdate();
  };

  const updateItemPrice = (id, newPrice) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        // Add to price history
        const newPriceEntry = {
          price: newPrice,
          changedAt: new Date().toISOString(),
          reason: 'manual_update'
        };
        
        const updatedPriceHistory = [newPriceEntry, ...(item.priceHistory || [])];
        
        return {
          ...item,
          expectedPrice: newPrice,
          priceHistory: updatedPriceHistory
        };
      }
      return item;
    }));
    forceUpdate();
  };

  const deleteItem = (id) => {
    console.log('Deleting item with ID:', id, typeof id); // Debug log
    setItems(prev => {
      const newItems = prev.filter(item => {
        // Ensure we're comparing the right types
        const itemId = typeof item.id === 'string' ? parseFloat(item.id) : item.id;
        const targetId = typeof id === 'string' ? parseFloat(id) : id;
        return itemId !== targetId;
      });
      console.log('Items before delete:', prev.length, 'Items after delete:', newItems.length); // Debug log
      return newItems;
    });
    forceUpdate();
  };

  const markAsSold = (id, actualPrice, actualCurrency = null) => {
    const soldAt = new Date().toISOString();
    const currentItem = items.find(item => {
      const itemId = typeof item.id === 'string' ? parseFloat(item.id) : item.id;
      const targetId = typeof id === 'string' ? parseFloat(id) : id;
      return itemId === targetId;
    });
    
    // Add final price to history if different from current price
    const updates = { 
      status: 'sold', 
      actualPrice: parseFloat(actualPrice), 
      actualCurrency: actualCurrency || currentItem?.currency || 'divine',
      soldAt 
    };

    // If the sold price is different from expected price, add it to history
    if (currentItem && parseFloat(actualPrice) !== currentItem.expectedPrice) {
      const finalPriceEntry = {
        price: parseFloat(actualPrice),
        changedAt: soldAt,
        reason: 'final_sale_price'
      };
      
      updates.priceHistory = [finalPriceEntry, ...(currentItem.priceHistory || [])];
    }
    
    updateItem(id, updates);
  };

  const getActiveItems = () => items.filter(item => item.status === 'active');
  const getSoldItems = () => items.filter(item => item.status === 'sold').sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt));

  const getStats = () => {
    const soldItems = getSoldItems();
    const totalProfit = soldItems.reduce((sum, item) => 
      sum + ((item.actualPrice || 0) - (item.expectedPrice || 0)), 0
    );
    const totalRevenue = soldItems.reduce((sum, item) => 
      sum + (item.actualPrice || 0), 0
    );
    
    return {
      activeCount: getActiveItems().length,
      soldCount: soldItems.length,
      totalProfit,
      totalRevenue,
      averageProfit: soldItems.length > 0 ? totalProfit / soldItems.length : 0
    };
  };

  return {
    items,
    addItem,
    updateItem,
    updateItemPrice,
    deleteItem,
    markAsSold,
    getActiveItems,
    getSoldItems,
    getStats,
    exportData: () => items,
    importData: setItems,
    updateTrigger // Export this so components can depend on it
  };
};

export default useLocalStorage;