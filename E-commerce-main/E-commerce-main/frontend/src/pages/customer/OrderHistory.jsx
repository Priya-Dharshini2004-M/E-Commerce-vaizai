// frontend/src/pages/customer/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

const TOKEN = {
  slate50: '#f8fafc', slate900: '#0f172a', slate400: '#94a3b8', white: '#fff', slate100: '#f1f5f9',
  slate600: '#475569', slate800: '#1e293b', indigo: '#4f46e5', emerald: '#10b981', amber: '#f59e0b'
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);
  const fetchOrders = async () => {
    try { const { data } = await axios.get('/api/orders/myorders'); setOrders(data); } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ background: TOKEN.slate50, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading orders...</div>;

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900, marginBottom: 32 }}>Order History</h1>
        {orders.length === 0 ? (
          <div style={{ background: TOKEN.white, borderRadius: 20, padding: 60, textAlign: 'center' }}>
            <p>No orders yet. <Link to="/products" style={{ color: TOKEN.indigo, fontWeight: 600 }}>Start shopping</Link></p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${TOKEN.slate100}` }}>
                  <div>
                    <div style={{ fontSize: 12, color: TOKEN.slate400 }}>Order #{order._id.slice(-8)}</div>
                    <div style={{ fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{
                    background: order.orderStatus === 'delivered' ? '#d1fae5' : order.orderStatus === 'processing' ? '#fef3c7' : '#e0e7ff',
                    color: order.orderStatus === 'delivered' ? '#065f46' : order.orderStatus === 'processing' ? '#92400e' : '#4338ca',
                    padding: '4px 12px', borderRadius: 30, fontSize: 12, fontWeight: 700
                  }}>{order.orderStatus}</span>
                </div>
                <div>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                      <span>{item.name} x{item.quantity}</span>
                      <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${TOKEN.slate100}`, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ color: TOKEN.indigo, fontSize: 18 }}>₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: TOKEN.slate600 }}>
                  {order.orderStatus === 'delivered' ? <FiCheckCircle color={TOKEN.emerald} /> : <FiTruck />}
                  <span>{order.orderStatus === 'delivered' ? 'Delivered' : 'Processing & Shipping soon'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;