import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import WithdrawModal from '../WithdrawModal/WithdrawModal';
import './WithdrawHistory.css';

const WithdrawHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = () => {
    apiFetch('/api/withdrawals')
      .then(res => res.json())
      .then(rows => { setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(fetchData, []);

  return (
    <div className="wh-wrapper">
      <div className="wh-breadcrumb-nav">
        <span className="wh-icon-home">🏠</span> / Withdrawal History
      </div>

      <div className="wh-page-header">
        <h2 className="wh-page-heading">Withdrawal History</h2>
        <button className="wh-request-btn" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
          </svg>
          Request Withdrawal
        </button>
      </div>

      <div className="wh-data-card">
        <div className="wh-data-header">Withdrawals List</div>
        <div className="wh-table-container">
          {loading ? (
            <p style={{ padding: '1rem' }}>Loading...</p>
          ) : data.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No withdrawals yet.</p>
          ) : (
            <table className="wh-custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Account</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td>Rs. {row.amount}</td>
                    <td>{row.paymentMethod || '—'}</td>
                    <td>{row.accountNumber || row.email || '—'}</td>
                    <td>
                      <span className={`wh-badge wh-badge--${row.status.toLowerCase()}`}>{row.status}</span>
                    </td>
                    <td>{row.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <WithdrawModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchData} />
    </div>
  );
};

export default WithdrawHistory;