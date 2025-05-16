import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const placeOrder = async (orderPayload) => {
  try {
    const res = await axios.post('http://localhost:8000/orders/place', orderPayload, {
      withCredentials: true
    });

    setCartItems([]);
    toast.success('Order placed successfully!');
  } catch (error) {
    toast.error('Failed to place order');
    console.error(error);
  }
};


  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
    toast.success('Added to cart!');
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.success('Removed from cart!');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};