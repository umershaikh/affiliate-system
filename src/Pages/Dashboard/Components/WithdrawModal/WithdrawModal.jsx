import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './WithdrawModal.css';

const METHODS = [
  { key: 'EasyPaisa', label: 'EasyPaisa', icon: '📱', color: '#4caf50' },
  { key: 'JazzCash', label: 'JazzCash', icon: '📲', color: '#e91e63' },
  { key: 'Bank', label: 'Bank Transfer', icon: '🏦', color: '#1565c0' },
];

const WithdrawModal = ({ isOpen, onClose, onSuccess }) => {
  const [method, setMethod] = useState('');
  const [form, setForm] = useState({ amount: '', accountNumber: '', accountTitle: '', bankName: '', iban: '' });
  const [balance, setBalance] = useState(0);
  const [msg, setMsg] = useState({ text: '', error: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMethod('');
      setForm({ amount: '', accountNumber: '', accountTitle: '', bankName: '', iban: '' });
      setMsg({ text: '', error: false });
      apiFetch('/api/withdrawals/balance').then(r => r.json()).then(d => setBalance(d.balance)).catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', error: false });
    if (!method || !form.amount) { setMsg({ text: 'Select method and enter amount.', error: true }); return; }
    if (parseFloat(form.amount) > balance) { setMsg({ text: `Amount exceeds your available balance of Rs. ${balance.toFixed(2)}`, error: true }); return; }

    setLoading(true);
    try {
      const res = await apiFetch('/api/withdrawals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, paymentMethod: method }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: data.message, error: false });
        setTimeout(() => { onClose(); if (onSuccess) onSuccess(); }, 1500);
      } else {
        setMsg({ text: data.message, error: true });
      }
    } catch { setMsg({ text: 'Server error.', error: true }); }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="wm-overlay" onClick={onClose}>
      <div className="wm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="wm-header">
          <div>
            <h3 className="wm-title">Request Withdrawal</h3>
            <p className="wm-balance">Available Balance: <strong>Rs. {balance.toFixed(2)}</strong></p>
          </div>
          <button className="wm-close" onClick={onClose}>✕</button>
        </div>

        {msg.text && <div className={`wm-msg ${msg.error ? 'wm-msg--err' : 'wm-msg--ok'}`}>{msg.text}</div>}

        {/* Method Selection */}
        <div className="wm-methods">
          {METHODS.map(m => (
            <button
              key={m.key}
              type="button"
              className={`wm-method ${method === m.key ? 'wm-method--active' : ''}`}
              onClick={() => setMethod(m.key)}
              style={{ '--clr': m.color }}
            >
              <span className="wm-method-icon">{m.icon}</span>
              <span className="wm-method-label">{m.label}</span>
              {method === m.key && <span className="wm-method-check">✓</span>}
            </button>
          ))}
        </div>

        {/* Form */}
        {method && (
          <form className="wm-form" onSubmit={handleSubmit}>
            <div className="wm-field">
              <label>Amount (PKR) *</label>
              <input type="number" placeholder="Enter amount" value={form.amount}
                max={balance} onChange={e => setForm({ ...form, amount: e.target.value })} required />
            </div>

            {(method === 'EasyPaisa' || method === 'JazzCash') && (
              <>
                <div className="wm-field">
                  <label>{method} Account Number *</label>
                  <input type="text" placeholder="03XX-XXXXXXX" value={form.accountNumber}
                    onChange={e => setForm({ ...form, accountNumber: e.target.value })} required />
                </div>
                <div className="wm-field">
                  <label>Account Title *</label>
                  <input type="text" placeholder="Account holder name" value={form.accountTitle}
                    onChange={e => setForm({ ...form, accountTitle: e.target.value })} required />
                </div>
              </>
            )}

            {method === 'Bank' && (
              <>
                <div className="wm-field">
                  <label>Bank Name *</label>
                  <input type="text" placeholder="e.g. Meezan Bank" value={form.bankName}
                    onChange={e => setForm({ ...form, bankName: e.target.value })} required />
                </div>
                <div className="wm-field">
                  <label>Account Number *</label>
                  <input type="text" placeholder="Bank account number" value={form.accountNumber}
                    onChange={e => setForm({ ...form, accountNumber: e.target.value })} required />
                </div>
                <div className="wm-field">
                  <label>Account Title *</label>
                  <input type="text" placeholder="Account holder name" value={form.accountTitle}
                    onChange={e => setForm({ ...form, accountTitle: e.target.value })} required />
                </div>
                <div className="wm-field">
                  <label>IBAN (Optional)</label>
                  <input type="text" placeholder="PK00 XXXX 0000 0000 0000 0000" value={form.iban}
                    onChange={e => setForm({ ...form, iban: e.target.value })} />
                </div>
              </>
            )}

            <button type="submit" className="wm-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;
