import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './AdminStyles.css';

const AdminUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', role: 'user', isActive: true, password: '' });
  const [acting, setActing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchData = () => {
    apiFetch('/api/admin/users').then(r => r.json()).then(rows => { setData(rows); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(fetchData, []);

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ email: u.email, role: u.role, isActive: u.isActive, password: '' });
    setMsg('');
  };

  const saveEdit = async () => {
    setActing(editUser.id);
    const res = await apiFetch(`/api/admin/users/${editUser.id}/update`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    const d = await res.json();
    setActing(null);
    if (d.success) { setEditUser(null); fetchData(); }
    else setMsg(d.message);
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    setActing(id);
    const res = await apiFetch(`/api/admin/users/${id}/delete`, { method: 'DELETE' });
    const d = await res.json();
    setActing(null);
    if (d.success) fetchData();
    else alert(d.message);
  };

  const toggleActive = async (u) => {
    setActing(u.id);
    await apiFetch(`/api/admin/users/${u.id}/update`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    setActing(null);
    fetchData();
  };

  return (
    <div className="admin-page">
      <div className="admin-breadcrumb">🏠 / Admin / Users</div>
      <h2 className="admin-title">User Management</h2>

      <div className="admin-stats-bar">
        <div className="admin-stat-chip blue">{data.length} Total</div>
        <div className="admin-stat-chip green">{data.filter(d => d.isActive).length} Active</div>
        <div className="admin-stat-chip orange">{data.filter(d => d.role === 'admin').length} Admins</div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">Registered Users</div>
        <div className="admin-card-body">
          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Active</th><th>Joined</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td><strong>{row.username}</strong></td>
                      <td>{row.email}</td>
                      <td><span className={`status-badge ${row.role === 'admin' ? 'approved' : 'available'}`}>{row.role}</span></td>
                      <td>
                        <button
                          className={`admin-toggle ${row.isActive ? 'admin-toggle--on' : 'admin-toggle--off'}`}
                          onClick={() => toggleActive(row)}
                          disabled={acting === row.id}
                        >
                          {row.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>{row.dateJoined?.split(' ')[0]}</td>
                      <td>
                        <div className="admin-actions-row">
                          <button className="admin-btn admin-btn--edit" onClick={() => openEdit(row)} disabled={acting === row.id}>Edit</button>
                          <button className="admin-btn admin-btn--reject" onClick={() => handleDelete(row.id, row.username)} disabled={acting === row.id}>Delete</button>
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

      {/* Edit Modal */}
      {editUser && (
        <div className="admin-modal-overlay" onClick={() => setEditUser(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Edit User: {editUser.username}</h3>
              <button className="admin-modal-close" onClick={() => setEditUser(null)}>✕</button>
            </div>
            {msg && <div className="admin-modal-msg">{msg}</div>}
            <div className="admin-modal-body">
              <label>Email</label>
              <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />

              <label>Role</label>
              <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <label>Active</label>
              <select value={editForm.isActive ? 'true' : 'false'} onChange={e => setEditForm({...editForm, isActive: e.target.value === 'true'})}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              <label>Reset Password (leave empty to keep)</label>
              <input type="text" placeholder="New password" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn--approve" onClick={saveEdit} disabled={acting === editUser.id}>
                {acting === editUser.id ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="admin-btn admin-btn--edit" onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
