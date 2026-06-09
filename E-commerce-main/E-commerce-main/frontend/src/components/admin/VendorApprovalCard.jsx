// frontend/src/components/admin/VendorApprovalCard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiEye, FiFileText, FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const TOKEN = {
  white: '#fff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  indigo: '#4f46e5',
  indigoDark: '#3730a3',
  indigoLight: '#eef2ff',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
};

const VendorApprovalCard = ({ vendor, onActionComplete }) => {
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await axios.post(`/api/admin/vendors/${vendor.id}/approve`, { notes: reviewNotes });
      toast.success('Vendor approved');
      onActionComplete?.();
    } catch (error) {
      toast.error('Approval failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reviewNotes) {
      toast.error('Please provide rejection reason');
      return;
    }
    setProcessing(true);
    try {
      await axios.post(`/api/admin/vendors/${vendor.id}/reject`, { reason: reviewNotes });
      toast.success('Vendor rejected');
      onActionComplete?.();
    } catch (error) {
      toast.error('Rejection failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{
      background: TOKEN.white,
      borderRadius: 20,
      border: `1px solid ${TOKEN.slate100}`,
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 24px -12px rgba(0,0,0,0.1)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      
      {/* Header with status */}
      <div style={{ padding: '16px 20px', background: TOKEN.slate50, borderBottom: `1px solid ${TOKEN.slate100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: TOKEN.slate900 }}>{vendor.businessName}</h3>
          <div style={{ fontSize: 12, color: TOKEN.slate500, marginTop: 2 }}>Applied on {new Date(vendor.appliedAt).toLocaleDateString()}</div>
        </div>
        <span style={{ background: TOKEN.amber + '20', color: TOKEN.amber, padding: '4px 12px', borderRadius: 30, fontSize: 11, fontWeight: 700 }}>Pending Review</span>
      </div>

      {/* Body */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiMail size={14} color={TOKEN.slate400} />
            <span style={{ fontSize: 13 }}>{vendor.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiPhone size={14} color={TOKEN.slate400} />
            <span style={{ fontSize: 13 }}>{vendor.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiMapPin size={14} color={TOKEN.slate400} />
            <span style={{ fontSize: 13 }}>{vendor.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiClock size={14} color={TOKEN.slate400} />
            <span style={{ fontSize: 13 }}>GST: {vendor.gstNumber || 'Not provided'}</span>
          </div>
        </div>

        {/* Documents */}
        {vendor.documents && vendor.documents.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><FiFileText /> Documents</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {vendor.documents.map((doc, idx) => (
                <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: TOKEN.slate50, padding: '6px 12px', borderRadius: 30, fontSize: 12, textDecoration: 'none', color: TOKEN.indigo, border: `1px solid ${TOKEN.slate200}` }}>
                  <FiEye size={12} /> {doc.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Review Notes */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Review Notes (required for rejection)</label>
          <textarea
            rows="3"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Add internal notes or rejection reason..."
            style={{ width: '100%', padding: '12px', borderRadius: 16, border: `1px solid ${TOKEN.slate200}`, fontSize: 13, resize: 'vertical', outline: 'none' }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={handleReject}
            disabled={processing}
            style={{
              background: TOKEN.white,
              border: `1px solid ${TOKEN.rose}`,
              color: TOKEN.rose,
              padding: '10px 24px',
              borderRadius: 40,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = TOKEN.rose; }}
            onMouseLeave={e => { e.currentTarget.style.background = TOKEN.white; e.currentTarget.style.borderColor = TOKEN.rose; }}
          >
            <FiXCircle size={14} /> Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={processing}
            style={{
              background: TOKEN.indigo,
              border: 'none',
              color: TOKEN.white,
              padding: '10px 28px',
              borderRadius: 40,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoDark}
            onMouseLeave={e => e.currentTarget.style.background = TOKEN.indigo}
          >
            <FiCheckCircle size={14} /> Approve Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorApprovalCard;