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
        alert('Storage quota exceeded. Consider exporting and clearing old items.');
      }
    }
  };

  return [storedValue, setValue];
};

// Helper functions for PoE items
export const usePoEItems = () => {
  const [items, setItems] = useLocalStorage('poeItems', []);

  const addItem = (newItem) => {
    const item = {
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      status: 'active', // 'active' or 'sold'
      currency: 'divine', // default currency
      ...newItem
    };
    setItems(prev => [item, ...prev]);
    return item.id;
  };

  const updateItem = (id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id) => {
    console.log('Deleting item with ID:', id); // Debug log
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      console.log('Items before delete:', prev.length, 'Items after delete:', newItems.length); // Debug log
      return newItems;
    });
  };

  const markAsSold = (id, actualPrice, actualCurrency = null) => {
    const soldAt = new Date().toISOString();
    updateItem(id, { 
      status: 'sold', 
      actualPrice: parseFloat(actualPrice), 
      actualCurrency: actualCurrency || items.find(item => item.id === id)?.currency || 'divine',
      soldAt 
    });
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
    deleteItem,
    markAsSold,
    getActiveItems,
    getSoldItems,
    getStats,
    exportData: () => items,
    importData: setItems
  };
};

export default useLocalStorage;