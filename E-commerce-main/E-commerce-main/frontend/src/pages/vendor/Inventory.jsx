import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Inventory = () => {
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
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await axios.put(`/api/products/${productId}`, { stock: newStock });
      toast.success('Stock updated');
      fetchProducts();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="text-center py-20">Loading inventory...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Current Stock</th>
              <th className="px-4 py-2 text-left">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2 capitalize">{p.category}</td>
                <td className="px-4 py-2">₹{p.price}</td>
                <td className="px-4 py-2">
                  {p.stock <= 10 ? (
                    <span className="text-red-600 font-semibold">{p.stock} (Low stock)</span>
                  ) : (
                    <span>{p.stock}</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    onBlur={(e) => updateStock(p._id, parseInt(e.target.value))}
                    className="border rounded px-2 py-1 w-24"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-4">No products found.</p>}
      </div>
    </div>
  );
};

export default Inventory;