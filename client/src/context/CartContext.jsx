import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateLocalCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    try {
      if (isLoggedIn) {
        const response = await axios.post(
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

        if (response.data.success) {
          updateLocalCart(product); // Optional: update local for UI sync
          toast.success('Added to cart!');
        } else {
          toast.error(response.data.message || 'Failed to add to cart');
        }
      } else {
        updateLocalCart(product);
        toast.success('Added to cart (local)!');
      }
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Please log in to sync your cart');
      } else {
        toast.error('Failed to add to cart');
      }
    }
  };

  const syncCartOnLogin = async () => {
    try {
      const token = localStorage.getItem('token');
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
      toast.success('Cart synced to server!');
    } catch (error) {
      console.error('Sync cart error:', error.message);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    toast.success('Removed from cart!');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared!');
  };

  const setAuthenticated = (status) => {
    setIsAuthenticated(status);
    if (status) syncCartOnLogin();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        setAuthenticated,
        isAuthenticated,
      }}
    >
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

export default CartContext;
