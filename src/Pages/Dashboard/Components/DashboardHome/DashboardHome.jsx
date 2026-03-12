import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import { useAuth } from '../../../../context/AuthContext';
import { formatCurrencyPKR } from '../../../../utils/format';
import './DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    apiFetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="dbh-container"><p>Loading...</p></div>;
  }

  if (!stats) {
    return <div className="dbh-container"><p>Failed to load dashboard data.</p></div>;
  }

  const leftCount = stats.team?.leftCount || 0;
  const rightCount = stats.team?.rightCount || 0;
  const pairCount = Math.min(leftCount, rightCount);
  const pairBonus = pairCount * 200;

  return (
    <div className="dbh-container">
      <header className="dbh-header">
        <h1 className="dbh-header__title">Welcome, {user?.username || 'User'}!</h1>
        <span className="dbh-header__badge">Member since {stats.joinDate}</span>
      </header>

      {/* Available Balance Card */}
      <section className="dbh-balance-hero">
        <div className="dbh-balance-hero__left">
          <span className="dbh-balance-hero__label">Available Balance</span>
          <h2 className="dbh-balance-hero__amount">Rs. {formatCurrencyPKR(stats.availableBalance)}</h2>
          <span className="dbh-balance-hero__sub">
            Pending withdrawals: Rs. {formatCurrencyPKR(stats.withdrawals.pending || 0)}
          </span>
          <span className="dbh-balance-hero__sub dbh-balance-hero__sub--pair">
            Binary pair income: Rs. {formatCurrencyPKR(pairBonus)} ({pairCount} pairs)
          </span>
        </div>
        <div className="dbh-balance-hero__icon">💰</div>
      </section>

      {/* Row 1: Team / Referrals */}
      <section className="dbh-grid-quad">
        <div className="dbh-stat-card dbh-stat-card--blue">
          <div className="dbh-stat-card__body">
            <div className="dbh-stat-card__icon">👥</div>
            <div>
              <span className="dbh-stat-card__label">Direct Referrals</span>
              <h2 className="dbh-stat-card__value">{stats.team.directReferrals}</h2>
            </div>
          </div>
        </div>
        <div className="dbh-stat-card dbh-stat-card--green">
          <div className="dbh-stat-card__body">
            <div className="dbh-stat-card__icon">🌳</div>
            <div>
              <span className="dbh-stat-card__label">Total Team Size</span>
              <h2 className="dbh-stat-card__value">{stats.team.totalTeamSize}</h2>
            </div>
          </div>
        </div>
        <div className="dbh-stat-card dbh-stat-card--orange">
          <div className="dbh-stat-card__body">
            <div className="dbh-stat-card__icon">🔑</div>
            <div>
              <span className="dbh-stat-card__label">Pins Available</span>
              <h2 className="dbh-stat-card__value">{stats.pins.available}</h2>
            </div>
          </div>
        </div>
        <div className="dbh-stat-card dbh-stat-card--red">
          <div className="dbh-stat-card__body">
            <div className="dbh-stat-card__icon">🎫</div>
            <div>
              <span className="dbh-stat-card__label">Pins Used</span>
              <h2 className="dbh-stat-card__value">{stats.pins.used}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Row 2: Deposits & Withdrawals */}
      <section className="dbh-grid-dual">
        <div className="dbh-panel">
          <h3 className="dbh-panel__title">My Deposits</h3>
          <div className="dbh-panel__inner-grid">
            <div className="dbh-mini-card dbh-mini--green">
                <div><h4 className="dbh-mini-val">Rs. {formatCurrencyPKR(stats.deposits.total)}</h4><p className="dbh-mini-label">Total Deposited</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--orange">
              <div><h4 className="dbh-mini-val">{stats.deposits.pendingCount}</h4><p className="dbh-mini-label">Pending</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--blue">
              <div><h4 className="dbh-mini-val">{stats.deposits.approvedCount}</h4><p className="dbh-mini-label">Approved</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--red">
              <div><h4 className="dbh-mini-val">{stats.deposits.rejectedCount}</h4><p className="dbh-mini-label">Rejected</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
          </div>
        </div>

        <div className="dbh-panel">
          <h3 className="dbh-panel__title">My Withdrawals</h3>
          <div className="dbh-panel__inner-grid">
            <div className="dbh-mini-card dbh-mini--green">
                <div><h4 className="dbh-mini-val">Rs. {formatCurrencyPKR(stats.withdrawals.total)}</h4><p className="dbh-mini-label">Total Withdrawn</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--orange">
              <div><h4 className="dbh-mini-val">{stats.withdrawals.pendingCount}</h4><p className="dbh-mini-label">Pending</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--blue">
              <div><h4 className="dbh-mini-val">{stats.withdrawals.approvedCount}</h4><p className="dbh-mini-label">Approved</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--red">
              <div><h4 className="dbh-mini-val">{stats.withdrawals.rejectedCount}</h4><p className="dbh-mini-label">Rejected</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: Quick Summary */}
      <section className="dbh-grid-quad">
        <div className="dbh-promo-card dbh-p-purple">
          <p>Approved Deposits</p><h3>Rs. {formatCurrencyPKR(stats.deposits.approved)}</h3>
        </div>
        <div className="dbh-promo-card dbh-p-blue">
          <p>Approved Withdrawals</p><h3>Rs. {formatCurrencyPKR(stats.withdrawals.approved)}</h3>
        </div>
        <div className="dbh-promo-card dbh-p-indigo">
          <p>Direct Referrals</p><h3>{stats.team.directReferrals}</h3>
        </div>
        <div className="dbh-promo-card dbh-p-teal">
          <p>Total Team</p><h3>{stats.team.totalTeamSize}</h3>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;