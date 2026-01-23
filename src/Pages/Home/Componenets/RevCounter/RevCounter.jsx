import React from 'react';
import './RevCounter.css';

const RevCounter = () => {
  const stats = [
    { id: 1, value: "9", suffix: "M+", label: "Total Invest" },
    { id: 2, value: "10", suffix: "M+", label: "Total Deposit" },
    { id: 3, value: "9", suffix: "M+", label: "Total Withdraw" },
    { id: 4, value: "10", suffix: "M+", label: "Total Users" },
  ];

  const bgUrl = "https://script.viserlab.com/revptc/assets/images/frontend/counter/6381eabfdf9891669458623.jpg";

  return (
    <section 
      className="rev-stat-section" 
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="rev-stat-container">
        <div className="rev-stat-row">
          {stats.map((stat) => (
            <div key={stat.id} className="rev-stat-col">
              <div className="rev-stat-item">
                <div className="rev-stat-number-wrap">
                  <h3 className="rev-stat-value">{stat.value}</h3>
                  <h3 className="rev-stat-value">{stat.suffix}</h3>
                </div>
                <span className="rev-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RevCounter;