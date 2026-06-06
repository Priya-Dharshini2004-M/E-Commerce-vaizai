import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } });
      setWishlist(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {wishlist.products.length === 0 ? <p className="text-gray-500">Your wishlist is empty.</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <img src={product.images?.[0]?.url || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}><h3 className="font-semibold">{product.name}</h3></Link>
                <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => addToCart(product._id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add to Cart</button>
                  <button onClick={() => removeFromWishlist(product._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;