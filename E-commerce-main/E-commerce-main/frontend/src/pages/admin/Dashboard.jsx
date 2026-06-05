import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalVendors: 0, totalCustomers: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Vendors', value: stats.totalVendors, icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: FiUsers, color: 'bg-green-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-purple-500' },
    { title: 'Revenue', value: `₹${stats.totalRevenue}`, icon: FiDollarSign, color: 'bg-orange-500' },
  ];

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div><p className="text-gray-500">{card.title}</p><p className="text-2xl font-bold">{card.value}</p></div>
            <div className={`${card.color} p-3 rounded-full text-white`}><card.icon className="w-6 h-6" /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;