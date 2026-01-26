import React from 'react';
import './FaqBanner.css';

const FaqBanner = ({ title = "FAQ", breadcrumbActive = "FAQ" }) => {
  return (
    <section className="faq-section-container">
      <div className="faq-overlay-content">
        <div className="faq-wrapper">
          <h1 className="faq-main-title">{title}</h1>
          <nav aria-label="breadcrumb" className="faq-breadcrumb-nav">
            <ul className="faq-breadcrumb-list">
              <li className="faq-breadcrumb-item">
                <a href="/" className="faq-link">Home</a>
              </li>
              <li className="faq-breadcrumb-separator">/</li>
              <li className="faq-breadcrumb-item faq-active" aria-current="page">
                {breadcrumbActive}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default FaqBanner;