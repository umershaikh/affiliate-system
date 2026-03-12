import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './AdminStyles.css';

const AdminPendingDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  const fetchDeposits = () => {
    apiFetch('/api/admin/deposits/pending')
      .then(r => r.json()).then(d => { setDeposits(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(fetchDeposits, []);

  const handleAction = async (id, action) => {
    setActing(id);
    try {
      const res = await apiFetch(`/api/admin/deposits/${id}/action`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) fetchDeposits();
    } catch {}
    setActing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deposit record?')) return;
    setActing(id);
    const res = await apiFetch(`/api/admin/deposits/${id}/delete`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) fetchDeposits();
    setActing(null);
  };

  if (loading) return <div className="admin-page"><div className="admin-loading">Loading...</div></div>;

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">🏠 / Admin / Pending Deposits</div>
      <h2 className="admin-title">Pending Deposits</h2>
      <div className="admin-stats-bar">
        <div className="admin-stat-chip orange">⏳ {deposits.length} Pending</div>
      </div>
      {deposits.length === 0 ? (
        <div className="admin-empty">No pending deposits.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>User</th><th>Amount</th><th>Method</th><th>TRX ID</th><th>Date</th><th>Attachment</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {deposits.map((d, i) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td><strong>{d.username}</strong><br/><small>{d.email}</small></td>
                  <td>Rs. {d.amount}</td>
                  <td>{d.paymentMethod}</td>
                  <td>{d.trxId || '—'}</td>
                  <td>{d.createdAt}</td>
                  <td>
                    {d.screenshot ? (
                      <button 
                        className="admin-btn admin-btn--edit" 
                        onClick={() => setViewImage(d.screenshot)}
                        title="View Screenshot"
                      >
                        👁 View
                      </button>
                    ) : (
                      <span style={{ color: '#999', fontSize: 12 }}>None</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-actions-row">
                      <button className="admin-btn admin-btn--approve" onClick={() => handleAction(d.id, 'approve')} disabled={acting === d.id}>Approve</button>
                      <button className="admin-btn admin-btn--reject" onClick={() => handleAction(d.id, 'reject')} disabled={acting === d.id}>Reject</button>
                      <button className="admin-btn admin-btn--reject" onClick={() => handleDelete(d.id)} disabled={acting === d.id}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Image Modal */}
      {viewImage && (
        <div className="admin-modal-overlay" onClick={() => setViewImage(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', p: 0 }}>
            <div className="admin-modal-header">
              <h3>Payment Proof</h3>
              <button className="admin-modal-close" onClick={() => setViewImage(null)}>✕</button>
            </div>
            <div style={{ padding: '0', textAlign: 'center', maxHeight: '70vh', overflow: 'auto' }}>
              <img src={viewImage} alt="Payment Proof" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingDeposits;
