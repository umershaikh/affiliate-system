import React from 'react';
import './HomeWorkProcess.css';

const HomeWorkProcess = () => {
  const steps = [
    { id: 1, title: 'Create An Account', color: '#16D5CA', class: 'hwp-step-teal' },
    { id: 2, title: 'Choose Plan', color: '#372B4D', class: 'hwp-step-navy' },
    { id: 3, title: 'Invite More People', color: '#B036F1', class: 'hwp-step-purple' },
    { id: 4, title: 'Get Commission', color: '#FF764C', class: 'hwp-step-orange' },
  ];

  return (
    <section className="hwp-main-wrapper">
      <div className="hwp-container">
        
        {/* Header Section */}
        <div className="hwp-header-block">
          <span className="hwp-upper-label">HOW WE WORK</span>
          <h2 className="hwp-main-heading">Our Work Process In 4 Steps</h2>
          <div className="hwp-divider-area">
            <div className="hwp-horizontal-line"></div>

          </div>
        </div>

        {/* Workflow Steps */}
        <div className="hwp-steps-flex">
          {steps.map((step, index) => (
            <div key={step.id} className="hwp-card-item">
              <div className="hwp-visual-container">
                {/* Glow & Circle */}
                <div className={`hwp-circle-base ${step.class}`}>
                  {step.id}
                </div>
                
                {/* Arrow Connector (Hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hwp-svg-arrow">
                    <svg width="100" height="40" viewBox="0 0 100 40">
                      <path 
                        d="M10,20 Q50,0 90,20" 
                        stroke="#D1D5DB" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeDasharray="4 2"
                      />
                      <path d="M85,15 L92,20 L85,25" stroke="#D1D5DB" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                )}
              </div>
              <h5 className="hwp-step-label">{step.title}</h5>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeWorkProcess;