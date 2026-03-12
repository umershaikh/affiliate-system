import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import apiFetch from '../../../../utils/api';
import AwpLogo from "../../../../Images/AwpLogo.png";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [activeLink, setActiveLink] = useState('');
  const [balance, setBalance] = useState(null);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Faq', path: '/faq' },
    { name: 'Plan', path: '/plan' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    const path = location.pathname.toLowerCase().replace('/', '');
    setActiveLink(path || 'home');
  }, [location]);

  // Fetch balance when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      apiFetch('/api/withdrawals/balance')
        .then(r => r.json())
        .then(d => setBalance(d.balance))
        .catch(() => {});
    } else {
      setBalance(null);
    }
  }, [isAuthenticated]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/home');
  };

  return (
    <div className='full-header-div'>
      <nav className="navbar-container">
        <div className="navbar-logo">
          <img src={AwpLogo} alt="Logo" className="logo-img" />
        </div>

        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className={`nav-content ${isMenuOpen ? 'open' : ''}`}>
          <div className="navbar-pill">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${activeLink === link.name.toLowerCase() ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="navbar-right">
            {isAuthenticated ? (
              <div className="header-user-section">
                {/* Balance Badge */}
                {balance !== null && (
                  <div className="header-balance-badge">
                    <span className="header-balance-icon">💰</span>
                    <span className="header-balance-amount">Rs. {balance.toFixed(2)}</span>
                  </div>
                )}

                {/* Dashboard Button */}
                <Link
                  to="/dashboard"
                  className="header-dashboard-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {/* User Avatar + Name */}
                <div className="header-user-info">
                  <div className="header-user-avatar">
                    {(user?.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <span className="header-username">{user?.username || 'User'}</span>
                </div>

                {/* Logout */}
                <button className="header-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <span className="phone-number">(+62 123 4567 980)</span>
                <span className="separator">|</span>
                
                <Link 
                  to="/help"
                  className={`nav-link ${activeLink === 'help' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Help Center
                </Link>

                <Link 
                  to="/login" 
                  className="signup-btn"
                  style={{ textDecoration: 'none', textAlign: 'center' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;