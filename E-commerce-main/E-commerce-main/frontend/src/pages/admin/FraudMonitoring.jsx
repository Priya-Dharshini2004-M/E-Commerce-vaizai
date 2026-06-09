// frontend/src/components/admin/FraudMonitoring.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiEye, FiFlag, FiRefreshCw } from 'react-icons/fi';

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
  rose: '#f43f5e',
  amber: '#f59e0b',
  emerald: '#10b981',
};

const FraudMonitoring = () => {
  const [fraudCases, setFraudCases] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFraudData();
  }, []);

  const fetchFraudData = async () => {
    try {
      const { data } = await axios.get('/api/admin/fraud-monitoring');
      setFraudCases(data.cases);
      setStats(data.stats);
    } catch (error) {
      toast.error('Failed to load fraud data');
    } finally {
      setLoading(false);
    }
  };

  const resolveCase = async (caseId) => {
    try {
      await axios.post(`/api/admin/fraud-monitoring/${caseId}/resolve`);
      toast.success('Case resolved');
      fetchFraudData();
    } catch (error) {
      toast.error('Failed to resolve');
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'high': return { bg: '#fee2e2', color: TOKEN.rose, label: 'High' };
      case 'medium': return { bg: '#fef3c7', color: TOKEN.amber, label: 'Medium' };
      default: return { bg: '#e0e7ff', color: TOKEN.indigo, label: 'Low' };
    }
  };

  if (loading) {
    return (
      <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 24 }}>
        <div style={{ width: 200, height: 28, background: TOKEN.slate200, borderRadius: 12, marginBottom: 20, animation: 'pulse 1s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[...Array(3)].map((_, i) => <div key={i} style={{ height: 80, background: TOKEN.slate100, borderRadius: 16, animation: 'pulse 1s infinite' }} />)}
        </div>
        {[...Array(3)].map((_, i) => <div key={i} style={{ height: 70, background: TOKEN.slate100, borderRadius: 16, marginBottom: 12, animation: 'pulse 1s infinite' }} />)}
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: TOKEN.white, borderRadius: 16, border: `1px solid ${TOKEN.slate100}`, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: TOKEN.indigoLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiShield color={TOKEN.indigo} /></div>
          <div><div style={{ fontSize: 11, color: TOKEN.slate500 }}>Total Cases</div><div style={{ fontSize: 22, fontWeight: 800 }}>{stats.total}</div></div>
        </div>
        <div style={{ background: TOKEN.white, borderRadius: 16, border: `1px solid ${TOKEN.slate100}`, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiCheckCircle color={TOKEN.emerald} /></div>
          <div><div style={{ fontSize: 11, color: TOKEN.slate500 }}>Resolved</div><div style={{ fontSize: 22, fontWeight: 800 }}>{stats.resolved}</div></div>
        </div>
        <div style={{ background: TOKEN.white, borderRadius: 16, border: `1px solid ${TOKEN.slate100}`, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiAlertTriangle color={TOKEN.rose} /></div>
          <div><div style={{ fontSize: 11, color: TOKEN.slate500 }}>Pending</div><div style={{ fontSize: 22, fontWeight: 800 }}>{stats.pending}</div></div>
        </div>
      </div>

      {/* Fraud Cases List */}
      <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${TOKEN.slate100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 800, fontSize: 16 }}>Suspicious Activities</h3>
          <button onClick={fetchFraudData} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiRefreshCw /></button>
        </div>
        {fraudCases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: TOKEN.slate400 }}>
            <FiShield size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p>No fraud cases detected</p>
          </div>
        ) : (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {fraudCases.map(caseItem => {
              const severity = getSeverityStyle(caseItem.severity);
              return (
                <div key={caseItem.id} style={{ background: TOKEN.slate50, borderRadius: 14, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: severity.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiFlag size={14} color={severity.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{caseItem.title}</div>
                      <div style={{ fontSize: 11, color: TOKEN.slate400 }}>Vendor: {caseItem.vendorName} • {new Date(caseItem.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ background: severity.bg, color: severity.color, padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{severity.label}</span>
                    {!caseItem.resolved && (
                      <button onClick={() => resolveCase(caseItem.id)} style={{ background: TOKEN.white, border: `1px solid ${TOKEN.slate200}`, borderRadius: 30, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Resolve</button>
                    )}
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TOKEN.slate500 }}><FiEye size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudMonitoring;