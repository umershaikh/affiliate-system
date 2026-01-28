import React from 'react';
import './DashboardHome.css';

const DashboardHome = () => {
  const userStats = [
    { label: 'Total Users', value: '3373', variant: 'blue' },
    { label: 'Active Users', value: '3373', variant: 'green' },
    { label: 'Email Unverified Users', value: '0', variant: 'red' },
    { label: 'Mobile Unverified Users', value: '0', variant: 'orange' },
  ];

  return (
    <div className="dbh-container">
      <header className="dbh-header">
        <h1 className="dbh-header__title">Dashboard</h1>
        <button className="dbh-header__btn">Cron Setup</button>
      </header>

      {/* Row 1: Users */}
      <section className="dbh-grid-quad">
        {userStats.map((stat, idx) => (
          <div key={idx} className={`dbh-stat-card dbh-stat-card--${stat.variant}`}>
            <div className="dbh-stat-card__body">
              <div className="dbh-stat-card__icon">👥</div>
              <div>
                <span className="dbh-stat-card__label">{stat.label}</span>
                <h2 className="dbh-stat-card__value">{stat.value}</h2>
              </div>
            </div>
            <span className="dbh-stat-card__arrow">❯</span>
          </div>
        ))}
      </section>

      {/* Row 2: Deposits & Withdrawals */}
      <section className="dbh-grid-dual">
        <div className="dbh-panel">
          <h3 className="dbh-panel__title">Deposits</h3>
          <div className="dbh-panel__inner-grid">
            <div className="dbh-mini-card dbh-mini--green">
              <div><h4 className="dbh-mini-val">$74,805.00</h4><p className="dbh-mini-label">Total Deposited</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--orange">
              <div><h4 className="dbh-mini-val">95</h4><p className="dbh-mini-label">Pending Deposits</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--red">
              <div><h4 className="dbh-mini-val">0</h4><p className="dbh-mini-label">Rejected Deposits</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--purple">
              <div><h4 className="dbh-mini-val">$823.05</h4><p className="dbh-mini-label">Deposited Charge</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
          </div>
        </div>

        <div className="dbh-panel">
          <h3 className="dbh-panel__title">Withdrawals</h3>
          <div className="dbh-panel__inner-grid">
            <div className="dbh-mini-card dbh-mini--green">
              <div><h4 className="dbh-mini-val">$110.00</h4><p className="dbh-mini-label">Total Withdrawn</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--orange">
              <div><h4 className="dbh-mini-val">40</h4><p className="dbh-mini-label">Pending Withdrawals</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--red">
              <div><h4 className="dbh-mini-val">1</h4><p className="dbh-mini-label">Rejected Withdrawals</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
            <div className="dbh-mini-card dbh-mini--purple">
              <div><h4 className="dbh-mini-val">$4.20</h4><p className="dbh-mini-label">Withdrawal Charge</p></div>
              <span className="dbh-mini-arrow">❯</span>
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: Commissions */}
      <section className="dbh-grid-quad">
        <div className="dbh-promo-card dbh-p-purple">
          <p>Total Invest</p><h3>$98,669.00 USD</h3>
        </div>
        <div className="dbh-promo-card dbh-p-blue">
          <p>Last 7 Days Invest</p><h3>$0.00 USD</h3>
        </div>
        <div className="dbh-promo-card dbh-p-indigo">
          <p>Total Referral Commission</p><h3>$1,086.00 USD</h3>
        </div>
        <div className="dbh-promo-card dbh-p-teal">
          <p>Total Binary Commission</p><h3>$2,760.13 USD</h3>
        </div>
      </section>

      {/* Row 4: BV Cut */}
      <section className="dbh-grid-quad">
        {['0', '14193', '12256', '1937'].map((val, idx) => (
          <div key={idx} className="dbh-bv-card">
            <div className="dbh-bv-info">
              <p>Users Total BV Cut</p><h3>{val}</h3>
            </div>
            <div className="dbh-bv-icon">⚙</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DashboardHome;