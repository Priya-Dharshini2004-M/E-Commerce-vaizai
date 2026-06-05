import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products/vendor/myproducts');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  if (loading) return <div className="text-center py-20">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link to="/vendor/products/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <FiPlus /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products yet. Click "Add Product" to start.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={product.images?.[0]?.url || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">₹{product.price} | Stock: {product.stock}</p>
                <div className="flex justify-between mt-4">
                  <Link to={`/vendor/products/edit/${product._id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <FiEdit /> Edit
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;