// src/context/ItemsContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS, ITEM_STATUS } from '../utils/constants';

const ItemsContext = createContext();

// Action types
const ACTIONS = {
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  UPDATE_ITEM_PRICE: 'UPDATE_ITEM_PRICE',
  DELETE_ITEM: 'DELETE_ITEM',
  MARK_AS_SOLD: 'MARK_AS_SOLD',
  REPLACE_ALL_ITEMS: 'REPLACE_ALL_ITEMS',
  REMOVE_PRICE_HISTORY_ENTRY: 'REMOVE_PRICE_HISTORY_ENTRY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  nextId: 1
};

// Helper function to generate next integer ID
const getNextId = (items) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id || 0)) + 1;
};

// Helper function to get next history ID for an item
const getNextHistoryId = (priceHistory) => {
  if (!priceHistory || priceHistory.length === 0) return 1;
  return Math.max(...priceHistory.map(entry => entry.id || 0)) + 1;
};

// Reducer
const itemsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
        nextId: getNextId(action.payload),
        loading: false,
        error: null
      };

    case ACTIONS.REPLACE_ALL_ITEMS:
      const normalizedItems = action.payload.map((item, index) => ({
        ...item,
        id: item.id && Number.isInteger(item.id) ? item.id : getNextId(action.payload) + index
      }));
      
      return {
        ...state,
        items: normalizedItems,
        nextId: getNextId(normalizedItems),
        loading: false,
        error: null
      };

    case ACTIONS.ADD_ITEM:
      const newItem = {
        ...action.payload,
        id: state.nextId,
        dateAdded: new Date().toISOString(),
        status: ITEM_STATUS.ACTIVE,
        priceHistory: action.payload.price ? [{
          id: 1,
          price: action.payload.price,
          date: new Date().toISOString()
        }] : []
      };
      return {
        ...state,
        items: [newItem, ...state.items],
        nextId: state.nextId + 1,
        error: null
      };

    case ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
        error: null
      };

    case ACTIONS.UPDATE_ITEM_PRICE:
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.id) {
            const currentHistory = item.priceHistory || [];
            const newHistoryEntry = {
              id: getNextHistoryId(currentHistory),
              price: action.payload.price,
              date: new Date().toISOString()
            };
            
            return {
              ...item,
              price: action.payload.price,
              priceHistory: [...currentHistory, newHistoryEntry],
              lastPriceUpdate: new Date().toISOString()
            };
          }
          return item;
        }),
        error: null
      };

    case ACTIONS.REMOVE_PRICE_HISTORY_ENTRY:
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.itemId) {
            const updatedHistory = item.priceHistory.filter(
              entry => entry.id !== action.payload.historyId
            );
            
            // If we're removing the last entry, update the current price to the previous one
            let updatedPrice = item.price;
            if (updatedHistory.length > 0) {
              // Sort by date to get the most recent remaining entry
              const sortedHistory = updatedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
              updatedPrice = sortedHistory[0].price;
            }
            
            return {
              ...item,
              price: updatedHistory.length > 0 ? updatedPrice : null,
              priceHistory: updatedHistory,
              lastPriceUpdate: new Date().toISOString()
            };
          }
          return item;
        }),
        error: null
      };

    case ACTIONS.DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        error: null
      };

    case ACTIONS.MARK_AS_SOLD:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { 
                ...item, 
                status: ITEM_STATUS.SOLD, 
                dateSold: new Date().toISOString() 
              }
            : item
        ),
        error: null
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

// Currency conversion rates (normalized to chaos orbs)
const CURRENCY_RATES = {
  chaos: 1,
  divine: 200,
  exalted: 150
};

// Provider component
export const ItemsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(itemsReducer, initialState);

  // Load items from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        const normalizedItems = parsedItems.map((item, index) => ({
          ...item,
          id: item.id && Number.isInteger(item.id) ? item.id : index + 1,
          priceHistory: item.priceHistory || (item.price ? [{
            id: 1,
            price: item.price,
            date: item.dateAdded || new Date().toISOString()
          }] : [])
        }));
        dispatch({ type: ACTIONS.SET_ITEMS, payload: normalizedItems });
      } else {
        dispatch({ type: ACTIONS.SET_ITEMS, payload: [] });
      }
    } catch (error) {
      console.error('Error loading items from storage:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load saved items' });
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving items to storage:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to save items' });
    }
  }, [state.items]);

  // Helper function to convert price to chaos orbs
  const convertToChaos = (price) => {
    if (!price || !price.amount) return 0;
    const rate = CURRENCY_RATES[price.currency] || 1;
    return price.amount * rate;
  };

  // Action creators
  const addItem = (item) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: item });
  };

  const updateItem = (id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_ITEM, payload: { id: parseInt(id), updates } });
  };

  const updateItemPrice = (id, price) => {
    dispatch({ type: ACTIONS.UPDATE_ITEM_PRICE, payload: { id: parseInt(id), price } });
  };

  const deleteItem = (id) => {
    dispatch({ type: ACTIONS.DELETE_ITEM, payload: parseInt(id) });
  };

  const markAsSold = (id) => {
    dispatch({ type: ACTIONS.MARK_AS_SOLD, payload: parseInt(id) });
  };

  const removePriceHistoryEntry = (itemId, historyId) => {
    dispatch({ 
      type: ACTIONS.REMOVE_PRICE_HISTORY_ENTRY, 
      payload: { itemId: parseInt(itemId), historyId: parseInt(historyId) }
    });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  };

  const setItems = (items) => {
    dispatch({ type: ACTIONS.REPLACE_ALL_ITEMS, payload: items });
  };

  // Computed values
  const activeItems = state.items.filter(item => item.status === ITEM_STATUS.ACTIVE);
  const soldItems = state.items.filter(item => item.status === ITEM_STATUS.SOLD);
  
  const totalActiveValue = activeItems.reduce((sum, item) => {
    return sum + convertToChaos(item.price);
  }, 0);

  const totalRevenue = soldItems.reduce((sum, item) => {
    return sum + convertToChaos(item.price);
  }, 0);

  // Statistics
  const getItemStats = () => {
    return {
      totalItems: state.items.length,
      activeCount: activeItems.length,
      soldCount: soldItems.length,
      totalActiveValueChaos: Math.round(totalActiveValue),
      totalRevenueChaos: Math.round(totalRevenue),
      averageSalePrice: soldItems.length > 0 ? Math.round(totalRevenue / soldItems.length) : 0,
      recentSales: soldItems.filter(item => {
        if (!item.dateSold) return false;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(item.dateSold) > weekAgo;
      }).length
    };
  };

  const value = {
    // State
    items: state.items,
    activeItems,
    soldItems,
    loading: state.loading,
    error: state.error,
    
    // Stats
    totalActiveValue,
    totalRevenue,
    stats: getItemStats(),
    
    // Actions
    addItem,
    updateItem,
    updateItemPrice,
    deleteItem,
    markAsSold,
    removePriceHistoryEntry,
    setError,
    clearError,
    setItems,
    
    // Helper functions
    convertToChaos
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to use the context
export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};