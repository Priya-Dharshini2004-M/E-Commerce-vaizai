import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    category: 'electronics',
    gstRate: 18,
    imageUrl: '', // NEW: image URL field
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare product data: images array from imageUrl
      const productData = {
        ...formData,
        images: formData.imageUrl ? [{ url: formData.imageUrl, alt: formData.name }] : [],
      };
      delete productData.imageUrl; // remove temporary field
      await axios.post('/api/products', productData);
      toast.success('Product added successfully');
      navigate('/vendor/products');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['electronics', 'clothing', 'home', 'beauty', 'toys', 'books', 'other'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Product Name *</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Description *</label>
          <textarea name="description" rows="4" required value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Price (₹) *</label>
            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Compare at Price</label>
            <input type="number" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Stock *</label>
            <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded px-3 py-2">
              {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Image URL (optional)</label>
          <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className="w-full border rounded px-3 py-2" />
          <p className="text-xs text-gray-500 mt-1">Enter a direct image URL. Leave empty to use a placeholder.</p>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">GST Rate (%)</label>
          <input type="number" name="gstRate" value={formData.gstRate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;