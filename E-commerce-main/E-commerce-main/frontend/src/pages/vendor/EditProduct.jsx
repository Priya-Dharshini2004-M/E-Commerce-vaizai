import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    category: '',
    gstRate: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice || '',
        stock: data.stock,
        category: data.category,
        gstRate: data.gstRate || 18,
        imageUrl: data.images?.[0]?.url || '',
      });
    } catch (error) {
      toast.error('Product not found');
      navigate('/vendor/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updateData = {
        ...formData,
        images: formData.imageUrl ? [{ url: formData.imageUrl, alt: formData.name }] : [],
      };
      delete updateData.imageUrl;
      await axios.put(`/api/products/${id}`, updateData);
      toast.success('Product updated');
      navigate('/vendor/products');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div><input type="text" name="name" placeholder="Product Name" required value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
        <div><textarea name="description" rows="4" placeholder="Description" required value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2"></textarea></div>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="price" placeholder="Price" required value={formData.price} onChange={handleChange} className="border rounded px-3 py-2" />
          <input type="number" name="compareAtPrice" placeholder="Compare Price" value={formData.compareAtPrice} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="stock" placeholder="Stock" required value={formData.stock} onChange={handleChange} className="border rounded px-3 py-2" />
          <input type="text" name="category" placeholder="Category" required value={formData.category} onChange={handleChange} className="border rounded px-3 py-2" />
        </div>
        <div>
          <input type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <input type="number" name="gstRate" placeholder="GST Rate" value={formData.gstRate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;