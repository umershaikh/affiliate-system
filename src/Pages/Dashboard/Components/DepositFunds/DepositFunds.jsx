import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './DepositFunds.css';

const METHODS = [
  { key: 'EasyPaisa', label: 'EasyPaisa', icon: '📱', color: '#4caf50' },
  { key: 'JazzCash', label: 'JazzCash', icon: '📲', color: '#e91e63' },
  { key: 'Bank', label: 'Bank Transfer', icon: '🏦', color: '#1565c0' },
];

const DepositFunds = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [form, setForm] = useState({ amount: '', trxId: '', senderAccount: '', screenshot: '' });
  const [deposits, setDeposits] = useState([]);
  const [msg, setMsg] = useState({ text: '', error: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch('/api/payment-info').then(r => r.json()).then(setPaymentInfo).catch(() => {});
    apiFetch('/api/deposits').then(r => r.json()).then(setDeposits).catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setMsg({ text: 'File size must be under 5MB', error: true }); return; }
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, screenshot: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', error: false });
    if (!selectedMethod || !form.amount) { setMsg({ text: 'Select a method and enter amount.', error: true }); return; }
    setLoading(true);
    try {
      const res = await apiFetch('/api/deposits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, paymentMethod: selectedMethod }),
      });
      const data = await res.json();
      setMsg({ text: data.message, error: !data.success });
      if (data.success) {
        setForm({ amount: '', trxId: '', senderAccount: '', screenshot: '' });
        setSelectedMethod(null);
        // Refresh deposits
        apiFetch('/api/deposits').then(r => r.json()).then(setDeposits).catch(() => {});
      }
    } catch { setMsg({ text: 'Server error.', error: true }); }
    setLoading(false);
  };

  const info = selectedMethod ? paymentInfo[selectedMethod] : null;

  return (
    <div className="dep">
      <div className="dep__breadcrumb">🏠 / Deposit Funds</div>
      <h2 className="dep__title">Deposit Funds</h2>

      {/* Method Selection */}
      <div className="dep__methods">
        {METHODS.map(m => (
          <button
            key={m.key}
            className={`dep__method-card ${selectedMethod === m.key ? 'dep__method-card--active' : ''}`}
            onClick={() => setSelectedMethod(m.key)}
            style={{ '--accent': m.color }}
          >
            <span className="dep__method-icon">{m.icon}</span>
            <span className="dep__method-label">{m.label}</span>
            {selectedMethod === m.key && <span className="dep__method-check">✓</span>}
          </button>
        ))}
      </div>

      {/* Payment Info + Form */}
      {selectedMethod && info && (
        <div className="dep__form-area">
          {/* Admin Account Details */}
          <div className="dep__info-card">
            <h3 className="dep__info-title">{info.title}</h3>
            <div className="dep__info-row">
              <span className="dep__info-label">Account Number</span>
              <span className="dep__info-value dep__copyable">{info.accountNumber}</span>
            </div>
            <div className="dep__info-row">
              <span className="dep__info-label">Account Name</span>
              <span className="dep__info-value">{info.accountName}</span>
            </div>
            {info.bankName && (
              <div className="dep__info-row">
                <span className="dep__info-label">Bank</span>
                <span className="dep__info-value">{info.bankName}</span>
              </div>
            )}
            <p className="dep__info-instructions">{info.instructions}</p>
          </div>

          {/* Deposit Form */}
          <form className="dep__form" onSubmit={handleSubmit}>
            {msg.text && <div className={`dep__msg ${msg.error ? 'dep__msg--err' : 'dep__msg--ok'}`}>{msg.text}</div>}

            <div className="dep__field">
              <label>Amount (PKR) *</label>
              <input type="number" placeholder="Enter amount" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="dep__field">
              <label>Sender Account / Number</label>
              <input type="text" placeholder="Your account number" value={form.senderAccount}
                onChange={e => setForm({ ...form, senderAccount: e.target.value })} />
            </div>
            <div className="dep__field">
              <label>Transaction ID</label>
              <input type="text" placeholder="TRX / Reference ID" value={form.trxId}
                onChange={e => setForm({ ...form, trxId: e.target.value })} />
            </div>
            <div className="dep__field">
              <label>Payment Screenshot *</label>
              <div className="dep__file-area">
                <input type="file" accept="image/*" onChange={handleFileChange} id="dep-screenshot" />
                <label htmlFor="dep-screenshot" className="dep__file-label">
                  {form.screenshot ? '✅ Screenshot attached' : '📎 Click to attach screenshot'}
                </label>
              </div>
              {form.screenshot && (
                <img src={form.screenshot} alt="Preview" className="dep__preview" />
              )}
            </div>
            <button type="submit" className="dep__submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Deposit Request'}
            </button>
          </form>
        </div>
      )}

      {/* Deposit History */}
      {deposits.length > 0 && (
        <div className="dep__history">
          <h3 className="dep__history-title">My Deposit History</h3>
          <div className="dep__table-wrap">
            <table className="dep__table">
              <thead>
                <tr><th>#</th><th>Amount</th><th>Method</th><th>TRX ID</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {deposits.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>Rs. {d.amount}</td>
                    <td>{d.paymentMethod}</td>
                    <td>{d.trxId || '—'}</td>
                    <td><span className={`dep__badge dep__badge--${d.status.toLowerCase()}`}>{d.status}</span></td>
                    <td>{d.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositFunds;
