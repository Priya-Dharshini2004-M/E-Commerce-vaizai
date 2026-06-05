import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.images?.[0]?.url || 'https://via.placeholder.com/500'} alt={product.name} className="w-full rounded-lg shadow" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-2xl font-bold text-blue-600 mb-4">₹{product.price}</div>
          {product.compareAtPrice > product.price && (
            <div className="text-gray-400 line-through mb-4">₹{product.compareAtPrice}</div>
          )}
          <div className="mb-4">Stock: {product.stock} units</div>
          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold">Quantity:</label>
            <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="border rounded px-3 py-1 w-20" />
          </div>
          <button onClick={handleAddToCart} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full md:w-auto">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;