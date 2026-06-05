import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [stats, setStats] = useState({ dailySales: [], topProducts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/admin/analytics');
        setStats(data);
      } catch (error) {
        console.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const chartData = {
    labels: stats.dailySales.map(item => item.date),
    datasets: [
      {
        label: 'Sales (₹)',
        data: stats.dailySales.map(item => item.total),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  if (loading) return <div className="text-center py-20">Loading analytics...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Platform Analytics</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily Sales (Last 7 days)</h2>
        {stats.dailySales.length > 0 ? <Bar data={chartData} /> : <p>No sales data available</p>}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <ul className="space-y-2">
          {stats.topProducts.map((product, idx) => (
            <li key={idx} className="flex justify-between border-b py-2">
              <span>{product.name}</span>
              <span>{product.sold} units sold</span>
            </li>
          ))}
          {stats.topProducts.length === 0 && <p className="text-gray-500">No products sold yet.</p>}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;