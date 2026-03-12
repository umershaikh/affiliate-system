import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './AdminStyles.css';

const AdminTotalWithdrawals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  const fetchData = () => {
    apiFetch('/api/admin/withdrawals/all')
      .then(res => res.json())
      .then(rows => { setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(fetchData, []);

  const getStatusClass = (s) => s === 'Approved' ? 'approved' : s === 'Rejected' ? 'rejected' : 'pending';

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this withdrawal record?')) return;
    setActing(id);
    const res = await apiFetch(`/api/admin/withdrawals/${id}/delete`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) fetchData();
    setActing(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">🏠 / Admin / Total Withdrawals</div>
      <h2 className="admin-title">Total Withdrawals</h2>
      <div className="admin-stats-bar">
        <div className="admin-stat-chip blue">{data.length} Total</div>
        <div className="admin-stat-chip green">{data.filter(d => d.status === 'Approved').length} Approved</div>
        <div className="admin-stat-chip orange">{data.filter(d => d.status === 'Pending').length} Pending</div>
        <div className="admin-stat-chip red">{data.filter(d => d.status === 'Rejected').length} Rejected</div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">All Withdrawal Records</div>
        <div className="admin-card-body">
          {loading ? <div className="admin-loading">Loading...</div> : data.length === 0 ? <div className="admin-empty">No withdrawals</div> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id}>
                      <td>{row.id}</td><td>{row.username}</td><td>{row.email}</td>
                      <td>Rs. {row.amount}</td>
                      <td><span className={`status-badge ${getStatusClass(row.status)}`}>{row.status}</span></td>
                      <td>{row.updatedAt}</td>
                      <td><button className="admin-btn admin-btn--reject" onClick={() => handleDelete(row.id)} disabled={acting === row.id}>🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTotalWithdrawals;
