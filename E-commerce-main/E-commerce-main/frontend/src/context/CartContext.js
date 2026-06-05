import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart');
      setCart(data);
    } catch (error) {
      console.error('Cart fetch error', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/cart', { productId, quantity });
      setCart(data);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.put('/api/cart/update', { productId, quantity });
      setCart(data);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/cart/${productId}`);
      setCart(data);
      toast.success('Removed');
    } catch (error) {
      toast.error('Remove failed');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Clear cart error');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, refetch: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};