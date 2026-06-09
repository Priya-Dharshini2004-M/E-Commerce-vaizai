// frontend/src/pages/admin/AllOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiEye, FiChevronDown } from 'react-icons/fi';

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
  amber: '#f59e0b',
  rose: '#f43f5e',
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.includes(search) || (order.userId?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: '#fef3c7', color: TOKEN.amber, label: 'Pending' },
      processing: { bg: '#e0e7ff', color: TOKEN.indigo, label: 'Processing' },
      shipped: { bg: '#dbeafe', color: '#2563eb', label: 'Shipped' },
      delivered: { bg: '#d1fae5', color: TOKEN.emerald, label: 'Delivered' },
      cancelled: { bg: '#fee2e2', color: TOKEN.rose, label: 'Cancelled' },
    };
    const c = config[status] || config.pending;
    return <span style={{ background: c.bg, color: c.color, padding: '4px 10px', borderRadius: 30, fontSize: 11, fontWeight: 700 }}>{c.label}</span>;
  };

  if (loading) {
    return (
      <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ width: 200, height: 28, background: TOKEN.slate200, borderRadius: 12, marginBottom: 24, animation: 'pulse 1s infinite' }} />
          <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
            {[...Array(5)].map((_, i) => <div key={i} style={{ height: 48, background: TOKEN.slate100, borderRadius: 12, marginBottom: 8, animation: 'pulse 1s infinite' }} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900 }}>All Platform Orders</h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: TOKEN.slate400 }} />
              <input type="text" placeholder="Search by ID or customer" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '8px 12px 8px 36px', borderRadius: 40, border: `1px solid ${TOKEN.slate200}`, background: TOKEN.white, fontSize: 13, width: 240 }} />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 40, border: `1px solid ${TOKEN.slate200}`, background: TOKEN.white, fontSize: 13 }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead style={{ background: TOKEN.slate50, borderBottom: `1px solid ${TOKEN.slate100}` }}>
              <tr>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Order ID</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Customer</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Amount</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id} style={{ borderBottom: `1px solid ${TOKEN.slate100}`, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = TOKEN.slate50}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600 }}>#{order._id.slice(-8)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{order.userId?.name || 'Guest'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: TOKEN.indigo }}>₹{order.totalAmount.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px' }}>{getStatusBadge(order.orderStatus)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: TOKEN.slate600 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TOKEN.indigo }}>
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: TOKEN.slate400 }}>No orders found</div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default AllOrders;