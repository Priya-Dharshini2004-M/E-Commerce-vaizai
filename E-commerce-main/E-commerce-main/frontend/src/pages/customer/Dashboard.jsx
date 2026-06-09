// frontend/src/pages/customer/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiShoppingBag, FiDollarSign, FiHeart, FiTruck, FiArrowRight, FiPackage, FiClock } from 'react-icons/fi';

const TOKEN = {
  white: '#fff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  indigo: '#4f46e5',
  indigoLight: '#eef2ff',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
};

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    pendingDeliveries: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, wishlistRes] = await Promise.all([
        axios.get('/api/orders/myorders', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const orders = ordersRes.data;
      const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingDeliveries = orders.filter(o => o.orderStatus !== 'delivered').length;
      setStats({
        totalOrders: orders.length,
        totalSpent,
        wishlistCount: wishlistRes.data.products?.length || 0,
        pendingDeliveries,
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: 'Total Orders', value: stats.totalOrders, icon: FiPackage, color: TOKEN.indigo, bg: TOKEN.indigoLight },
    { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString()}`, icon: FiDollarSign, color: TOKEN.emerald, bg: '#d1fae5' },
    { label: 'Wishlist', value: stats.wishlistCount, icon: FiHeart, color: TOKEN.rose, bg: '#ffe4e6' },
    { label: 'Pending Deliveries', value: stats.pendingDeliveries, icon: FiTruck, color: TOKEN.amber, bg: '#fef3c7' },
  ];

  if (loading) {
    return (
      <div style={{ background: TOKEN.slate50, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, border: `4px solid ${TOKEN.slate200}`, borderTopColor: TOKEN.indigo, borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900 }}>Welcome back, {user?.name?.split(' ')[0] || 'Customer'} 👋</h1>
          <p style={{ color: TOKEN.slate500, marginTop: 4 }}>Here's what's happening with your account today.</p>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 48 }}>
          {metrics.map((metric, idx) => (
            <div key={idx} style={{
              background: TOKEN.white,
              borderRadius: 20,
              border: `1px solid ${TOKEN.slate100}`,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px -12px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div>
                <div style={{ fontSize: 13, color: TOKEN.slate500, marginBottom: 4 }}>{metric.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900 }}>{metric.value}</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: metric.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <metric.icon size={22} color={metric.color} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders & Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
          {/* Recent Orders Table */}
          <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${TOKEN.slate100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 800, fontSize: 18 }}>Recent Orders</h2>
              <Link to="/orders" style={{ fontSize: 13, color: TOKEN.indigo, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <FiArrowRight size={12} />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: TOKEN.slate400 }}>
                <FiPackage size={32} style={{ marginBottom: 12 }} />
                <p>No orders yet. <Link to="/products" style={{ color: TOKEN.indigo }}>Start shopping</Link></p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${TOKEN.slate100}`, background: TOKEN.slate50 }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Order ID</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Date</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Total</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id} style={{ borderBottom: `1px solid ${TOKEN.slate100}` }}>
                        <td style={{ padding: '14px 16px', fontSize: 13 }}>#{order._id.slice(-8)}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600 }}>₹{order.totalAmount.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: order.orderStatus === 'delivered' ? '#d1fae5' : order.orderStatus === 'processing' ? '#fef3c7' : '#e0e7ff',
                            color: order.orderStatus === 'delivered' ? '#065f46' : order.orderStatus === 'processing' ? '#92400e' : '#4338ca',
                            padding: '4px 12px', borderRadius: 30, fontSize: 11, fontWeight: 700
                          }}>{order.orderStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions Sidebar */}
          <div>
            <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 24 }}>
              <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: TOKEN.slate50, textDecoration: 'none', color: TOKEN.slate800, transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoLight}
                  onMouseLeave={e => e.currentTarget.style.background = TOKEN.slate50}>
                  <FiShoppingBag size={18} color={TOKEN.indigo} /> Browse Products
                </Link>
                <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: TOKEN.slate50, textDecoration: 'none', color: TOKEN.slate800 }}
                  onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoLight}
                  onMouseLeave={e => e.currentTarget.style.background = TOKEN.slate50}>
                  <FiPackage size={18} color={TOKEN.indigo} /> Track Orders
                </Link>
                <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: TOKEN.slate50, textDecoration: 'none', color: TOKEN.slate800 }}
                  onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoLight}
                  onMouseLeave={e => e.currentTarget.style.background = TOKEN.slate50}>
                  <FiHeart size={18} color={TOKEN.indigo} /> View Wishlist
                </Link>
                <Link to="/chat" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: TOKEN.slate50, textDecoration: 'none', color: TOKEN.slate800 }}
                  onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoLight}
                  onMouseLeave={e => e.currentTarget.style.background = TOKEN.slate50}>
                  <FiClock size={18} color={TOKEN.indigo} /> Customer Support
                </Link>
              </div>
            </div>

            {/* Need help card */}
            <div style={{ marginTop: 24, background: `linear-gradient(135deg, ${TOKEN.indigo} 0%, #6366f1 100%)`, borderRadius: 20, padding: 24, color: TOKEN.white }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
              <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Need assistance?</h3>
              <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 16 }}>Our support team is here to help 24/7.</p>
              <Link to="/chat" style={{ display: 'inline-block', background: TOKEN.white, color: TOKEN.indigo, padding: '8px 20px', borderRadius: 40, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;