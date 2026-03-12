import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './AdminStyles.css';

const AdminPendingWithdrawals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  const fetchData = () => {
    apiFetch('/api/admin/withdrawals/pending')
      .then(r => r.json()).then(rows => { setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(fetchData, []);

  const handleAction = async (id, action) => {
    setActing(id);
    try {
      await apiFetch(`/api/admin/withdrawals/${id}/action`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      fetchData();
    } catch {}
    setActing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this withdrawal record?')) return;
    setActing(id);
    const res = await apiFetch(`/api/admin/withdrawals/${id}/delete`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) fetchData();
    setActing(null);
  };

  if (loading) return <div className="admin-page"><div className="admin-loading">Loading...</div></div>;

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">🏠 / Admin / Pending Withdrawals</div>
      <h2 className="admin-title">Pending Withdrawals</h2>
      <div className="admin-stats-bar">
        <div className="admin-stat-chip orange">⏳ {data.length} Pending</div>
      </div>
      {data.length === 0 ? (
        <div className="admin-empty">No pending withdrawals.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Username</th><th>Email</th><th>Amount</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td><strong>{row.username}</strong></td>
                  <td>{row.email}</td>
                  <td>Rs. {row.amount}</td>
                  <td>{row.createdAt}</td>
                  <td>
                    <div className="admin-actions-row">
                      <button className="admin-btn admin-btn--approve" disabled={acting === row.id} onClick={() => handleAction(row.id, 'approve')}>Approve</button>
                      <button className="admin-btn admin-btn--reject" disabled={acting === row.id} onClick={() => handleAction(row.id, 'reject')}>Reject</button>
                      <button className="admin-btn admin-btn--reject" disabled={acting === row.id} onClick={() => handleDelete(row.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPendingWithdrawals;
