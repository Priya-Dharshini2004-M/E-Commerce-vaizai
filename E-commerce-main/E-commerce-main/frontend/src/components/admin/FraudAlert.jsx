// frontend/src/components/admin/FraudAlert.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiAlertTriangle, FiCheckCircle, FiFlag, FiEye, FiShield, FiUserX, FiRefreshCw } from 'react-icons/fi';

const TOKEN = {
  white: '#fff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  indigo: '#4f46e5',
  indigoDark: '#3730a3',
  indigoLight: '#eef2ff',
  rose: '#f43f5e',
  amber: '#f59e0b',
  emerald: '#10b981',
  blue: '#3b82f6',
};

const FraudAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await axios.get('/api/admin/fraud-alerts');
      setAlerts(data);
    } catch (error) {
      toast.error('Failed to load fraud alerts');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await axios.post(`/api/admin/fraud-alerts/${alertId}/resolve`);
      toast.success('Alert resolved');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to resolve');
    }
  };

  const blockVendor = async (vendorId) => {
    if (window.confirm('Block this vendor permanently?')) {
      try {
        await axios.post(`/api/admin/vendors/${vendorId}/block`);
        toast.success('Vendor blocked');
        fetchAlerts();
      } catch (error) {
        toast.error('Failed to block vendor');
      }
    }
  };

  const getSeverityConfig = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return { bg: '#fee2e2', color: TOKEN.rose, icon: FiFlag, label: 'High Risk' };
      case 'medium': return { bg: '#fef3c7', color: TOKEN.amber, icon: FiAlertTriangle, label: 'Medium Risk' };
      default: return { bg: '#e0e7ff', color: TOKEN.blue, icon: FiEye, label: 'Low Risk' };
    }
  };

  if (loading) {
    return (
      <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 150, height: 24, background: TOKEN.slate200, borderRadius: 12, animation: 'pulse 1s infinite' }} />
          <div style={{ width: 100, height: 36, background: TOKEN.slate200, borderRadius: 20, animation: 'pulse 1s infinite' }} />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 16, background: TOKEN.slate50, borderRadius: 16, height: 80, animation: 'pulse 1s infinite' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${TOKEN.slate100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FiShield size={20} color={TOKEN.indigo} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: TOKEN.slate900 }}>Fraud Detection Alerts</h2>
          {alerts.length > 0 && <span style={{ background: TOKEN.rose, color: TOKEN.white, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{alerts.length} pending</span>}
        </div>
        <button onClick={fetchAlerts} style={{ background: TOKEN.slate50, border: `1px solid ${TOKEN.slate200}`, borderRadius: 30, padding: '6px 14px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <FiRefreshCw size={12} /> Refresh
        </button>
      </div>

      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: TOKEN.slate400 }}>
          <FiShield size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p style={{ fontWeight: 500 }}>No fraud alerts detected</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>System is clean – all transactions verified.</p>
        </div>
      ) : (
        <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {alerts.map((alert) => {
            const SeverityIcon = getSeverityConfig(alert.severity).icon;
            const severityConfig = getSeverityConfig(alert.severity);
            return (
              <div key={alert.id} style={{ background: TOKEN.slate50, borderRadius: 16, padding: 16, borderLeft: `4px solid ${severityConfig.color}`, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: severityConfig.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SeverityIcon size={16} color={severityConfig.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: TOKEN.slate800 }}>{alert.title}</div>
                      <div style={{ fontSize: 12, color: TOKEN.slate500, marginTop: 2 }}>{alert.description}</div>
                      <div style={{ fontSize: 11, color: TOKEN.slate400, marginTop: 4 }}>Vendor ID: {alert.vendorId} • {new Date(alert.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ background: severityConfig.bg, color: severityConfig.color, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{severityConfig.label}</span>
                    <button onClick={() => resolveAlert(alert.id)} style={{ background: TOKEN.white, border: `1px solid ${TOKEN.slate200}`, borderRadius: 30, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoLight}
                      onMouseLeave={e => e.currentTarget.style.background = TOKEN.white}>
                      <FiCheckCircle size={12} /> Resolve
                    </button>
                    <button onClick={() => blockVendor(alert.vendorId)} style={{ background: TOKEN.white, border: `1px solid ${TOKEN.slate200}`, borderRadius: 30, padding: '6px 12px', fontSize: 11, fontWeight: 600, color: TOKEN.rose, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={e => e.currentTarget.style.background = TOKEN.white}>
                      <FiUserX size={12} /> Block Vendor
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default FraudAlert;