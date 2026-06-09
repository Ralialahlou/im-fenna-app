import React, { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, shade, quantity = 1 } = action.payload;
      const key = shade ? `${product.id}-${shade.id}` : product.id;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { key, product, shade, quantity }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.key !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.payload.key ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = useCallback((product, shade = null, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, shade, quantity } });
  }, []);

  const removeItem = useCallback((key) => {
    dispatch({ type: 'REMOVE_ITEM', payload: key });
  }, []);

  const updateQty = useCallback((key, quantity) => {
    if (quantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: key });
    } else {
      dispatch({ type: 'UPDATE_QTY', payload: { key, quantity } });
    }
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const freeShippingThreshold = 80;
  const shippingAmount = subtotal >= freeShippingThreshold ? 0 : 6.95;
  const total = subtotal + shippingAmount;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        subtotal,
        shippingAmount,
        total,
        freeShippingThreshold,
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
