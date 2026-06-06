import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data);
    } catch (error) {
      console.error('Fetch cart error:', error.response?.data);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      toast.error('Please login');
      return false;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/cart', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data);
      toast.success('Added to cart');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) return;
    try {
      const { data } = await axios.put('/api/cart/update', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data);
    } catch (error) {
      toast.error('Update failed');
    }
  };
  
  const removeItem = async (productId) => {
    if (!token) return;
    try {
      const { data } = await axios.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data);
      toast.success('Removed');
    } catch (error) {
      toast.error('Remove failed');
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await axios.delete('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Clear error');
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, refetch: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};