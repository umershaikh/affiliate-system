import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribing:', email);
    // Add your submission logic here
  };

  return (
    <section className="nl-cta-wrapper">
      <div className="nl-container">
        <h2 className="nl-title">Subscribe To Our Newsletter</h2>
        
        <form className="nl-form-box" onSubmit={handleSubmit}>
          <div className="nl-input-group">
            <input
              type="email"
              className="nl-email-input"
              placeholder="Type your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="nl-submit-button">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;