import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/customer/ProductCard';
import { FiSearch, FiChevronRight } from 'react-icons/fi';
import styles from './ProductsPage.module.css';



const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Category icons (Flipkart style)
  const categories = [
    { name: 'Top Offers', icon: '🏷️', value: '' },
    { name: 'Mobiles', icon: '📱', value: 'electronics' },
    { name: 'Electronics', icon: '💻', value: 'electronics' },
    { name: 'Fashion', icon: '👗', value: 'clothing' },
    { name: 'Home', icon: '🏠', value: 'home' },
    { name: 'Appliances', icon: '🔌', value: 'home' },
    { name: 'Travel', icon: '✈️', value: 'other' },
    { name: 'Beauty & Toys', icon: '🎀', value: 'beauty' },
  ];

  // Deal cards data
  const deals = [
    { id: 1, title: 'Best of Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200', link: '/products?category=electronics' },
    { id: 2, title: 'Fashion Store', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200', link: '/products?category=clothing' },
    { id: 3, title: 'Home & Living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200', link: '/products?category=home' },
    { id: 4, title: 'Beauty Picks', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc6efae2?w=200', link: '/products?category=beauty' },
    { id: 5, title: 'Toys & Games', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200', link: '/products?category=toys' },
    { id: 6, title: 'Books Hub', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200', link: '/products?category=books' },
  ];

  // Hero offer data
    // Hero offer data (array for rotation)
    const heroOffers = [
      {
        title: 'BIG BACHAT DHAMAKA',
        subtitle: 'Great Deals on Your Favorites',
        date: '26th - 28th AUG',
        cta: 'Wishlist Now',
        image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format',
      },
      {
        title: 'ELECTRONICS SALE',
        subtitle: 'Up to 70% Off on Latest Gadgets',
        date: 'Limited Period',
        cta: 'Shop Now',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format',
      },
      {
        title: 'FASHION WEEK',
        subtitle: 'Trendy Styles at Unbeatable Prices',
        date: 'Ends Soon',
        cta: 'Explore',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format',
      },
      {
        title: 'HOME & LIVING',
        subtitle: 'Make Your Home Beautiful',
        date: 'Free Delivery',
        cta: 'Shop Now',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&auto=format',
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
      <div className="container mx-auto px-4 py-20">
        <div className={styles.productGrid}>
          {[...Array(10)].map((_, i) => <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      {/* Category Icons Row (without top nav) */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center overflow-x-auto pb-2 gap-4">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex flex-col items-center min-w-[70px] group ${selectedCategory === cat.value ? 'text-blue-600' : 'text-gray-600'}`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs font-medium group-hover:text-blue-600">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

            {/* Hero Banner – Rotating */}
            <div className="container mx-auto px-4 mt-4">
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg transition-all duration-1000">
          <div className="absolute inset-0 opacity-20 transition-opacity duration-1000">
            <img src={currentHero.image} alt="Offer" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">{currentHero.title}</h2>
              <p className="text-lg mt-2">{currentHero.subtitle}</p>
              <p className="text-sm opacity-80 mt-1">{currentHero.date}</p>
              <button className="mt-4 bg-yellow-500 text-gray-900 px-6 py-2 rounded-md font-semibold hover:bg-yellow-400 transition">
                {currentHero.cta}
              </button>
            </div>
            <img src={currentHero.image} alt="Offer" className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-full mt-4 md:mt-0" />
          </div>
        </div>
      </div>

      {/* Deal Cards (Horizontal Scroll) */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Best of Electronics</h2>
          <button className="text-blue-600 text-sm flex items-center gap-1">VIEW ALL <FiChevronRight /></button>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4">
            {deals.map(deal => (
              <a key={deal.id} href={deal.link} className="min-w-[180px] bg-white rounded-lg shadow p-3 text-center hover:shadow-md transition">
                <img src={deal.image} alt={deal.title} className="w-24 h-24 mx-auto object-contain" />
                <p className="font-medium mt-2 text-sm">{deal.title}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar (placed above product grid) */}
            {/* Search Bar (placed above product grid) */}
            <div className="container mx-auto px-4 mt-6 pb-8">
        <div className="relative max-w-2xl mx-auto">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Main Products Grid (Filters + Products) */}
      <div className={styles.mainContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <h3 className="font-semibold text-lg mb-3">📁 Categories</h3>
              <div className="space-y-1">
                <button onClick={() => setSelectedCategory('')} className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${selectedCategory === '' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}>🎯 All</button>
                {['electronics', 'clothing', 'home', 'beauty', 'toys', 'books', 'other'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 capitalize ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}>📦 {cat}</button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <h3 className="font-semibold text-lg mb-3">💰 Price Range</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min ₹" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} className="w-1/2 border rounded-lg px-3 py-2 text-sm" />
                <input type="number" placeholder="Max ₹" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} className="w-1/2 border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <button onClick={clearFilters} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Clear all filters</button>
          </div>
        </aside>

        <main className={styles.productArea}>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Showing <span className="font-semibold">{filteredProducts.length}</span> products</p>
            <div className="text-sm text-gray-400 hidden md:block">{selectedCategory ? `Category: ${selectedCategory}` : 'All categories'}</div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center"><p className="text-gray-500">No products found.</p></div>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;