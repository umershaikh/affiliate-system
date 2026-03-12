import React, { useState } from 'react';
import apiFetch from '../../../../utils/api';
import { useAuth } from '../../../../context/AuthContext';

function ChangePassword() {
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({ message: '', error: false, loading: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: '', error: false, loading: true });

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ message: 'New passwords do not match.', error: true, loading: false });
      return;
    }

    try {
      const res = await apiFetch('/api/change-password', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        // Update token since password changed
        if (data.token) {
          login(data.token, user);
        }
        setStatus({ message: data.message, error: false, loading: false });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setStatus({ message: data.message, error: true, loading: false });
      }
    } catch (err) {
      setStatus({ message: 'Server error. Please try again.', error: true, loading: false });
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <span>🏠</span> / Change Password
      </div>
      <h2 style={{ marginBottom: '24px', fontSize: '22px' }}>Change Password</h2>

      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}>
        {status.message && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '8px',
            background: status.error ? '#fff0f0' : '#f0fff0',
            color: status.error ? '#d32f2f' : '#2e7d32',
            border: `1px solid ${status.error ? '#ffcdd2' : '#c8e6c9'}`,
            fontSize: '14px',
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#333' }}>
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              placeholder="Enter current password"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#333' }}>
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="Enter new password"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#333' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading}
            style={{
              width: '100%',
              padding: '14px',
              background: status.loading ? '#999' : '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: status.loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {status.loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;