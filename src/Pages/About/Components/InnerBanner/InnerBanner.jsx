import React from 'react';
import './InnerBanner.css';

const InnerBanner = ({ title = "About", breadcrumbActive = "About" }) => {
  return (
    <section className="ib-section-container">
      <div className="ib-overlay-content">
        <div className="ib-wrapper">
          <h1 className="ib-main-title">{title}</h1>
          <nav aria-label="breadcrumb" className="ib-breadcrumb-nav">
            <ul className="ib-breadcrumb-list">
              <li className="ib-breadcrumb-item">
                <a href="/" className="ib-link">Home</a>
              </li>
              <li className="ib-breadcrumb-separator">/</li>
              <li className="ib-breadcrumb-item ib-active" aria-current="page">
                {breadcrumbActive}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default InnerBanner;