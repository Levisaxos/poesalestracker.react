import { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS, ITEM_STATUS } from '../utils/constants';

const ItemsContext = createContext();

// Action types
const ACTIONS = {
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  MARK_AS_SOLD: 'MARK_AS_SOLD',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null
};

// Reducer
const itemsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null
      };

    case ACTIONS.ADD_ITEM:
      const newItem = {
        ...action.payload,
        id: Date.now() + Math.random(), // Generate unique ID
        dateAdded: new Date().toISOString(),
        status: ITEM_STATUS.ACTIVE
      };
      return {
        ...state,
        items: [newItem, ...state.items],
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

// Provider component
export const ItemsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(itemsReducer, initialState);

  // Load items from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        dispatch({ type: ACTIONS.SET_ITEMS, payload: parsedItems });
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

  // Action creators
  const addItem = (item) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: item });
  };

  const updateItem = (id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_ITEM, payload: { id, updates } });
  };

  const deleteItem = (id) => {
    dispatch({ type: ACTIONS.DELETE_ITEM, payload: id });
  };

  const markAsSold = (id) => {
    dispatch({ type: ACTIONS.MARK_AS_SOLD, payload: id });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  };

  // Computed values
  const activeItems = state.items.filter(item => item.status === ITEM_STATUS.ACTIVE);
  const soldItems = state.items.filter(item => item.status === ITEM_STATUS.SOLD);
  
  const totalActiveValue = activeItems.reduce((sum, item) => {
    if (item.price && item.price.amount) {
      // Convert all currencies to chaos for calculation (simplified)
      const multipliers = { chaos: 1, divine: 200, exalted: 150 }; // Example rates
      return sum + (item.price.amount * (multipliers[item.price.currency] || 1));
    }
    return sum;
  }, 0);

  const totalRevenue = soldItems.reduce((sum, item) => {
    if (item.price && item.price.amount) {
      const multipliers = { chaos: 1, divine: 200, exalted: 150 };
      return sum + (item.price.amount * (multipliers[item.price.currency] || 1));
    }
    return sum;
  }, 0);

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
    
    // Actions
    addItem,
    updateItem,
    deleteItem,
    markAsSold,
    setError,
    clearError
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