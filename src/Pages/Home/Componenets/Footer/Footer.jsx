import React from 'react';
import './Footer.css';

// Note: Ensure you have FontAwesome or LineAwesome linked in your index.html 
// for the icons to appear, or install via npm.

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer-wrapper">
      <div className="custom-footer-container">
        
        {/* Social Media Icons Area */}
        <div className="custom-social-row">
          <ul className="custom-social-list">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" title="Youtube">
                <i className="fab fa-youtube"></i>
              </a>
            </li>
            <li>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" title="Telegram">
                <i className="fab fa-telegram-plane"></i>
              </a>
            </li>
          </ul>
        </div>

        {/* Decorative Divider with Center Dot */}
        <div className="custom-footer-divider">
          <span className="divider-dot"></span>
        </div>

        {/* Copyright Text */}
        <div className="custom-copyright-row">
          <p>Copyright © {currentYear}. All Rights Reserved</p>
        </div>
      </div>

      {/* Scroll to Top Button (Bottom Right) */}
      <button className="custom-scroll-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <i className="fas fa-angle-double-up"></i>
      </button>
    </footer>
  );
};

export default Footer;