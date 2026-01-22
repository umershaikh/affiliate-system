import AwpLogo from "../../../../Images/AwpLogo.png"
import React, { useState } from 'react';
import "./Header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='full-header-div'>
    <nav className="navbar-container">
      {/* Logo replaced with Image */}
      <div className="navbar-logo">
        <img src={AwpLogo} alt="Bodar Logo" className="logo-img" />
      </div>

      {/* Hamburger Menu Icon (Mobile Only) */}
      <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Nav Content - Desktop Pill & Mobile Menu */}
      <div className={`nav-content ${isMenuOpen ? 'open' : ''}`}>
        <div className="navbar-pill">
          <a href="#home" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Capabilities</a>
          <a href="#terms" className="nav-link" onClick={() => setIsMenuOpen(false)}>Partner with Zynterris</a>
        </div>

        <div className="navbar-right">
          <span className="phone-number">(+62 123 4567 980)</span>
          <span className="separator">|</span>
          <a href="#help" className="nav-link" onClick={() => setIsMenuOpen(false)}>Help Center</a>
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Header;