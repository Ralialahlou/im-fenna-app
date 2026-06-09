import React, { createContext, useContext, useReducer, useCallback } from 'react';

const WishlistContext = createContext(null);

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.ids.includes(action.payload.id);
      return {
        ids: exists
          ? state.ids.filter((id) => id !== action.payload.id)
          : [...state.ids, action.payload.id],
        items: exists
          ? state.items.filter((p) => p.id !== action.payload.id)
          : [...state.items, action.payload],
      };
    }
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { ids: [], items: [] });

  const toggle = useCallback((product) => {
    dispatch({ type: 'TOGGLE', payload: product });
  }, []);

  const isWishlisted = useCallback((id) => state.ids.includes(id), [state.ids]);

  return (
    <WishlistContext.Provider value={{ items: state.items, toggle, isWishlisted, count: state.ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
