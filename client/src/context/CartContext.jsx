import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateLocalCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    if (isLoggedIn) {
      try {
        const res = await axios.post(
          'https://gym-project-server.onrender.com/cart/add',
          {
            productId: product._id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          updateLocalCart(product); // reflect instantly in UI
          toast.success('Added to cart!');
        } else {
          toast.error(res.data.message || 'Server error');
        }
      } catch (err) {
        console.error('Add to cart error:', err.response?.data || err.message);
        toast.error('Add to cart failed');
      }
    } else {
      updateLocalCart(product);
      toast.success('Added to cart (local)');
    }
  };

  const syncCartOnLogin = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      for (const item of cartItems) {
        await axios.post(
          'https://gym-project-server.onrender.com/cart/add',
          {
            productId: item._id,
            quantity: item.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      }
      toast.success('Cart synced!');
      // Optionally: clear local cart after syncing
      // setCartItems([]);
    } catch (error) {
      console.error('Cart sync failed:', error);
      toast.error('Cart sync failed');
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, syncCartOnLogin }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
