import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="adm-dash"><div className="adm-dash__loader"><div className="adm-dash__spinner" /><span>Loading dashboard...</span></div></div>;
  if (!stats) return <div className="adm-dash"><div className="adm-dash__error">Failed to load dashboard data.</div></div>;

  const platformBalance = (stats.deposits.approved - stats.withdrawals.approved).toFixed(2);

  return (
    <div className="adm-dash">
      {/* Header */}
      <div className="adm-dash__header">
        <div>
          <h1 className="adm-dash__title">Dashboard</h1>
          <p className="adm-dash__subtitle">Platform overview & key metrics</p>
        </div>
        <div className="adm-dash__header-right">
          <div className="adm-dash__live-dot" />
          <span>Live Data</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="adm-dash__kpi-row">
        <div className="adm-kpi adm-kpi--purple">
          <div className="adm-kpi__icon">👥</div>
          <div className="adm-kpi__data">
            <span className="adm-kpi__value">{stats.users.total}</span>
            <span className="adm-kpi__label">Total Users</span>
          </div>
          <div className="adm-kpi__badge">{stats.users.active} active</div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi__icon">💰</div>
          <div className="adm-kpi__data">
            <span className="adm-kpi__value">Rs. {stats.deposits.total.toFixed(0)}</span>
            <span className="adm-kpi__label">Total Deposits</span>
          </div>
          <div className="adm-kpi__badge">{stats.deposits.pendingCount} pending</div>
        </div>
        <div className="adm-kpi adm-kpi--blue">
          <div className="adm-kpi__icon">💸</div>
          <div className="adm-kpi__data">
            <span className="adm-kpi__value">Rs. {stats.withdrawals.total.toFixed(0)}</span>
            <span className="adm-kpi__label">Total Withdrawals</span>
          </div>
          <div className="adm-kpi__badge">{stats.withdrawals.pendingCount} pending</div>
        </div>
        <div className="adm-kpi adm-kpi--teal">
          <div className="adm-kpi__icon">🏦</div>
          <div className="adm-kpi__data">
            <span className="adm-kpi__value">Rs. {platformBalance}</span>
            <span className="adm-kpi__label">Platform Balance</span>
          </div>
          <div className="adm-kpi__badge">net</div>
        </div>
      </div>

      {/* Detail Panels Row */}
      <div className="adm-dash__panels">
        {/* Deposits Panel */}
        <div className="adm-panel">
          <div className="adm-panel__head">
            <h3>💰 Deposits Breakdown</h3>
            <button className="adm-panel__link" onClick={() => navigate('/dashboard/admin/deposits-total')}>View All →</button>
          </div>
          <div className="adm-panel__metrics">
            <div className="adm-metric">
              <div className="adm-metric__bar adm-metric__bar--green" />
              <div className="adm-metric__info">
                <span className="adm-metric__label">Approved</span>
                <span className="adm-metric__val">Rs. {stats.deposits.approved.toFixed(2)}</span>
              </div>
            </div>
            <div className="adm-metric">
              <div className="adm-metric__bar adm-metric__bar--amber" />
              <div className="adm-metric__info">
                <span className="adm-metric__label">Pending</span>
                <span className="adm-metric__val">{stats.deposits.pendingCount} requests</span>
              </div>
            </div>
            <div className="adm-metric">
              <div className="adm-metric__bar adm-metric__bar--red" />
              <div className="adm-metric__info">
                <span className="adm-metric__label">Rejected</span>
                <span className="adm-metric__val">{stats.deposits.rejectedCount} requests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawals Panel */}
        <div className="adm-panel">
          <div className="adm-panel__head">
            <h3>💸 Withdrawals Breakdown</h3>
            <button className="adm-panel__link" onClick={() => navigate('/dashboard/admin/withdrawals-total')}>View All →</button>
          </div>
          <div className="adm-panel__metrics">
            <div className="adm-metric">
              <div className="adm-metric__bar adm-metric__bar--green" />
              <div className="adm-metric__info">
                <span className="adm-metric__label">Approved</span>
                <span className="adm-metric__val">Rs. {stats.withdrawals.approved.toFixed(2)}</span>
              </div>
            </div>
            <div className="adm-metric">
              <div className="adm-metric__bar adm-metric__bar--amber" />
              <div className="adm-metric__info">
                <span className="adm-metric__label">Pending</span>
                <span className="adm-metric__val">{stats.withdrawals.pendingCount} requests</span>
              </div>
            </div>
            <div className="adm-metric">
              <div className="adm-metric__bar adm-metric__bar--red" />
              <div className="adm-metric__info">
                <span className="adm-metric__label">Rejected</span>
                <span className="adm-metric__val">{stats.withdrawals.rejectedCount} requests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Pins + Quick Actions */}
      <div className="adm-dash__panels">
        {/* Pins */}
        <div className="adm-panel">
          <div className="adm-panel__head">
            <h3>🔑 E-Pin Status</h3>
            <button className="adm-panel__link" onClick={() => navigate('/dashboard/admin/pins-available')}>Manage →</button>
          </div>
          <div className="adm-dash__pin-row">
            <div className="adm-dash__pin-card adm-dash__pin-card--avail">
              <span className="adm-dash__pin-num">{stats.pins.available}</span>
              <span className="adm-dash__pin-label">Available</span>
            </div>
            <div className="adm-dash__pin-card adm-dash__pin-card--pending">
              <span className="adm-dash__pin-num">{stats.pins.pendingRequests}</span>
              <span className="adm-dash__pin-label">Pending Requests</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="adm-panel">
          <div className="adm-panel__head">
            <h3>⚡ Quick Actions</h3>
          </div>
          <div className="adm-dash__actions">
            <button className="adm-action" onClick={() => navigate('/dashboard/admin/deposits-pending')}>
              <span className="adm-action__icon">📥</span>
              <span>Pending Deposits</span>
              {stats.deposits.pendingCount > 0 && <span className="adm-action__count">{stats.deposits.pendingCount}</span>}
            </button>
            <button className="adm-action" onClick={() => navigate('/dashboard/admin/withdrawals-pending')}>
              <span className="adm-action__icon">📤</span>
              <span>Pending Withdrawals</span>
              {stats.withdrawals.pendingCount > 0 && <span className="adm-action__count">{stats.withdrawals.pendingCount}</span>}
            </button>
            <button className="adm-action" onClick={() => navigate('/dashboard/admin/pins-pending')}>
              <span className="adm-action__icon">🎫</span>
              <span>Pin Requests</span>
              {stats.pins.pendingRequests > 0 && <span className="adm-action__count">{stats.pins.pendingRequests}</span>}
            </button>
            <button className="adm-action" onClick={() => navigate('/dashboard/admin/users')}>
              <span className="adm-action__icon">👥</span>
              <span>Manage Users</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
