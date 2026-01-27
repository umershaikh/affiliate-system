import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });
  
  const navigate = useNavigate(); // Initialize navigation

  const D_USER = "admin";
  const D_PASS = "12345";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    // Simulate API delay
    setTimeout(() => {
      if (credentials.username === D_USER && credentials.password === D_PASS) {
        // Redirect to /dashboard upon success
        navigate('/dashboard'); 
      } else {
        setStatus({ 
          loading: false, 
          error: 'Access Denied. Please check your credentials.' 
        });
      }
    }, 1200);
  };

  return (
    <div className="dynamic-viewport">
      <div className="dynamic-glass-container">
        <form className="dynamic-login-form" onSubmit={handleLogin}>
          <header className="dynamic-form-header">
            <h1 className="dynamic-brand-logo">NEXUS</h1>
            <p className="dynamic-subtitle">Authorization Required</p>
          </header>

          <div className="dynamic-input-wrapper">
            <input
              type="text"
              name="username"
              className="dynamic-input-field"
              placeholder=" "
              autoComplete="off"
              onChange={handleChange}
              required
            />
            <label className="dynamic-floating-label">Username</label>
          </div>

          <div className="dynamic-input-wrapper">
            <input
              type="password"
              name="password"
              className="dynamic-input-field"
              placeholder=" "
              onChange={handleChange}
              required
            />
            <label className="dynamic-floating-label">Password</label>
          </div>

          {status.error && <div className="dynamic-error-banner">{status.error}</div>}

          <button 
            type="submit" 
            className={`dynamic-submit-btn ${status.loading ? 'is-loading' : ''}`}
            disabled={status.loading}
          >
            {status.loading ? <span className="dynamic-spinner"></span> : "Enter System"}
          </button>

          <footer className="dynamic-form-footer">
            <p className="dynamic-footer-text">Secure Encrypted Session</p>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;