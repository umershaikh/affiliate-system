import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './CreateAccounts.css';

const CreateAccounts = () => {
  const [pins, setPins] = useState([]);
  const [treeMembers, setTreeMembers] = useState([]);
  const [formData, setFormData] = useState({
    pin: '',
    username: '',
    email: '',
    accountNumber: '',
    paymentMethod: '',
    accountTitle: '',
    underUserId: '',
    position: 'Right',
    agreeTerms: false,
  });
  const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch('/api/pin-codes')
      .then(res => res.json())
      .then(data => setPins(data.filter(p => p.status === 'Available')))
      .catch(() => {});
    apiFetch('/api/tree/members')
      .then(res => res.json())
      .then(data => setTreeMembers(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newData = { ...formData, [name]: type === 'checkbox' ? checked : value };

    // Auto-set position when selecting a tree member
    if (name === 'underUserId' && value) {
      const member = treeMembers.find(m => m.username === value);
      if (member && member.availablePositions.length === 1) {
        newData.position = member.availablePositions[0] === 'left' ? 'Left' : 'Right';
      }
    }
    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: '', error: false });

    if (!formData.pin) {
      setSubmitStatus({ message: 'Please select an E-Pin.', error: true });
      return;
    }
    if (!formData.username || !formData.email) {
      setSubmitStatus({ message: 'Username and email are required.', error: true });
      return;
    }
    if (!formData.agreeTerms) {
      setSubmitStatus({ message: 'Please accept the terms and conditions.', error: true });
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiFetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setSubmitStatus({ message: data.message || 'Account created!', error: !data.success });

      if (data.success) {
        // Remove used pin from dropdown
        setPins(prev => prev.filter(p => p.code !== formData.pin));
        setFormData(f => ({ ...f, pin: '', username: '', email: '' }));
      }
    } catch {
      setSubmitStatus({ message: 'Server error. Please try again.', error: true });
    }
    setSubmitting(false);
  };

  return (
    <div className="ca-page">
      <div className="ca-header">
        <h1 className="ca-header__title">Join a User</h1>
        <p className="ca-header__sub">Use an E-Pin to activate a new account in your binary tree</p>
      </div>

      <div className="ca-layout">
        {/* Info Card */}
        <div className="ca-info">
          <div className="ca-info__card">
            <div className="ca-info__icon">🔑</div>
            <h3>How It Works</h3>
            <ol className="ca-info__steps">
              <li>Get an E-Pin from the "Request E-Pins" page</li>
              <li>Wait for admin to approve your request</li>
              <li>Select your pin below to activate a new user</li>
              <li>Choose where to place them in your tree (Left/Right)</li>
            </ol>
          </div>
          <div className="ca-info__pins">
            <div className="ca-info__pins-label">Available Pins</div>
            <div className="ca-info__pins-count">{pins.length}</div>
            {pins.length === 0 && (
              <p className="ca-info__pins-hint">No pins available. Request one first!</p>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="ca-form-card">
          <h2 className="ca-form-card__title">Create Account</h2>
          <p className="ca-form-card__urdu" dir="rtl">
            تمام ڈیٹا تسلی سے لکھ کر چیک کریں اور پھر کریٹ اکاؤنٹ پر کلک کریں۔
          </p>

          {submitStatus.message && (
            <div className={`ca-alert ${submitStatus.error ? 'ca-alert--error' : 'ca-alert--success'}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="ca-form">
            {/* Pin Select */}
            <div className="ca-field">
              <label className="ca-label">E-Pin *</label>
              <select name="pin" value={formData.pin} onChange={handleChange} className="ca-select" required>
                <option value="">— Select an E-Pin —</option>
                {pins.map(p => (
                  <option key={p.id} value={p.code}>{p.code}</option>
                ))}
              </select>
            </div>

            <div className="ca-row">
              <div className="ca-field">
                <label className="ca-label">Username *</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">👤</span>
                  <input type="text" name="username" value={formData.username} placeholder="New user's username" onChange={handleChange} required />
                </div>
              </div>
              <div className="ca-field">
                <label className="ca-label">Email *</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">📧</span>
                  <input type="email" name="email" value={formData.email} placeholder="New user's email" onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="ca-row">
              <div className="ca-field">
                <label className="ca-label">Account Number</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">🏦</span>
                  <input type="text" name="accountNumber" placeholder="Account number" onChange={handleChange} />
                </div>
              </div>
              <div className="ca-field">
                <label className="ca-label">Account Title</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">💼</span>
                  <input type="text" name="accountTitle" placeholder="Account title" onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="ca-row">
              <div className="ca-field">
                <label className="ca-label">Payment Method</label>
                <select name="paymentMethod" onChange={handleChange} className="ca-select">
                  <option value="">Select method</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
              <div className="ca-field">
                <label className="ca-label">Place Under</label>
                <select name="underUserId" value={formData.underUserId} onChange={handleChange} className="ca-select">
                  <option value="">— You (direct) —</option>
                  {treeMembers.map(m => (
                    <option
                      key={m.username}
                      value={m.username}
                      disabled={m.availablePositions.length === 0}
                    >
                      {m.username} {m.availablePositions.length > 0
                        ? `(${m.availablePositions.join(' & ')} open)`
                        : '(full)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Position */}
            <div className="ca-field">
              <label className="ca-label">Position in Tree</label>
              <div className="ca-position-row">
                <label className={`ca-pos-btn ${formData.position === 'Left' ? 'ca-pos-btn--active' : ''}`}>
                  <input type="radio" name="position" value="Left" onChange={handleChange} />
                  ◀ Left
                </label>
                <label className={`ca-pos-btn ${formData.position === 'Right' ? 'ca-pos-btn--active' : ''}`}>
                  <input type="radio" name="position" value="Right" defaultChecked onChange={handleChange} />
                  Right ▶
                </label>
              </div>
            </div>

            {/* Terms */}
            <label className="ca-terms">
              <input type="checkbox" name="agreeTerms" onChange={handleChange} />
              <span>I accept the Terms and Conditions</span>
            </label>

            <button type="submit" className="ca-submit" disabled={submitting || pins.length === 0}>
              {submitting ? 'Creating...' : pins.length === 0 ? 'No Pins Available' : '🔑 Create Account with E-Pin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccounts;