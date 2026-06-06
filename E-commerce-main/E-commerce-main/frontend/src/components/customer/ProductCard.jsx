import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    console.log('Adding product:', product._id); // Debug
    addToCart(product._id, 1);
  };

  // Calculate discount percentage
  const discountPercent = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="block relative">
        <div className="relative pb-[100%] overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0]?.url || 'https://picsum.photos/id/1/300/300'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>
        {/* {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discountPercent}% OFF
          </span>
        )} */}
      </Link>
      <div className="p-3 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-1 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mb-2 line-clamp-2 flex-grow">
          {product.description.substring(0, 60)}...
        </p>
        <div className="mt-auto">
          {/* Offer Price (large, bold) */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg md:text-xl font-bold text-blue-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>
          {/* Add button - always visible */}
          <button
            onClick={handleAddToCart}
            className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;