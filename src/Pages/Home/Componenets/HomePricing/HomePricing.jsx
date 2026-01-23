import React from 'react';
import './HomePricing.css';

const planData = [
  { id: 1, name: "Basic", price: "20.00", bv: "2", referral: "$1.00 USD", tree: "$0.99 USD", adLimit: "5" },
  { id: 2, name: "Optimal", price: "100.00", bv: "5", referral: "$2.00 USD", tree: "$1.00 USD", adLimit: "200" },
  { id: 3, name: "Silver", price: "800.00", bv: "10", referral: "$10.00 USD", tree: "$2.00 USD", adLimit: "250" },
  { id: 4, name: "Gold", price: "1,000.00", bv: "20", referral: "$30.00 USD", tree: "$2.50 USD", adLimit: "500" },
  { id: 9, name: "Diamond", price: "1,200.00", bv: "30", referral: "$40.00 USD", tree: "$3.80 USD", adLimit: "650" },
  { id: 5, name: "Platinum", price: "2,000.00", bv: "50", referral: "$50.00 USD", tree: "$5.00 USD", adLimit: "850" },
];

const HomePricing = () => {
  return (
    <section className="hp-main-pricing-section">
      <div className="hp-content-container">
        
        <header className="hp-section-header">
          <span className="hp-badge-text">OUR PLANS</span>
          <h2 className="hp-primary-heading">Choose The Most Suitable Plan For You</h2>
          <div className="hp-divider-visual">
            <span className="hp-line-left"></span>

            <span className="hp-line-right"></span>
          </div>
        </header>

        <div className="hp-plans-layout-grid">
          {planData.map((plan) => (
            <div key={plan.id} className="hp-individual-card">
              <div className="hp-card-header-purple">
                <h3 className="hp-plan-tier-name">{plan.name}</h3>
                <div className="hp-price-display">
                  <span className="hp-currency-symbol">$</span>
                  <span className="hp-price-integer">{plan.price}</span>
                </div>
                {/* Fixed: This SVG now correctly draws a downward purple triangle */}
                <div className="hp-v-shape-container">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path d="M0,0 L250,150 L500,0 Z"></path>
                    </svg>
                </div>
              </div>

              <div className="hp-card-body-content">
                <ul className="hp-feature-bullet-list">
                  <li className="hp-list-item-row">
                    <span className="hp-label">Business Volume (BV) : <b className="hp-value">{plan.bv}</b></span>
                    <i className="fas fa-question-circle hp-help-trigger"></i>
                  </li>
                  <li className="hp-list-item-row">
                    <span className="hp-label">Referral Commission : <b className="hp-value">{plan.referral}</b></span>
                    <i className="fas fa-question-circle hp-help-trigger"></i>
                  </li>
                  <li className="hp-list-item-row">
                    <span className="hp-label">Commission To Tree : <b className="hp-value">{plan.tree}</b></span>
                    <i className="fas fa-question-circle hp-help-trigger"></i>
                  </li>
                  <li className="hp-list-item-row">
                    <span className="hp-label">Daily Ad Limit : <b className="hp-value">{plan.adLimit}</b></span>
                    <i className="fas fa-question-circle hp-help-trigger"></i>
                  </li>
                </ul>
                <button className="hp-cta-subscribe-button">Subscribe Now</button>
              </div>
            </div>
          ))}
        </div>

        <div className="hp-footer-action-area">
          <button className="hp-view-all-plans-btn">View All Plan</button>
        </div>
      </div>
    </section>
  );
};

export default HomePricing;