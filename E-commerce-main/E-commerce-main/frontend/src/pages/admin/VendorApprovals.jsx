// frontend/src/pages/admin/VendorApprovals.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';

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
  rose: '#f43f5e',
  amber: '#f59e0b',
};

const VendorApprovals = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get('/api/admin/vendors');
      setVendors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (id) => {
    try {
      await axios.put(`/api/admin/vendors/${id}/approve`);
      toast.success('Vendor approved');
      fetchVendors();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const rejectVendor = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await axios.post(`/api/admin/vendors/${id}/reject`, { reason });
      toast.success('Vendor rejected');
      fetchVendors();
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase()) ||
    (v.vendorInfo?.storeName || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ width: 200, height: 28, background: TOKEN.slate200, borderRadius: 12, marginBottom: 24, animation: 'pulse 1s infinite' }} />
          <div style={{ background: TOKEN.white, borderRadius: 20, padding: 20 }}>
            {[...Array(4)].map((_, i) => <div key={i} style={{ height: 56, background: TOKEN.slate100, borderRadius: 12, marginBottom: 8, animation: 'pulse 1s infinite' }} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900 }}>Vendor Approvals</h1>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: TOKEN.slate400 }} />
            <input type="text" placeholder="Search vendor..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '8px 12px 8px 36px', borderRadius: 40, border: `1px solid ${TOKEN.slate200}`, background: TOKEN.white, width: 260 }} />
          </div>
        </div>

        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead style={{ background: TOKEN.slate50, borderBottom: `1px solid ${TOKEN.slate100}` }}>
              <tr>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Vendor</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Email</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Store Name</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: TOKEN.slate500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map(vendor => {
                const isApproved = vendor.vendorInfo?.isApproved;
                return (
                  <tr key={vendor._id} style={{ borderBottom: `1px solid ${TOKEN.slate100}` }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{vendor.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>{vendor.email}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>{vendor.vendorInfo?.storeName || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {isApproved ? (
                        <span style={{ background: '#d1fae5', color: TOKEN.emerald, padding: '4px 12px', borderRadius: 30, fontSize: 11, fontWeight: 700 }}>Approved</span>
                      ) : (
                        <span style={{ background: '#fef3c7', color: TOKEN.amber, padding: '4px 12px', borderRadius: 30, fontSize: 11, fontWeight: 700 }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {!isApproved && (
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          <button onClick={() => approveVendor(vendor._id)} style={{ background: TOKEN.emerald, color: TOKEN.white, border: 'none', borderRadius: 30, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                            <FiCheckCircle size={12} /> Approve
                          </button>
                          <button onClick={() => rejectVendor(vendor._id)} style={{ background: TOKEN.rose, color: TOKEN.white, border: 'none', borderRadius: 30, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiXCircle size={12} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredVendors.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: TOKEN.slate400 }}>No vendors found</div>}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default VendorApprovals;