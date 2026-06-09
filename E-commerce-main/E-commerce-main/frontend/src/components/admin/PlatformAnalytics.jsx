// frontend/src/components/admin/PlatformAnalytics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart, FiUsers, FiBriefcase, FiActivity, FiCalendar } from 'react-icons/fi';

const TOKEN = {
  white: '#fff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate600: '#475569',
  slate800: '#1e293b',
  slate900: '#0f172a',
  indigo: '#4f46e5',
  indigoLight: '#eef2ff',
  emerald: '#10b981',
  rose: '#f43f5e',
  blue: '#3b82f6',
  purple: '#8b5cf6',
};

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalVendors: 0,
    salesTrend: '+12%',
    ordersTrend: '+8%',
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/admin/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: 'Total Sales', value: `₹${analytics.totalSales.toLocaleString()}`, trend: analytics.salesTrend, icon: FiDollarSign, color: TOKEN.emerald, bg: '#d1fae5' },
    { label: 'Total Orders', value: analytics.totalOrders.toLocaleString(), trend: analytics.ordersTrend, icon: FiShoppingCart, color: TOKEN.blue, bg: '#dbeafe' },
    { label: 'Active Users', value: analytics.totalUsers.toLocaleString(), trend: '+5%', icon: FiUsers, color: TOKEN.purple, bg: '#ede9fe' },
    { label: 'Verified Vendors', value: analytics.totalVendors.toLocaleString(), trend: '+2%', icon: FiBriefcase, color: TOKEN.indigo, bg: TOKEN.indigoLight },
  ];

  if (loading) {
    return (
      <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 24 }}>
        <div style={{ width: 200, height: 28, background: TOKEN.slate200, borderRadius: 12, marginBottom: 24, animation: 'pulse 1s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ height: 100, background: TOKEN.slate100, borderRadius: 16, animation: 'pulse 1s infinite' }} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {metrics.map((metric, idx) => (
          <div key={idx} style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: '20px 24px', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: metric.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <metric.icon size={22} color={metric.color} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: metric.trend.startsWith('+') ? TOKEN.emerald : TOKEN.rose }}>
                {metric.trend}
                {metric.trend.startsWith('+') ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
              </div>
            </div>
            <div style={{ fontSize: 13, color: TOKEN.slate500, marginBottom: 4 }}>{metric.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900 }}>{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row (Placeholders) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 800, fontSize: 16 }}>Revenue Trend</h3>
            <FiActivity size={18} color={TOKEN.slate400} />
          </div>
          <div style={{ height: 200, background: `linear-gradient(180deg, ${TOKEN.indigoLight} 0%, ${TOKEN.white} 100%)`, borderRadius: 12, display: 'flex', alignItems: 'flex-end', padding: '12px 16px' }}>
            {/* Simple bar chart mock */}
            <div style={{ display: 'flex', gap: 8, width: '100%', alignItems: 'flex-end', height: '100%' }}>
              {[60, 75, 55, 85, 70, 90, 80].map((height, i) => (
                <div key={i} style={{ flex: 1, background: TOKEN.indigo, height: `${height}%`, borderRadius: 8, transition: 'height 0.3s' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11, color: TOKEN.slate400 }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 800, fontSize: 16 }}>Orders by Category</h3>
            <FiCalendar size={18} color={TOKEN.slate400} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Electronics', 'Fashion', 'Home', 'Beauty'].map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>{cat}</span>
                  <span>{[32, 28, 22, 18][i]}%</span>
                </div>
                <div style={{ background: TOKEN.slate100, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ width: `${[32, 28, 22, 18][i]}%`, background: TOKEN.indigo, height: 6, borderRadius: 20 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Recent Platform Activity</h3>
        {analytics.recentActivities.length === 0 ? (
          <p style={{ color: TOKEN.slate400, textAlign: 'center', padding: 20 }}>No recent activity</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {analytics.recentActivities.map((activity, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: idx !== analytics.recentActivities.length - 1 ? `1px solid ${TOKEN.slate100}` : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: TOKEN.slate100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiActivity size={14} color={TOKEN.slate600} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{activity.message}</div>
                  <div style={{ fontSize: 11, color: TOKEN.slate400 }}>{new Date(activity.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default PlatformAnalytics;