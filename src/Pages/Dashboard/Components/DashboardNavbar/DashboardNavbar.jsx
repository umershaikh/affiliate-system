import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import WithdrawModal from '../WithdrawModal/WithdrawModal';
import './DashboardNavbar.css';

const DashboardNavbar = ({ onMenuClick, isOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdminPath = location.pathname.startsWith('/dashboard/admin');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNav = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const initials = (user?.username || 'U').slice(0, 2).toUpperCase();

  return (
    <>
      <nav className={`dnav ${isAdminPath ? 'dnav--admin' : ''}`}>
        {/* Left: hamburger */}
        <div className="dnav__left">
          <button 
            type="button" 
            className={`dnav__hamburger ${isOpen ? 'dnav__hamburger--open' : ''}`} 
            onClick={onMenuClick}
            aria-label="Toggle Menu"
          >
            <span /><span /><span />
          </button>

          {isAdminPath && (
            <div className="dnav__admin-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin
            </div>
          )}
        </div>

        {/* Right section: action buttons + profile */}
        <div className="dnav__right" ref={dropdownRef}>

          {/* Quick Action Buttons — only on user side */}
          {!isAdminPath && (
            <div className="dnav__actions">
              <button className="dnav__action-btn dnav__action-btn--deposit" onClick={() => navigate('/dashboard/deposit')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
                <span>Deposit</span>
              </button>
              <button className="dnav__action-btn dnav__action-btn--withdraw" onClick={() => setWithdrawOpen(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                </svg>
                <span>Withdraw</span>
              </button>
            </div>
          )}

          {/* Profile */}
          <button className="dnav__profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="dnav__avatar">{initials}</div>
            <div className="dnav__user-info">
              <span className="dnav__username">{user?.username || 'Guest'}</span>
              <span className="dnav__role">{isAdminPath ? 'Admin' : (user?.role || 'user')}</span>
            </div>
            <svg className={`dnav__chevron ${dropdownOpen ? 'dnav__chevron--open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          {dropdownOpen && (
            <div className="dnav__dropdown">
              <div className="dnav__dropdown-header">
                <div className="dnav__dropdown-avatar">{initials}</div>
                <div>
                  <div className="dnav__dropdown-name">{user?.username}</div>
                  <div className="dnav__dropdown-email">{user?.email || 'user@alpha.com'}</div>
                </div>
              </div>
              <div className="dnav__dropdown-divider" />
              <button className="dnav__dropdown-item" onClick={() => handleNav('/dashboard/profile')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                My Profile
              </button>
              <button className="dnav__dropdown-item" onClick={() => handleNav('/dashboard/change-password')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Change Password
              </button>
              <div className="dnav__dropdown-divider" />
              <button className="dnav__dropdown-item dnav__dropdown-item--danger" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
    </>
  );
};

export default DashboardNavbar;