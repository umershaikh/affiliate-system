import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './AdminStyles.css';

const AdminTodayWithdrawals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/withdrawals/today')
      .then(res => res.json())
      .then(rows => { setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">🏠 / Admin / Today's Cleared Withdrawals</div>
      <h2 className="admin-title">Today's Cleared Withdrawals</h2>

      <div className="admin-stats-bar">
        <div className="admin-stat-chip green">{data.length} Cleared Today</div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">Withdrawals Cleared Today</div>
        <div className="admin-card-body">
          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : data.length === 0 ? (
            <div className="admin-empty">No withdrawals cleared today</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Username</th><th>Email</th><th>Amount</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.username}</td>
                    <td>{row.email}</td>
                    <td>Rs. {row.amount}</td>
                    <td><span className="status-badge approved">{row.status}</span></td>
                    <td>{row.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTodayWithdrawals;
