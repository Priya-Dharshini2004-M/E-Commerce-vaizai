// frontend/src/pages/admin/Analytics.jsx
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
import { FiTrendingUp, FiPackage, FiDollarSign } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TOKEN = {
  white: '#fff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
  slate600: '#475569',
  slate800: '#1e293b',
  slate900: '#0f172a',
  indigo: '#4f46e5',
  indigoLight: '#eef2ff',
  emerald: '#10b981',
};

const Analytics = () => {
  const [stats, setStats] = useState({ dailySales: [], topProducts: [], totalRevenue: 0, totalOrders: 0 });
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
        backgroundColor: TOKEN.indigo + '80',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  if (loading) {
    return (
      <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ width: 200, height: 28, background: TOKEN.slate200, borderRadius: 12, marginBottom: 24, animation: 'pulse 1s infinite' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <div style={{ height: 300, background: TOKEN.slate100, borderRadius: 20, animation: 'pulse 1s infinite' }} />
            <div style={{ height: 300, background: TOKEN.slate100, borderRadius: 20, animation: 'pulse 1s infinite' }} />
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = stats.dailySales.reduce((sum, day) => sum + day.total, 0);
  const totalOrders = stats.dailySales.reduce((sum, day) => sum + day.count, 0);

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900, marginBottom: 8 }}>Platform Analytics</h1>
        <p style={{ color: TOKEN.slate400, marginBottom: 32 }}>Sales performance and product insights</p>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: TOKEN.indigoLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiDollarSign size={22} color={TOKEN.indigo} />
            </div>
            <div><div style={{ fontSize: 13, color: TOKEN.slate500 }}>Total Revenue</div><div style={{ fontSize: 24, fontWeight: 800, color: TOKEN.slate900 }}>₹{totalRevenue.toLocaleString()}</div></div>
          </div>
          <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiPackage size={22} color={TOKEN.emerald} />
            </div>
            <div><div style={{ fontSize: 13, color: TOKEN.slate500 }}>Total Orders</div><div style={{ fontSize: 24, fontWeight: 800, color: TOKEN.slate900 }}>{totalOrders}</div></div>
          </div>
          <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiTrendingUp size={22} color={TOKEN.amber} />
            </div>
            <div><div style={{ fontSize: 13, color: TOKEN.slate500 }}>Avg Order Value</div><div style={{ fontSize: 24, fontWeight: 800, color: TOKEN.slate900 }}>₹{(totalRevenue / totalOrders || 0).toFixed(0)}</div></div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Daily Sales (Last 7 days)</h2>
          {stats.dailySales.length > 0 ? <Bar data={chartData} options={chartOptions} /> : <p style={{ textAlign: 'center', color: TOKEN.slate400 }}>No sales data available</p>}
        </div>

        {/* Top Products */}
        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Top Selling Products</h2>
          {stats.topProducts.length === 0 ? (
            <p style={{ color: TOKEN.slate400, textAlign: 'center' }}>No products sold yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {stats.topProducts.map((product, idx) => {
                const maxSold = stats.topProducts[0]?.sold || 1;
                const percent = (product.sold / maxSold) * 100;
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>{product.name}</span>
                      <span>{product.sold} units sold</span>
                    </div>
                    <div style={{ background: TOKEN.slate100, borderRadius: 20, overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, background: TOKEN.indigo, height: 6, borderRadius: 20 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default Analytics;