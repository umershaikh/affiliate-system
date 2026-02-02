import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });
  
  const navigate = useNavigate();

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
            <h1 className="dynamic-brand-logo">ALPHA</h1>
            
            <div className="company-description-urdu">
              <p>Pakistan Alpha Wealth کی ایک جدید ڈیجیٹل سرمایہ کاری کمپنی ہے جو کہ لوگوں کو سرمایہ کاری کرنے کا موقع فراہم کرتی ہے۔</p>
              <p>ہمارا مقصد صارفین کو محفوظ اور قابلِ اعتماد سرمایہ کاری کے مواقع فراہم کرنا ہے۔ اس کے ساتھ ساتھ کمپنی گاہکوں کو بہترین اور جدید سہولیات فراہم کرنے کے لیے کام کر رہی ہے۔</p>
              <p>یہ ادارہ ایک منظم نظام کے تحت شفاف طریقے سے کام کرتا ہے۔</p>
            </div>

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