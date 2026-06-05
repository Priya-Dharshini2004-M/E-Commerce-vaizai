import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('/api/products/vendor/myproducts'),
        axios.get('/api/orders/vendor/orders'),
      ]);
      const orders = ordersRes.data;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = orders.filter(o => o.orderStatus === 'processing').length;
      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-green-500' },
    { title: 'Revenue', value: `₹${stats.totalRevenue}`, icon: FiDollarSign, color: 'bg-purple-500' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: FiTrendingUp, color: 'bg-orange-500' },
  ];

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr><th className="px-4 py-2 text-left">Order ID</th><th className="px-4 py-2 text-left">Customer</th><th className="px-4 py-2 text-left">Amount</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Date</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-t">
                    <td className="px-4 py-2">{order._id.slice(-6)}</td>
                    <td className="px-4 py-2">{order.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-2">₹{order.totalAmount}</td>
                    <td className="px-4 py-2 capitalize">{order.orderStatus}</td>
                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 text-right">
          <Link to="/vendor/orders" className="text-blue-600 hover:underline">View All Orders →</Link>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;