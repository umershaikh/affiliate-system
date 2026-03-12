import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import { useAuth } from '../../../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const initials = (user?.username || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="prof">
      <div className="prof__breadcrumb">🏠 / My Profile</div>
      <h2 className="prof__title">My Profile</h2>

      <div className="prof__grid">
        {/* Profile Card */}
        <div className="prof__card prof__card--main">
          <div className="prof__avatar">{initials}</div>
          <h3 className="prof__name">{user?.username}</h3>
          <span className="prof__role-badge">{user?.role || 'user'}</span>
          <p className="prof__email">{user?.email || '—'}</p>
          {stats && (
            <p className="prof__joined">Member since {stats.joinDate}</p>
          )}
        </div>

        {/* Details Card */}
        <div className="prof__card prof__card--details">
          <h3 className="prof__card-heading">Account Info</h3>
          <div className="prof__info-grid">
            <div className="prof__info-item">
              <span className="prof__info-label">Username</span>
              <span className="prof__info-value">{user?.username}</span>
            </div>
            <div className="prof__info-item">
              <span className="prof__info-label">Email</span>
              <span className="prof__info-value">{user?.email || '—'}</span>
            </div>
            <div className="prof__info-item">
              <span className="prof__info-label">Role</span>
              <span className="prof__info-value" style={{ textTransform: 'capitalize' }}>{user?.role || 'user'}</span>
            </div>
            <div className="prof__info-item">
              <span className="prof__info-label">Status</span>
              <span className="prof__info-value prof__status-active">Active</span>
            </div>
          </div>

          {!loading && stats && (
            <>
              <h3 className="prof__card-heading" style={{ marginTop: 24 }}>My Stats</h3>
              <div className="prof__stats-grid">
                <div className="prof__stat">
                  <span className="prof__stat-val">{stats.team.directReferrals}</span>
                  <span className="prof__stat-lbl">Direct Referrals</span>
                </div>
                <div className="prof__stat">
                  <span className="prof__stat-val">{stats.team.totalTeamSize}</span>
                  <span className="prof__stat-lbl">Team Size</span>
                </div>
                <div className="prof__stat">
                  <span className="prof__stat-val">Rs. {stats.deposits.total.toFixed(0)}</span>
                  <span className="prof__stat-lbl">Total Deposited</span>
                </div>
                <div className="prof__stat">
                  <span className="prof__stat-val">Rs. {stats.withdrawals.total.toFixed(0)}</span>
                  <span className="prof__stat-lbl">Total Withdrawn</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
