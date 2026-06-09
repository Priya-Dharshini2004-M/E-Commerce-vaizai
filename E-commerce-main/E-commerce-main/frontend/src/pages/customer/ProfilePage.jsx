// frontend/src/pages/customer/ProfilePage.jsx
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';

const TOKEN = {
  slate50: '#f8fafc', slate900: '#0f172a', white: '#fff', slate100: '#f1f5f9',
  slate200: '#e2e8f0', slate600: '#475569', slate700: '#334155', indigo: '#4f46e5', indigoDark: '#3730a3'
};

const ProfilePage = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) setProfileData({ name: user.name, email: user.email }); }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await axios.put('/api/auth/update', profileData, { headers: { Authorization: `Bearer ${token}` } });
      setUser(data); toast.success('Profile updated');
    } catch (error) { toast.error(error.response?.data?.message || 'Update failed'); } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error('Passwords do not match');
    if (passwordData.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) { toast.error(error.response?.data?.message || 'Change failed'); } finally { setLoading(false); }
  };

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900, marginBottom: 32 }}>Account Settings</h1>
        <div style={{ background: TOKEN.white, borderRadius: 24, border: `1px solid ${TOKEN.slate100}`, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${TOKEN.slate100}` }}>
            <button onClick={() => setActiveTab('profile')} style={{
              flex: 1, padding: '16px 0', background: 'none', border: 'none', fontWeight: 700, fontSize: 14,
              color: activeTab === 'profile' ? TOKEN.indigo : TOKEN.slate600,
              borderBottom: activeTab === 'profile' ? `2px solid ${TOKEN.indigo}` : 'none', cursor: 'pointer'
            }}><FiUser style={{ display: 'inline', marginRight: 6 }} /> Profile</button>
            <button onClick={() => setActiveTab('password')} style={{
              flex: 1, padding: '16px 0', background: 'none', border: 'none', fontWeight: 700, fontSize: 14,
              color: activeTab === 'password' ? TOKEN.indigo : TOKEN.slate600,
              borderBottom: activeTab === 'password' ? `2px solid ${TOKEN.indigo}` : 'none', cursor: 'pointer'
            }}><FiLock style={{ display: 'inline', marginRight: 6 }} /> Password</button>
          </div>
          <div style={{ padding: 32 }}>
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Name</label>
                  <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} required style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${TOKEN.slate200}` }} />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 6 }}>Email</label>
                  <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} required style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${TOKEN.slate200}` }} />
                </div>
                <button type="submit" disabled={loading} style={{ background: TOKEN.indigo, color: TOKEN.white, border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoDark}
                  onMouseLeave={e => e.currentTarget.style.background = TOKEN.indigo}>
                  <FiSave /> Update Profile
                </button>
              </form>
            )}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, fontSize: 13 }}>Current Password</label>
                  <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${TOKEN.slate200}`, marginTop: 6 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, fontSize: 13 }}>New Password</label>
                  <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${TOKEN.slate200}`, marginTop: 6 }} />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ fontWeight: 600, fontSize: 13 }}>Confirm New Password</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${TOKEN.slate200}`, marginTop: 6 }} />
                </div>
                <button type="submit" disabled={loading} style={{ background: TOKEN.indigo, color: TOKEN.white, border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>Change Password</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;