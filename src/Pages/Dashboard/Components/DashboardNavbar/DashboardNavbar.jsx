import React, { useState, useEffect, useRef } from 'react';
import './DashboardNavbar.css';

const DashboardNavbar = ({ onMenuClick, isOpen }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="db-nav-wrapper" ref={dropdownRef}>
      <div className="db-nav-left">
        {/* Animated Hamburger Button */}
        <button 
          type="button" 
          className={`db-nav-res-btn ${isOpen ? 'active' : ''}`} 
          onClick={onMenuClick}
          aria-label="Toggle Menu"
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>

        <form className="db-nav-search-form">
          <input 
            type="search" 
            className="db-nav-search-input" 
            placeholder="Search here..." 
          />
          <i className="las la-search db-nav-search-icon"></i>
        </form>
      </div>

      <div className="db-nav-right">
        <ul className="db-nav-action-list">
          <li>
            <button className="db-nav-icon-btn">
              <a href="#0"><i className="las la-globe"></i></a>
            </button>
          </li>

          <li className="db-nav-dropdown-rel">
            <button className="db-nav-icon-btn" onClick={() => toggleDropdown('notif')}>
              <i className="las la-bell"></i>
              <span className="db-nav-badge">9+</span>
            </button>
            
            {activeDropdown === 'notif' && (
              <div className="db-nav-dropdown-menu db-nav-notif-box">
                <div className="db-nav-dropdown-header">
                  <h6>Notification</h6>
                  <p>You have 46 unread notifications</p>
                </div>
                <div className="db-nav-scroll-area">
                  {[1, 2].map((item) => (
                    <div key={item} className="db-nav-notif-item">
                      <h6>New member registered</h6>
                      <span><i className="far fa-clock"></i> 1 week ago</span>
                    </div>
                  ))}
                </div>
                <div className="db-nav-dropdown-footer">
                  <a href="#0">View all notifications</a>
                </div>
              </div>
            )}
          </li>

          <li>
            <button className="db-nav-icon-btn">
              <a href="#0"><i className="las la-wrench"></i></a>
            </button>
          </li>

          <li className="db-nav-dropdown-rel">
            <button className="db-nav-profile-trigger" onClick={() => toggleDropdown('profile')}>
              <div className="db-nav-avatar">
                <img src="https://script.viserlab.com/revptc/assets/viseradmin/images/profile/6655bb33c75f01716894515.png" alt="admin" />
              </div>
              <span className="db-nav-username">admin</span>
              <i className="las la-chevron-circle-down"></i>
            </button>

            {activeDropdown === 'profile' && (
              <div className="db-nav-dropdown-menu db-nav-profile-box">
                <a href="#0" className="db-nav-menu-link">
                  <i className="las la-user-circle"></i> Profile
                </a>
                <a href="#0" className="db-nav-menu-link">
                  <i className="las la-key"></i> Password
                </a>
                <div className="db-nav-divider"></div>
                <a href="#0" className="db-nav-menu-link db-nav-logout">
                  <i className="las la-sign-out-alt"></i> Logout
                </a>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default DashboardNavbar;