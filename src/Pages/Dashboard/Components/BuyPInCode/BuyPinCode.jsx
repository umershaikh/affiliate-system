import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './BuyPinCode.css';

const BuyPinCode = () => {
  const [pinRequests, setPinRequests] = useState([]);
  const [formData, setFormData] = useState({
    accountNumber: '',
    trxId: '',
    amount: '',
    screenshot: '',
  });
  const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = () => {
    apiFetch('/api/pin-requests')
      .then(res => res.json())
      .then(data => setPinRequests(data))
      .catch(() => {});
  };
  useEffect(fetchRequests, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSubmitStatus({ message: 'Screenshot must be under 5MB.', error: true });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(f => ({ ...f, screenshot: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: '', error: false });
    if (!formData.accountNumber || !formData.trxId || !formData.amount) {
      setSubmitStatus({ message: 'Please fill all required fields.', error: true });
      return;
    }
    setSubmitting(true);
    try {
      const response = await apiFetch('/api/pin-requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setSubmitStatus({ message: data.message || 'Request submitted!', error: !data.success });
      if (data.success) {
        setFormData({ accountNumber: '', trxId: '', amount: '', screenshot: '' });
        fetchRequests();
      }
    } catch {
      setSubmitStatus({ message: 'Server error. Please try again.', error: true });
    }
    setSubmitting(false);
  };

  const getStatusClass = (s) => {
    if (s === 'Approved') return 'bp-status--approved';
    if (s === 'Rejected') return 'bp-status--rejected';
    return 'bp-status--pending';
  };

  return (
    <div className="bp-page">
      {/* Header */}
      <div className="bp-header">
        <div>
          <h1 className="bp-header__title">Request E-Pin</h1>
          <p className="bp-header__sub">Pay and submit your transaction details to receive an E-Pin</p>
        </div>
      </div>

      <div className="bp-layout">
        {/* Payment Info Card */}
        <div className="bp-info">
          <div className="bp-info__card">
            <div className="bp-info__badge">Payment Details</div>
            <h3>Send payment to:</h3>
            <div className="bp-info__detail">
              <span className="bp-info__label">Account Title</span>
              <span className="bp-info__value">John Doe</span>
            </div>
            <div className="bp-info__detail">
              <span className="bp-info__label">Bank</span>
              <span className="bp-info__value">DummyBank</span>
            </div>
            <div className="bp-info__detail">
              <span className="bp-info__label">Account Number</span>
              <span className="bp-info__value bp-info__value--code">0123456789</span>
            </div>
            <div className="bp-info__divider" />
            <p className="bp-info__note" dir="rtl">
              اپنی پن خریدنے کی ادائیگی یہاں اس نمبر پر بھیجنی ہے۔
            </p>
          </div>

          <div className="bp-info__steps">
            <h4>How it works</h4>
            <ol>
              <li>Send payment to the account above</li>
              <li>Fill in the form with your transaction details</li>
              <li>Admin reviews and approves your request</li>
              <li>Your E-Pin appears in "Available E-Pins"</li>
            </ol>
          </div>
        </div>

        {/* Form Card */}
        <div className="bp-form-card">
          <h2 className="bp-form-card__title">Pin Request Form</h2>
          <p className="bp-form-card__warn" dir="rtl">
            ⚠️ جعلی ٹرانزیکشن آئی ڈی لگانے سے آپکی سروس معطل ہو جائے گی۔
          </p>

          {submitStatus.message && (
            <div className={`bp-alert ${submitStatus.error ? 'bp-alert--error' : 'bp-alert--success'}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bp-form">
            <div className="bp-field">
              <label className="bp-label">Account Number *</label>
              <div className="bp-input-wrap">
                <span className="bp-input-icon">🏦</span>
                <input type="text" name="accountNumber" value={formData.accountNumber} placeholder="Your account number" onChange={handleChange} required />
              </div>
            </div>

            <div className="bp-field">
              <label className="bp-label">Transaction ID *</label>
              <div className="bp-input-wrap">
                <span className="bp-input-icon">📋</span>
                <input type="text" name="trxId" value={formData.trxId} placeholder="Transaction ID from your payment" onChange={handleChange} required />
              </div>
            </div>

            <div className="bp-field">
              <label className="bp-label">Amount (Rs.) *</label>
              <div className="bp-input-wrap">
                <span className="bp-input-icon">💰</span>
                <input type="number" name="amount" value={formData.amount} placeholder="Amount paid" onChange={handleChange} required />
              </div>
            </div>

            <div className="bp-field">
              <label className="bp-label">Payment Screenshot</label>
              <div className="bp-upload">
                <input type="file" accept="image/*" onChange={handleFileChange} className="bp-upload__input" />
                <div className="bp-upload__placeholder">
                  {formData.screenshot ? (
                    <img src={formData.screenshot} alt="Preview" className="bp-upload__preview" />
                  ) : (
                    <><span className="bp-upload__icon">📷</span><span>Click to upload screenshot</span></>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="bp-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : '🔑 Submit Pin Request'}
            </button>
          </form>
        </div>
      </div>

      {/* Request History */}
      <div className="bp-history">
        <h2 className="bp-history__title">Request History</h2>
        {pinRequests.length === 0 ? (
          <div className="bp-history__empty">No pin requests yet. Submit your first request above!</div>
        ) : (
          <div className="bp-history__table-wrap">
            <table className="bp-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Account #</th>
                  <th>TRX ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pinRequests.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.accountNumber}</td>
                    <td><code>{row.trxId}</code></td>
                    <td>Rs. {row.amount}</td>
                    <td>{row.createdAt || '—'}</td>
                    <td><span className={`bp-status ${getStatusClass(row.status)}`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPinCode;