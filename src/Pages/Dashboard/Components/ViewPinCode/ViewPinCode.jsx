import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import './ViewPinCode.css';

const ViewPinCode = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    apiFetch('/api/pin-codes')
      .then(res => res.json())
      .then(data => { setPins(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const available = pins.filter(p => p.status === 'Available');
  const used = pins.filter(p => p.status === 'Used');

  if (loading) {
    return (
      <div className="vp-page">
        <div className="vp-loader"><div className="vp-spinner" /><span>Loading pins...</span></div>
      </div>
    );
  }

  return (
    <div className="vp-page">
      <div className="vp-header">
        <div>
          <h1 className="vp-header__title">My E-Pins</h1>
          <p className="vp-header__sub">Your digital vouchers for account activation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="vp-stats">
        <div className="vp-stat vp-stat--total">
          <span className="vp-stat__num">{pins.length}</span>
          <span className="vp-stat__label">Total</span>
        </div>
        <div className="vp-stat vp-stat--avail">
          <span className="vp-stat__num">{available.length}</span>
          <span className="vp-stat__label">Available</span>
        </div>
        <div className="vp-stat vp-stat--used">
          <span className="vp-stat__num">{used.length}</span>
          <span className="vp-stat__label">Used</span>
        </div>
      </div>

      {pins.length === 0 ? (
        <div className="vp-empty">
          <div className="vp-empty__icon">🔑</div>
          <h3>No E-Pins Yet</h3>
          <p>Request pins from the "Request E-Pins" page. Once approved, they'll appear here.</p>
        </div>
      ) : (
        <>
          {/* Available Pins */}
          {available.length > 0 && (
            <div className="vp-section">
              <h2 className="vp-section__title">🟢 Available Pins</h2>
              <div className="vp-grid">
                {available.map(pin => (
                  <div key={pin.id} className="vp-card vp-card--avail">
                    <div className="vp-card__badge">Available</div>
                    <code className="vp-card__code">{pin.code}</code>
                    <button
                      className={`vp-card__copy ${copied === pin.id ? 'vp-card__copy--done' : ''}`}
                      onClick={() => handleCopy(pin.code, pin.id)}
                    >
                      {copied === pin.id ? '✓ Copied!' : '📋 Copy Code'}
                    </button>
                    <div className="vp-card__meta">
                      Use this pin in "Join a User" to activate an account
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Used Pins */}
          {used.length > 0 && (
            <div className="vp-section">
              <h2 className="vp-section__title">⚫ Used Pins</h2>
              <div className="vp-grid">
                {used.map(pin => (
                  <div key={pin.id} className="vp-card vp-card--used">
                    <div className="vp-card__badge vp-card__badge--used">Used</div>
                    <code className="vp-card__code">{pin.code}</code>
                    {pin.usedBy && (
                      <div className="vp-card__used-info">
                        <span>Activated: <strong>{pin.usedBy}</strong></span>
                        {pin.usedAt && <span className="vp-card__date">{pin.usedAt}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewPinCode;