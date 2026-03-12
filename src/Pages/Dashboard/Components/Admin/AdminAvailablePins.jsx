import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './AdminStyles.css';

const AdminAvailablePins = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [showGen, setShowGen] = useState(false);
  const [genCount, setGenCount] = useState(5);
  const [assignTo, setAssignTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchData = () => {
    apiFetch('/api/admin/pins/available')
      .then(res => res.json())
      .then(rows => { setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    fetchData();
    apiFetch('/api/admin/users')
      .then(res => res.json())
      .then(u => setUsers(u))
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMsg('');
    try {
      const res = await apiFetch('/api/admin/pins/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: genCount, assignTo }),
      });
      const d = await res.json();
      setGenMsg(d.message);
      if (d.success) { fetchData(); }
    } catch {
      setGenMsg('Server error.');
    }
    setGenerating(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pin?')) return;
    setActing(id);
    const res = await apiFetch(`/api/admin/pins/${id}/delete`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) fetchData();
    setActing(null);
  };

  const filtered = filter === 'all' ? data
    : filter === 'available' ? data.filter(r => r.status === 'Available')
    : filter === 'used' ? data.filter(r => r.status === 'Used')
    : filter === 'unassigned' ? data.filter(r => !r.assignedTo && r.status === 'Available')
    : data;

  const available = data.filter(r => r.status === 'Available').length;
  const used = data.filter(r => r.status === 'Used').length;
  const unassigned = data.filter(r => !r.assignedTo && r.status === 'Available').length;

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">🏠 / Admin / E-Pins Management</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 className="admin-title" style={{ marginBottom: 0 }}>E-Pins Management</h2>
        <button className="admin-btn admin-btn--approve" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => { setShowGen(true); setGenMsg(''); }}>+ Generate Pins</button>
      </div>

      <div className="admin-stats-bar" style={{ marginTop: 16 }}>
        <div className="admin-stat-chip blue" onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}>{data.length} Total</div>
        <div className="admin-stat-chip green" onClick={() => setFilter('available')} style={{ cursor: 'pointer' }}>{available} Available</div>
        <div className="admin-stat-chip gray" onClick={() => setFilter('used')} style={{ cursor: 'pointer' }}>{used} Used</div>
        {unassigned > 0 && (
          <div className="admin-stat-chip red" onClick={() => setFilter('unassigned')} style={{ cursor: 'pointer' }}>{unassigned} Unassigned</div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          {filter === 'all' ? 'All Pins' : filter === 'available' ? 'Available Pins' : filter === 'used' ? 'Used Pins' : 'Unassigned Pins'}
          {filter !== 'all' && <button onClick={() => setFilter('all')} style={{ color:"#fff",  marginLeft: 10, fontSize: 11, background: 'none', border: '1px solid #ccc', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Show All</button>}
        </div>
        <div className="admin-card-body">
          {loading ? <div className="admin-loading">Loading...</div> : filtered.length === 0 ? <div className="admin-empty">No pins found</div> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Pin Code</th><th>Status</th><th>Assigned To</th><th>Used By</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(row => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td><code style={{ background: '#f5f5f5', padding: '2px 8px', borderRadius: 4 }}>{row.code}</code></td>
                      <td><span className={`status-badge ${row.status === 'Available' ? 'available' : 'used'}`}>{row.status}</span></td>
                      <td>{row.assignedTo || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td>{row.usedBy || <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td>{row.createdAt}</td>
                      <td><button className="admin-btn admin-btn--reject" onClick={() => handleDelete(row.id)} disabled={acting === row.id}>🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Generate Modal */}
      {showGen && (
        <div className="admin-modal-overlay" onClick={() => setShowGen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Generate E-Pins</h3>
              <button className="admin-modal-close" onClick={() => setShowGen(false)}>✕</button>
            </div>
            <div className="admin-modal-body">
              {genMsg && (
                <div style={{ padding: 10, borderRadius: 6, marginBottom: 12, fontSize: 13, background: genMsg.includes('created') ? '#f0fdf4' : '#fef2f2', color: genMsg.includes('created') ? '#16a34a' : '#dc2626' }}>
                  {genMsg}
                </div>
              )}
              <label>Number of Pins (1-100)</label>
              <input type="number" min={1} max={100} value={genCount} onChange={e => setGenCount(e.target.value)} />

              <label style={{ marginTop: 12, display: 'block' }}>Assign to User (optional)</label>
              <select value={assignTo} onChange={e => setAssignTo(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }}>
                <option value="">— No user (unassigned) —</option>
                {users.map(u => (
                  <option key={u.id} value={u.username}>{u.username} ({u.email})</option>
                ))}
              </select>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                If assigned, the user will see these pins in their "Available E-Pins" page.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn--approve" onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generating...' : `Generate ${genCount} Pin(s)`}
              </button>
              <button className="admin-btn admin-btn--edit" onClick={() => setShowGen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAvailablePins;
