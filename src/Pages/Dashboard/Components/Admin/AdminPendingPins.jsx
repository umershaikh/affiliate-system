import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './AdminStyles.css';

const AdminPendingPins = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  const fetchData = () => {
    apiFetch('/api/admin/pins/pending')
      .then(res => res.json())
      .then(rows => { setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const handleAction = async (id, action) => {
    setActing(id);
    try {
      const res = await apiFetch(`/api/admin/pins/${id}/action`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
      const result = await res.json();
      if (result.success) {
        fetchData();
      }
    } catch (err) { console.error(err); }
    setActing(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">🏠 / Admin / Pending E-Pin Requests</div>
      <h2 className="admin-title">Pending E-Pin Requests</h2>

      <div className="admin-stats-bar">
        <div className="admin-stat-chip orange">{data.length} Pending</div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">Pin Requests Awaiting Approval</div>
        <div className="admin-card-body">
          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : data.length === 0 ? (
            <div className="admin-empty">No pending pin requests</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Username</th><th>Account #</th><th>TRX ID</th>
                  <th>Amount</th><th>Date</th><th>Attachment</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(row => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.username}</td>
                    <td>{row.accountNumber}</td>
                    <td>{row.trxId}</td>
                    <td>Rs. {row.amount}</td>
                    <td>{row.createdAt}</td>
                    <td>
                      {row.screenshot ? (
                        <button 
                          className="admin-btn admin-btn--edit" 
                          onClick={() => setViewImage(row.screenshot)}
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
                        <button className="admin-btn admin-btn--approve" disabled={acting === row.id} onClick={() => handleAction(row.id, 'approve')}>Approve</button>
                        <button className="admin-btn admin-btn--reject" disabled={acting === row.id} onClick={() => handleAction(row.id, 'reject')}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
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

export default AdminPendingPins;
