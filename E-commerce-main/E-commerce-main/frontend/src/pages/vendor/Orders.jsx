import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiRefreshCw } from 'react-icons/fi';


const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/orders/vendor/orders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      toast.error('Could not fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // refresh
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
          {error}
          <button onClick={fetchOrders} className="ml-4 text-blue-600 underline">Retry</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-gray-500 text-lg">No orders yet.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor Orders</h1>
        <button onClick={fetchOrders} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order header - responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 border-b">
              <div>
                <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{order._id.slice(-8)}</span></p>
                <p className="text-sm text-gray-500">Customer: {order.userId?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  disabled={updating === order._id}
                  className="border rounded px-3 py-1 text-sm capitalize focus:ring-blue-500"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {updating === order._id && <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>}
              </div>
            </div>

            {/* Order items - responsive grid */}
            <div className="p-4">
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 last:border-0">
                    <div className="flex gap-3">
                      <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold mt-1 sm:mt-0">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-2 border-t text-right font-bold">
                Total: ₹{order.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorOrders;