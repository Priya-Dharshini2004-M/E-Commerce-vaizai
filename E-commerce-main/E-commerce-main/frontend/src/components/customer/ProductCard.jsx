import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product._id, 1);
    toast.success('Added to cart');
  };

  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden h-56">
          <img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          {product.compareAtPrice > product.price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Sale</span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-blue-600 transition">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xl font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">₹{product.compareAtPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex gap-1">
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <FiHeart className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
        >
          <FiShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;