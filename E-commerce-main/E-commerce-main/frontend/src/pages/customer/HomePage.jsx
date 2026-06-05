import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Welcome to MultiVendor
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover thousands of products from trusted vendors across India
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">Wide Variety</h3>
            <p className="text-gray-600">Thousands of products from multiple vendors across categories.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick shipping and real-time order tracking.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">100% secure transactions with Razorpay and Stripe.</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['electronics', 'clothing', 'home', 'beauty'].map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="bg-white rounded-lg p-6 text-center shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-2">
                  {cat === 'electronics' && '📱'}
                  {cat === 'clothing' && '👕'}
                  {cat === 'home' && '🏠'}
                  {cat === 'beauty' && '💄'}
                </div>
                <h3 className="font-semibold capitalize">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;