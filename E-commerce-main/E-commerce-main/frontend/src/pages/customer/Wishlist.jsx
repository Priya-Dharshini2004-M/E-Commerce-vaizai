// frontend/src/pages/customer/Wishlist.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import ProductCard from '../../components/customer/ProductCard';
import { FiHeart } from 'react-icons/fi';

const TOKEN = {
  slate50: '#f8fafc', slate900: '#0f172a', slate400: '#94a3b8', white: '#fff', slate100: '#f1f5f9'
};

const Wishlist = () => {
  const { token } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } });
      setWishlist(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ background: TOKEN.slate50, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900, marginBottom: 8 }}>My Wishlist</h1>
        <p style={{ color: TOKEN.slate400, marginBottom: 32 }}>Products you've saved for later</p>
        {wishlist.products.length === 0 ? (
          <div style={{ textAlign: 'center', background: TOKEN.white, padding: 80, borderRadius: 20 }}>
            <FiHeart size={48} style={{ color: TOKEN.slate400, marginBottom: 16 }} />
            <p>Your wishlist is empty.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {wishlist.products.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;