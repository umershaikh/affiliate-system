import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AwpLogo from "../../../../Images/AwpLogo.png";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Initialize state based on current path
  const [activeLink, setActiveLink] = useState('');

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Faq', path: '/faq' },
    { name: 'Plan', path: '/plan' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  // Logic moved inside useEffect to satisfy exhaustive-deps
  useEffect(() => {
    const path = location.pathname.toLowerCase().replace('/', '');
    setActiveLink(path || 'home');
  }, [location]); // Now only depends on location

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;