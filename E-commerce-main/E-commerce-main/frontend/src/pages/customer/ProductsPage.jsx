import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/customer/ProductCard';
import { FiSearch, FiChevronRight, FiSliders, FiTrash2, FiTag, FiShoppingBag } from 'react-icons/fi';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Categories lists
  const categories = [
    { name: 'All Offers', icon: '🏷️', value: '' },
    { name: 'Mobiles', icon: '📱', value: 'electronics' },
    { name: 'Electronics', icon: '💻', value: 'electronics' },
    { name: 'Fashion', icon: '👗', value: 'clothing' },
    { name: 'Home & Living', icon: '🏠', value: 'home' },
    { name: 'Appliances', icon: '🔌', value: 'home' },
    { name: 'Travel Packs', icon: '✈️', value: 'other' },
    { name: 'Beauty & Toys', icon: '🎀', value: 'beauty' },
  ];

  // Deal card items
  const deals = [
    { id: 1, title: 'Best of Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200', link: '/products?category=electronics' },
    { id: 2, title: 'Fashion Store', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200', link: '/products?category=clothing' },
    { id: 3, title: 'Home & Living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200', link: '/products?category=home' },
    { id: 4, title: 'Beauty Picks', image: 'https://images.pexels.com/photos/11924085/pexels-photo-11924085.jpeg', link: '/products?category=beauty' },
    { id: 5, title: 'Toys & Games', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200', link: '/products?category=toys' },
    { id: 6, title: 'Books Hub', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200', link: '/products?category=books' },
  ];

  // Banners carousel list
  const heroOffers = [
    {
      title: 'BIG BACHAT DHAMAKA',
      subtitle: 'Great Deals on Your Favorites',
      date: '26th - 28th AUG',
      cta: 'Wishlist Now',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1000&auto=format',
      gradient: 'from-indigo-900/95 via-purple-900/90 to-slate-900/95',
    },
    {
      title: 'ELECTRONICS SALE',
      subtitle: 'Up to 70% Off on Latest Gadgets',
      date: 'Limited Period',
      cta: 'Shop Now',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1000&auto=format',
      gradient: 'from-blue-900/95 via-indigo-900/90 to-slate-900/95',
    },
    {
      title: 'FASHION WEEK',
      subtitle: 'Trendy Styles at Unbeatable Prices',
      date: 'Ends Soon',
      cta: 'Explore',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&auto=format',
      gradient: 'from-pink-950/95 via-rose-900/90 to-slate-900/95',
    },
    {
      title: 'HOME & LIVING',
      subtitle: 'Make Your Home Beautiful',
      date: 'Free Delivery',
      cta: 'Shop Now',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1000&auto=format',
      gradient: 'from-emerald-950/95 via-teal-900/90 to-slate-900/95',
    },
  ];

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroOffers.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentHero = heroOffers[heroIndex];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, searchQuery, priceRange]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (priceRange.min) filtered = filtered.filter(p => p.price >= parseInt(priceRange.min));
    if (priceRange.max) filtered = filtered.filter(p => p.price <= parseInt(priceRange.max));
    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm">
                <div className="bg-slate-100 animate-pulse rounded-xl h-48 w-full" />
                <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
                <div className="h-8 bg-slate-100 rounded-lg animate-pulse w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Category Navigation Bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className={`flex items-center gap-6 overflow-x-auto pb-1 ${styles.categoryScroll}`}>
            {categories.map((cat, idx) => {
              const active = selectedCategory === cat.value && (cat.value !== '' || selectedCategory === '');
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex flex-col items-center min-w-[76px] px-3 py-1.5 rounded-xl transition-all duration-200 group ${
                    active 
                      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl mb-1 filter drop-shadow-sm group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="text-[11px] font-medium tracking-wide whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Offer Banner - Rotating Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl aspect-[21/9] sm:aspect-[3/1] md:aspect-[3.5/1]">
          {/* Background Rotating Image */}
          <div className="absolute inset-0 opacity-40">
            <img src={currentHero.image} alt="Offer" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" />
          </div>
          {/* Accent Color overlays */}
          <div className={`absolute inset-0 bg-gradient-to-r ${currentHero.gradient}`} />
          
          <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-12 gap-6">
            <div className="text-center md:text-left flex flex-col justify-center h-full">
              <span className="inline-flex max-w-fit items-center gap-1.5 px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 rounded-full text-xs font-bold tracking-wider mb-3 mx-auto md:mx-0">
                <FiTag className="w-3.5 h-3.5" />
                {currentHero.date}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">{currentHero.title}</h2>
              <p className="text-sm sm:text-lg text-slate-300 mt-2 font-medium">{currentHero.subtitle}</p>
              <div className="mt-5">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  {currentHero.cta}
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex h-full items-center">
              <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-3 hover:rotate-0 transition-transform duration-300">
                <img src={currentHero.image} alt="Offer badge" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {heroOffers.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setHeroIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === heroIndex ? 'w-6 bg-yellow-400' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Featured Deals (Horizontal Slider) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Best Deals of the Season</h2>
            <p className="text-xs text-slate-400">Discover premium selections at limited time values.</p>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1 group">
            <span>View All Deals</span>
            <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        
        <div className={`flex gap-4 overflow-x-auto pb-4 ${styles.categoryScroll}`}>
          {deals.map(deal => (
            <a 
              key={deal.id} 
              href={deal.link} 
              className="min-w-[170px] sm:min-w-[190px] bg-white rounded-2xl border border-slate-100 p-4 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm"
            >
              <div className="w-24 h-24 mx-auto rounded-xl bg-slate-50 flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform">
                <img src={deal.image} alt={deal.title} className="max-w-full max-h-full object-contain rounded-lg" />
              </div>
              <p className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{deal.title}</p>
              <span className="text-[10px] font-semibold text-indigo-600 mt-1 block tracking-wider uppercase">Shop Now</span>
            </a>
          ))}
        </div>
      </div>

      {/* Search Console */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-xl group-focus-within:bg-indigo-500/10 transition-colors" />
          <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search for premium products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 shadow-sm transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Shop Listing Grid Layout */}
      <div className={styles.mainContainer}>
        {/* Sticky Filters Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <FiSliders className="text-indigo-600 w-5 h-5" />
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">Filters</h3>
            </div>

            {/* Categories filter Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5 shadow-sm">
              <h3 className="font-extrabold text-sm text-slate-900 mb-4 tracking-wider uppercase flex items-center gap-1.5">
                <FiShoppingBag className="text-slate-400 w-4 h-4" />
                <span>Categories</span>
              </h3>
              <div className="space-y-1">
                <button 
                  onClick={() => setSelectedCategory('')} 
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    selectedCategory === '' 
                      ? 'bg-indigo-50 text-indigo-600 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  All Products
                </button>
                {['electronics', 'clothing', 'home', 'beauty', 'toys', 'books', 'other'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all capitalize flex items-center justify-between ${
                      selectedCategory === cat 
                        ? 'bg-indigo-50 text-indigo-600 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5 shadow-sm">
              <h3 className="font-extrabold text-sm text-slate-900 mb-4 tracking-wider uppercase">
                💰 Budget
              </h3>
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">MIN price</label>
                  <input 
                    type="number" 
                    placeholder="₹ Min" 
                    value={priceRange.min} 
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} 
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium" 
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">MAX price</label>
                  <input 
                    type="number" 
                    placeholder="₹ Max" 
                    value={priceRange.max} 
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} 
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium" 
                  />
                </div>
              </div>
            </div>

            {/* Clear Button */}
            <button 
              onClick={clearFilters} 
              className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 border border-transparent hover:border-rose-100"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </aside>

        {/* Product listing container */}
        <main className={styles.productArea}>
          <div className="flex items-center justify-between mb-5 px-1">
            <p className="text-sm text-slate-500">
              Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> premium results
            </p>
            <div className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg capitalize font-bold">
              {selectedCategory ? `Filter: ${selectedCategory}` : 'Catalog: All'}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-lg text-slate-800">No products match your criteria</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">Try resetting your price limits, changing keywords, or choosing another category.</p>
              <button 
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;