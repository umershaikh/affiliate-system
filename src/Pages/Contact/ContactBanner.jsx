import React from 'react';
import './ContactBanner.css';

const ContactBanner = ({ title = "Contact Us", breadcrumbActive = "Contact Us" }) => {
  return (
    <section className="contact-banner-container">
      <div className="contact-overlay-content">
        <div className="contact-wrapper">
          <h1 className="contact-main-title">{title}</h1>
          <nav aria-label="breadcrumb" className="contact-breadcrumb-nav">
            <ul className="contact-breadcrumb-list">
              <li className="contact-breadcrumb-item">
                <a href="/" className="contact-link">Home</a>
              </li>
              <li className="contact-breadcrumb-separator">/</li>
              <li className="contact-breadcrumb-item contact-active" aria-current="page">
                {breadcrumbActive}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;