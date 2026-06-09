// frontend/src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiBriefcase,
  FiTrendingUp,
  FiPackage,
  FiClock,
  FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// ---- Design Tokens (Vibrant Palette) ----
const TOKEN = {
  white: '#fff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
  slate600: '#475569',
  slate800: '#1e293b',
  slate900: '#0f172a',
  firebrick: '#b22222',
  deeppink: '#ff1493',
  indigo: '#4b0082',
  mediumvioletred: '#c71585',
  lime: '#00ff00',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingVendors: 0,
  });
  const [dailySales, setDailySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryData, setCategoryData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch main stats
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data);

      // Fetch analytics (daily sales, top products, category distribution)
      try {
        const analyticsRes = await axios.get('/api/admin/analytics');
        if (analyticsRes.data) {
          setDailySales(analyticsRes.data.dailySales || []);
          setTopProducts(analyticsRes.data.topProducts || []);
          setCategoryData({
            labels: analyticsRes.data.categoryLabels || ['Electronics', 'Fashion', 'Home', 'Beauty'],
            values: analyticsRes.data.categoryValues || [35, 28, 22, 15],
          });
        }
      } catch (e) {
        console.warn('Analytics endpoint not available, using fallback data');
        // Fallback mock data
        setDailySales([
          { date: 'Mon', total: 12500 },
          { date: 'Tue', total: 18200 },
          { date: 'Wed', total: 14800 },
          { date: 'Thu', total: 22400 },
          { date: 'Fri', total: 19800 },
          { date: 'Sat', total: 27500 },
          { date: 'Sun', total: 31200 },
        ]);
        setTopProducts([
          { name: 'Wireless Headphones', sold: 245 },
          { name: 'Smart Watch', sold: 189 },
          { name: 'Designer T-Shirt', sold: 156 },
          { name: 'Home Decor Set', sold: 98 },
        ]);
      }

      // Fetch recent orders
      try {
        const ordersRes = await axios.get('/api/orders');
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (e) {
        console.warn('Orders endpoint not available');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart: Daily Sales (Line chart)
  const lineChartData = {
    labels: dailySales.map((d) => d.date),
    datasets: [
      {
        label: 'Sales (₹)',
        data: dailySales.map((d) => d.total),
        borderColor: TOKEN.deeppink,
        backgroundColor: 'rgba(255, 20, 147, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: TOKEN.firebrick,
        pointBorderColor: TOKEN.white,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart: Category Distribution (Doughnut)
  const doughnutData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.values,
        backgroundColor: [TOKEN.firebrick, TOKEN.deeppink, TOKEN.indigo, TOKEN.mediumvioletred],
        borderWidth: 0,
        cutout: '65%',
      },
    ],
  };

  // Top products with progress bars
  const maxSold = topProducts[0]?.sold || 1;

  // Metric cards with new colors
  const statCards = [
    { title: 'Total Vendors', value: stats.totalVendors, icon: FiBriefcase, color: TOKEN.indigo, bg: '#e9d5ff', link: '/admin/vendors' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: FiUsers, color: TOKEN.lime, bg: '#d9f99d', link: '/admin/customers' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: TOKEN.firebrick, bg: '#fee2e2', link: '/admin/orders' },
    { title: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: TOKEN.deeppink, bg: '#fce7f3', link: '/admin/analytics' },
  ];

  if (loading) {
    return (
      <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ width: 250, height: 28, background: TOKEN.slate200, borderRadius: 12, marginBottom: 24, animation: 'pulse 1s infinite' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 100, background: TOKEN.slate100, borderRadius: 20, animation: 'pulse 1s infinite' }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ height: 300, background: TOKEN.slate100, borderRadius: 20, animation: 'pulse 1s infinite' }} />
            <div style={{ height: 300, background: TOKEN.slate100, borderRadius: 20, animation: 'pulse 1s infinite' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900 }}>Analytics Dashboard</h1>
          <p style={{ color: TOKEN.slate400, marginTop: 4 }}>Real‑time platform performance & insights</p>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}
        >
          {statCards.map((card, idx) => (
            <Link key={idx} to={card.link} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: TOKEN.white,
                  borderRadius: 24,
                  border: `1px solid ${TOKEN.slate100}`,
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 30px -12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div>
                  <div style={{ fontSize: 13, color: TOKEN.slate500, marginBottom: 6 }}>{card.title}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: card.color }}>{card.value}</div>
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    background: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <card.icon size={24} color={card.color} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Charts Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 24,
            marginBottom: 40,
          }}
        >
          {/* Sales Trend Card */}
          <div
            style={{
              background: TOKEN.white,
              borderRadius: 24,
              border: `1px solid ${TOKEN.slate100}`,
              padding: '20px 20px 10px 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiTrendingUp color={TOKEN.deeppink} /> Sales Trend (Last 7 days)
              </h3>
              <span style={{ fontSize: 12, background: TOKEN.slate100, padding: '4px 10px', borderRadius: 20 }}>
                ₹{dailySales.reduce((sum, d) => sum + d.total, 0).toLocaleString()} total
              </span>
            </div>
            {dailySales.length > 0 ? (
              <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: TOKEN.slate400 }}>No sales data</div>
            )}
          </div>

          {/* Category Distribution Card */}
          <div
            style={{
              background: TOKEN.white,
              borderRadius: 24,
              border: `1px solid ${TOKEN.slate100}`,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPackage color={TOKEN.firebrick} /> Sales by Category
            </h3>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 180, margin: '0 auto' }}>
                <Doughnut data={doughnutData} options={{ cutout: '65%', plugins: { legend: { position: 'bottom' } } }} />
              </div>
              <div style={{ flex: 1, minWidth: 150 }}>
                {categoryData.labels.map((label, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span>{label}</span>
                      <span>{categoryData.values[i]}%</span>
                    </div>
                    <div style={{ background: TOKEN.slate100, borderRadius: 20, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${categoryData.values[i]}%`,
                          background: [TOKEN.firebrick, TOKEN.deeppink, TOKEN.indigo, TOKEN.mediumvioletred][i % 4],
                          height: 6,
                          borderRadius: 20,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Orders + Top Products */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Recent Orders Table */}
          <div
            style={{
              background: TOKEN.white,
              borderRadius: 24,
              border: `1px solid ${TOKEN.slate100}`,
              overflow: 'auto',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${TOKEN.slate100}` }}>
              <h3 style={{ fontWeight: 800, fontSize: 18 }}>Recent Orders</h3>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: TOKEN.slate400 }}>No orders found</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead style={{ background: TOKEN.slate50 }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate600 }}>Order ID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate600 }}>Customer</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate600 }}>Amount</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: `1px solid ${TOKEN.slate100}` }}>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>#{order._id.slice(-8)}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{order.userId?.name || 'Guest'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: TOKEN.indigo }}>
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            background:
                              order.orderStatus === 'delivered'
                                ? '#d1fae5'
                                : order.orderStatus === 'processing'
                                ? '#fef3c7'
                                : '#e0e7ff',
                            color:
                              order.orderStatus === 'delivered'
                                ? '#065f46'
                                : order.orderStatus === 'processing'
                                ? '#92400e'
                                : '#4338ca',
                            padding: '4px 10px',
                            borderRadius: 30,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Top Products Card */}
          <div
            style={{
              background: TOKEN.white,
              borderRadius: 24,
              border: `1px solid ${TOKEN.slate100}`,
              padding: 20,
            }}
          >
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>🏆 Top Selling Products</h3>
            {topProducts.length === 0 ? (
              <p style={{ color: TOKEN.slate400, textAlign: 'center' }}>No data available</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {topProducts.map((product, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>{product.name}</span>
                      <span>{product.sold} units</span>
                    </div>
                    <div style={{ background: TOKEN.slate100, borderRadius: 20, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(product.sold / maxSold) * 100}%`,
                          background: `linear-gradient(90deg, ${TOKEN.firebrick}, ${TOKEN.deeppink})`,
                          height: 8,
                          borderRadius: 20,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pending approvals quick link */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${TOKEN.slate100}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: TOKEN.slate600 }}>
                  {stats.pendingVendors} vendor approvals pending
                </span>
                <Link
                  to="/admin/vendor-approvals"
                  style={{
                    background: TOKEN.lime,
                    color: TOKEN.slate900,
                    padding: '6px 14px',
                    borderRadius: 40,
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Review <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe animation for loading pulse */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.8; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;