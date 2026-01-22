import React from 'react';
import './HomeHero.css';

const HomeHero = () => {
  return (
    <section className="home-hero-section">
      <div className="home-hero-container">
        <div className="home-hero-row">
          
          {/* Left Column: Image */}
          <div className="home-hero-thumb">
            <img 
              src="https://script.viserlab.com/revptc/assets/images/frontend/about/6381e0483a4b41669455944.png" 
              alt="About RevPTC" 
            />
          </div>

          {/* Right Column: Text Content */}
          <div className="home-hero-content">
            <div className="section-header">
              <h3 className="sub-title">ABOUT RevPTC</h3>
              <h2 className="section-title">What We Are</h2>
              <div className="title-divider"></div>
            </div>
            <p className="description">
              We are not just an online version of any Business market, but also, the reflection 
              of each and every MLM business. We are an international financial company engaged 
              in investment activities, which are related to MLM on financial markets by qualified 
              professional traders. Our goal is to provide our investors with a reliable source 
              of high income, while minimizing any possible risks and offering a high-quality 
              service, allowing us to automate and simplify the relations between the investors 
              and the trustees. We work towards increasing your profit margin by profitable 
              investment. We look forward to you being part of our community.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeHero;