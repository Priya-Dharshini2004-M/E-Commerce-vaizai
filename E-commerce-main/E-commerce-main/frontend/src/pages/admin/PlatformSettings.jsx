// frontend/src/components/admin/PlatformSettings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSave, FiGlobe, FiLock, FiBell, FiCreditCard, FiRefreshCw } from 'react-icons/fi';

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

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Multi-Vendor Platform',
    supportEmail: 'support@example.com',
    enable2FA: false,
    enableEmailNotifications: true,
    enableSmsAlerts: false,
    paymentGateway: 'razorpay',
    currency: 'INR',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/admin/settings');
      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await axios.put('/api/admin/settings', settings);
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 24 }}>
        <div style={{ width: 200, height: 28, background: TOKEN.slate200, borderRadius: 12, marginBottom: 24, animation: 'pulse 1s infinite' }} />
        <div style={{ height: 200, background: TOKEN.slate100, borderRadius: 16, animation: 'pulse 1s infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Platform Settings</h2>
        <button onClick={saveSettings} disabled={saving} style={{ background: TOKEN.indigo, color: TOKEN.white, border: 'none', borderRadius: 40, padding: '8px 20px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoDark}
          onMouseLeave={e => e.currentTarget.style.background = TOKEN.indigo}>
          <FiSave size={14} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* General */}
        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <FiGlobe color={TOKEN.indigo} /> <h3 style={{ fontWeight: 800 }}>General</h3>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Site Name</label>
            <input type="text" value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: `1px solid ${TOKEN.slate200}` }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Support Email</label>
            <input type="email" value={settings.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: `1px solid ${TOKEN.slate200}` }} />
          </div>
        </div>

        {/* Security */}
        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <FiLock color={TOKEN.indigo} /> <h3 style={{ fontWeight: 800 }}>Security</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13 }}>Enable Two-Factor Authentication (Admin)</span>
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
              <input type="checkbox" checked={settings.enable2FA} onChange={(e) => handleChange('enable2FA', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: settings.enable2FA ? TOKEN.indigo : TOKEN.slate300, borderRadius: 34, transition: '0.2s' }}></span>
              <span style={{ position: 'absolute', content: '""', height: 18, width: 18, left: 3, bottom: 3, background: TOKEN.white, borderRadius: '50%', transition: '0.2s', transform: settings.enable2FA ? 'translateX(20px)' : 'none' }}></span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <FiBell color={TOKEN.indigo} /> <h3 style={{ fontWeight: 800 }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13 }}>Email Notifications</span>
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
              <input type="checkbox" checked={settings.enableEmailNotifications} onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: settings.enableEmailNotifications ? TOKEN.indigo : TOKEN.slate300, borderRadius: 34, transition: '0.2s' }}></span>
              <span style={{ position: 'absolute', height: 18, width: 18, left: 3, bottom: 3, background: TOKEN.white, borderRadius: '50%', transition: '0.2s', transform: settings.enableEmailNotifications ? 'translateX(20px)' : 'none' }}></span>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13 }}>SMS Alerts</span>
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
              <input type="checkbox" checked={settings.enableSmsAlerts} onChange={(e) => handleChange('enableSmsAlerts', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: settings.enableSmsAlerts ? TOKEN.indigo : TOKEN.slate300, borderRadius: 34, transition: '0.2s' }}></span>
              <span style={{ position: 'absolute', height: 18, width: 18, left: 3, bottom: 3, background: TOKEN.white, borderRadius: '50%', transition: '0.2s', transform: settings.enableSmsAlerts ? 'translateX(20px)' : 'none' }}></span>
            </label>
          </div>
        </div>

        {/* Payment */}
        <div style={{ background: TOKEN.white, borderRadius: 20, border: `1px solid ${TOKEN.slate100}`, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <FiCreditCard color={TOKEN.indigo} /> <h3 style={{ fontWeight: 800 }}>Payment</h3>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Gateway</label>
            <select value={settings.paymentGateway} onChange={(e) => handleChange('paymentGateway', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: `1px solid ${TOKEN.slate200}` }}>
              <option value="razorpay">Razorpay</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Currency</label>
            <select value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: `1px solid ${TOKEN.slate200}` }}>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default PlatformSettings;