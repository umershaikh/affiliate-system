import React from 'react';
import './ViewPinCode.css';

const ViewPinCode = () => {
  return (
    <div className="vpc-container">
      {/* Breadcrumb Section */}
      <nav className="vpc-breadcrumb">
        <span className="vpc-home-icon">🏠</span>
        <span className="vpc-separator">/</span>
        <span className="vpc-breadcrumb-current">View Pin-Code</span>
      </nav>

      <h1 className="vpc-page-title">View Pin-Code</h1>

      {/* Main Card */}
      <div className="vpc-card">
        <div className="vpc-card-header">
          Pins List
        </div>
        <div className="vpc-card-body">
          <p className="vpc-no-data">No data available</p>
        </div>
      </div>
    </div>
  );
};

export default ViewPinCode;