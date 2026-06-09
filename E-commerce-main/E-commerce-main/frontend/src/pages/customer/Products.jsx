// frontend/src/pages/customer/Products.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import ProductCard from '../../components/customer/ProductCard';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';

const TOKEN = {
  white: '#fff', slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0',
  slate400: '#94a3b8', slate600: '#475569', slate800: '#1e293b', slate900: '#0f172a',
  indigo: '#4f46e5', indigoDark: '#3730a3', indigoLight: '#eef2ff'
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: 0,
    maxPrice: 50000,
    rating: 0,
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { fetchProducts(); fetchCategories(); }, [filters, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        sort: sortBy,
      };
      const { data } = await axios.get('/api/products', { params });
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/products/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'category') {
      if (value) searchParams.set('category', value);
      else searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: 0, maxPrice: 50000, rating: 0 });
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '' && v !== 0 && v !== 50000).length;

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900 }}>All Products</h1>
            <p style={{ color: TOKEN.slate400, marginTop: 4 }}>Discover our curated collection</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px 16px', borderRadius: 30, border: `1px solid ${TOKEN.slate200}`, background: TOKEN.white, fontSize: 13 }}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button style={{ background: TOKEN.white, border: `1px solid ${TOKEN.slate200}`, borderRadius: 30, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <FiGrid /> Grid
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
          {/* Sidebar Filters */}
          <aside style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 24, height: 'fit-content', position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                <FiFilter /> Filters
                {activeFilterCount > 0 && <span style={{ background: TOKEN.indigoLight, color: TOKEN.indigo, fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{activeFilterCount}</span>}
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: TOKEN.indigo, fontSize: 12, cursor: 'pointer' }}>Clear all</button>
              )}
            </div>

            {/* Category */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}>Category</label>
              <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 14, border: `1px solid ${TOKEN.slate200}`, fontSize: 14 }}>
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}>Price Range</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))} style={{ width: '50%', padding: '10px', borderRadius: 12, border: `1px solid ${TOKEN.slate200}` }} />
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))} style={{ width: '50%', padding: '10px', borderRadius: 12, border: `1px solid ${TOKEN.slate200}` }} />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}>Minimum Rating</label>
              <select value={filters.rating} onChange={(e) => handleFilterChange('rating', Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', borderRadius: 14, border: `1px solid ${TOKEN.slate200}` }}>
                <option value={0}>Any</option>
                <option value={4}>4★ & above</option>
                <option value={3}>3★ & above</option>
                <option value={2}>2★ & above</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: TOKEN.slate600 }}>{products.length} products found</span>
            </div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                {[...Array(6)].map((_, i) => <div key={i} style={{ background: TOKEN.white, borderRadius: 20, height: 280, animation: 'pulse 1s infinite' }} />)}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', background: TOKEN.white, padding: 80, borderRadius: 20 }}>
                <p>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                {products.map(product => <ProductCard key={product._id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default Products;