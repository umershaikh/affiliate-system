import React from 'react';
import './PlanBanner.css';

const PlanBanner = ({ title = "Show All Plan", breadcrumbActive = "Show All Plan" }) => {
  return (
    <section className="plan-banner-container">
      <div className="plan-overlay-content">
        <div className="plan-wrapper">
          <h1 className="plan-main-title">{title}</h1>
          <nav aria-label="breadcrumb" className="plan-breadcrumb-nav">
            <ul className="plan-breadcrumb-list">
              <li className="plan-breadcrumb-item">
                <a href="/" className="plan-link">Home</a>
              </li>
              <li className="plan-breadcrumb-separator">/</li>
              <li className="plan-breadcrumb-item plan-active" aria-current="page">
                {breadcrumbActive}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default PlanBanner;