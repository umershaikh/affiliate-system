import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './AdminStyles.css';

const EMPTY = { team: '', rank: '', reward: '', status: 'Non-active' };

const AdminRewards = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [modal, setModal] = useState(null);        // null | 'create' | row object
  const [form, setForm] = useState({ ...EMPTY });
  const [msg, setMsg] = useState('');

  const fetchData = () => {
    apiFetch('/api/admin/rewards')
      .then(r => r.json())
      .then(rows => { setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(fetchData, []);

  const openCreate = () => { setForm({ ...EMPTY }); setMsg(''); setModal('create'); };
  const openEdit = (r) => { setForm({ team: r.team, rank: r.rank, reward: r.reward, status: r.status }); setMsg(''); setModal(r); };

  const handleSave = async () => {
    setActing('saving');
    if (modal === 'create') {
      const res = await apiFetch('/api/admin/rewards/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.success) { setModal(null); fetchData(); } else setMsg(d.message);
    } else {
      const res = await apiFetch(`/api/admin/rewards/${modal.id}/update`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.success) { setModal(null); fetchData(); } else setMsg(d.message);
    }
    setActing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reward?')) return;
    setActing(id);
    const res = await apiFetch(`/api/admin/rewards/${id}/delete`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) fetchData();
    setActing(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">🏠 / Admin / Rewards</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 className="admin-title" style={{ marginBottom: 0 }}>Reward Levels</h2>
        <button className="admin-btn admin-btn--approve" style={{ padding: '8px 18px', fontSize: 13 }} onClick={openCreate}>+ Add Reward</button>
      </div>

      <div className="admin-stats-bar" style={{ marginTop: 16 }}>
        <div className="admin-stat-chip blue">{data.length} Total</div>
        <div className="admin-stat-chip green">{data.filter(d => d.status !== 'Non-active').length} Active</div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">Reward Levels</div>
        <div className="admin-card-body">
          {loading ? <div className="admin-loading">Loading...</div> : data.length === 0 ? <div className="admin-empty">No rewards</div> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Team Requirement</th><th>Rank</th><th>Reward (Rs.)</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={row.id}>
                      <td>{i + 1}</td>
                      <td>{row.team}</td>
                      <td>{row.rank}</td>
                      <td>Rs. {row.reward}</td>
                      <td><span className={`status-badge ${row.status === 'Non-active' ? 'non-active' : 'active'}`}>{row.status}</span></td>
                      <td>
                        <div className="admin-actions-row">
                          <button className="admin-btn admin-btn--edit" onClick={() => openEdit(row)} disabled={acting === row.id}>Edit</button>
                          <button className="admin-btn admin-btn--reject" onClick={() => handleDelete(row.id)} disabled={acting === row.id}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modal === 'create' ? 'Create Reward' : 'Edit Reward'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            {msg && <div className="admin-modal-msg">{msg}</div>}
            <div className="admin-modal-body">
              <label>Team Requirement</label>
              <input value={form.team} onChange={e => setForm({...form, team: e.target.value})} placeholder="e.g. 10 Members" />
              <label>Rank</label>
              <input value={form.rank} onChange={e => setForm({...form, rank: e.target.value})} placeholder="e.g. Silver" />
              <label>Reward Amount</label>
              <input value={form.reward} onChange={e => setForm({...form, reward: e.target.value})} placeholder="e.g. 5000" />
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="Non-active">Non-active</option>
                <option value="Active">Active</option>
              </select>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn--approve" onClick={handleSave} disabled={acting === 'saving'}>
                {acting === 'saving' ? 'Saving...' : 'Save'}
              </button>
              <button className="admin-btn admin-btn--edit" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRewards;
