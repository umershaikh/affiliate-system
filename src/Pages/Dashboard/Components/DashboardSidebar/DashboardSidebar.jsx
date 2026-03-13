import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import apiFetch from '../../../../utils/api';
import { formatCurrencyPKR } from '../../../../utils/format';
import './DashboardSidebar.css';
import { 
  LayoutDashboard, History, GitGraph, Medal, UserPlus, KeyRound, Ticket, Lock,
  AlertTriangle, ClipboardCheck, DollarSign, Users, Gift,
  Wallet, ArrowLeftRight, Play, TrendingUp
} from 'lucide-react';

const DashboardSidebar = ({ closeMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const base = "/dashboard";
  const [balance, setBalance] = useState(null);

  const isAdminPath = location.pathname.startsWith(`${base}/admin`);

  // Fetch balance for user sidebar
  useEffect(() => {
    if (!isAdminPath) {
      apiFetch('/api/dashboard/stats')
        .then(r => r.json())
        .then(d => setBalance(d.availableBalance))
        .catch(() => {});
    }
  }, [isAdminPath]);

  // User Menu Items — grouped
  const userItems = [
    { type: 'label', label: 'Main' },
    { icon: LayoutDashboard, label: "Home", path: `${base}` },
    { icon: GitGraph, label: "My Tree", path: `${base}/tree` },

    { type: 'label', label: 'Finance' },
    { icon: Wallet, label: "Deposit Funds", path: `${base}/deposit` },
    { icon: History, label: "Withdrawals", path: `${base}/withdraw` },

    { type: 'label', label: 'Earn' },
    { icon: Play, label: "Watch & Earn", path: `${base}/watch-and-earn` },
    { icon: Medal, label: "Alpha Bonuses", path: `${base}/rewards` },
    { icon: UserPlus, label: "Join a User", path: `${base}/create-account` },

    { type: 'label', label: 'Pins' },
    { icon: KeyRound, label: "Request E-pins", path: `${base}/buy-pin` },
    { icon: Ticket, label: "Available E-pins", path: `${base}/view-pin` },

    { type: 'label', label: 'Account' },
    { icon: Lock, label: "Change Password", path: `${base}/change-password` },
  ];

  // Admin Menu Items — grouped
  const adminItems = [
    { type: 'label', label: 'Overview' },
    { icon: LayoutDashboard, label: "Dashboard", path: `${base}/admin/overview` },
    { icon: Users, label: "All Users", path: `${base}/admin/users` },

    { type: 'label', label: 'Withdrawals' },
    { icon: AlertTriangle, label: "Pending", path: `${base}/admin/withdrawals-pending` },
    { icon: ClipboardCheck, label: "Today Cleared", path: `${base}/admin/withdrawals-today` },
    { icon: DollarSign, label: "All Withdrawals", path: `${base}/admin/withdrawals-total` },

    { type: 'label', label: 'Deposits & Pins' },
    { icon: Wallet, label: "Pending Deposits", path: `${base}/admin/deposits-pending` },
    { icon: DollarSign, label: "All Deposits", path: `${base}/admin/deposits-total` },
    { icon: Ticket, label: "Available E-pins", path: `${base}/admin/pins-available` },
    { icon: KeyRound, label: "Pending E-pin Req.", path: `${base}/admin/pins-pending` },

    { type: 'label', label: 'Other' },
    { icon: Gift, label: "Rewards", path: `${base}/admin/rewards` },
  ];

  const menuItems = (isAdminPath && isAdmin) ? adminItems : userItems;

  const handleNavigate = (path) => {
    navigate(path);
    if (closeMobileMenu) closeMobileMenu();
  };

  return (
    <aside className={`rps-sidebar-root ${isAdminPath ? 'admin-mode' : ''}`}>
      {/* Logo */}
      <div className="rps-logo-wrapper">
        <div className="rps-logo-top">
          <h2 className="rps-brand-name">
            Alpha Wealth<span className="rps-brand-accent">.</span>
          </h2>
          {isAdminPath && <span className="rps-admin-tag">Admin Panel</span>}
        </div>
        <div className="rps-brand-tagline">Alpha Today • Success Forever</div>
      </div>

      {/* Balance Widget (user side only) */}
      {!isAdminPath && balance !== null && (
        <div className="rps-balance-widget">
          <div className="rps-balance-widget__top">
            <TrendingUp size={14} />
            <span>Available Balance</span>
          </div>
          <div className="rps-balance-widget__amount">Rs. {formatCurrencyPKR(balance)}</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="rps-nav-list">
        {menuItems.map((item, index) => {
          if (item.type === 'label') {
            return <div key={index} className="rps-section-label">{item.label}</div>;
          }

          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;

          return (
            <div 
              key={index} 
              className={`rps-menu-item ${isActive ? 'rps-item-active' : ''}`}
              onClick={() => handleNavigate(item.path)}
            >
              <div className="rps-item-content">
                <div className="rps-item-icon-wrap">
                  <IconComponent size={16} />
                </div>
                <span className="rps-item-label">{item.label}</span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Switch Button */}
      {isAdmin && (
        <div className="rps-switch-area">
          <button
            className="rps-switch-btn"
            onClick={() => handleNavigate(isAdminPath ? `${base}` : `${base}/admin/overview`)}
          >
            <ArrowLeftRight size={15} />
            {isAdminPath ? 'User Dashboard' : 'Admin Panel'}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="rps-sidebar-footer">
        <div className="rps-user-profile">
          <div className="rps-footer-avatar">
            {(user?.username || 'U').slice(0, 2).toUpperCase()}
          </div>
          <div className="rps-user-info">
            <span className="rps-user-name">{user?.username || 'Guest'}</span>
            <span className="rps-user-role">{isAdminPath ? 'Administrator' : (user?.role || 'User')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;