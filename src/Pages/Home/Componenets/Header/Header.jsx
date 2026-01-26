import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added this import
import AwpLogo from "../../../../Images/AwpLogo.png";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to get current path name for state initialization
  const getCurrentPage = () => {
    const path = window.location.pathname.toLowerCase().replace('/', '');
    return path || 'home'; 
  };

  // INITIALIZE state directly from the URL to prevent flickering
  const [activeLink, setActiveLink] = useState(getCurrentPage());

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Faq', path: '/faq' },
    { name: 'Plan', path: '/plan' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  // Sync state if the user hits the back/forward button
  useEffect(() => {
    const handleLocationChange = () => {
      setActiveLink(getCurrentPage());
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

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
                to={link.path} // Changed href to to
                className={`nav-link ${activeLink === link.name.toLowerCase() ? 'active' : ''}`}
                onClick={() => {
                  setActiveLink(link.name.toLowerCase());
                  setIsMenuOpen(false); // Close menu on click
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="navbar-right">
            <span className="phone-number">(+62 123 4567 980)</span>
            <span className="separator">|</span>
            <Link 
              to="/help"  // Changed href to to
              className={`nav-link ${activeLink === 'help' ? 'active' : ''}`}
              onClick={() => {
                setActiveLink('help');
                setIsMenuOpen(false);
              }}
            >
              Help Center
            </Link>
            <button className="signup-btn">Sign Up</button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;