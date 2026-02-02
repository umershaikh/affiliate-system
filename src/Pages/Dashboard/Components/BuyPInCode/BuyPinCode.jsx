import React from 'react';
import './BuyPinCode.css';

const BuyPinCode = () => {
  return (
    <div className="bpc-main-wrapper">
      {/* Top Header Section */}
      <nav className="bpc-nav-header">
        <div className="bpc-breadcrumb">
          <span className="bpc-icon-home">🏠</span>
          <span className="bpc-sep">/</span>
          <span className="bpc-text-muted">Request E-Pin</span>
        </div>
        <h2 className="bpc-page-heading">Request E-Pin</h2>
      </nav>

      <div className="bpc-content-body">
        {/* Account Info Card */}
        <div className="bpc-card bpc-info-card">
          <h3 className="bpc-card-title">Request a PIN for Your Account</h3>
          <p className="bpc-urdu-desc" dir="rtl">
            اپنی پن خریدنے کی ادائیگی یہاں اس نمبر پر بھیجنی ہے۔
          </p>
          <div className="bpc-account-details">
            <p><strong>Account Title:</strong> John Doe</p>
            <p><strong>Bank:</strong> DummyBank</p>
            <p><strong>Account Number:</strong> 0123456789</p>
          </div>
        </div>

        {/* PIN Request Form Card */}
        <div className="bpc-card bpc-request-card">
          <h3 className="bpc-card-title">PIN Request</h3>
          <p className="bpc-urdu-warning" dir="rtl">
            یاد رکھیں جعلی ٹرانزیکشن آئی ڈی یا جعلی پن ریکوسٹ لگانے سے آپکی سروس معطل ہو جائے گی۔ تسلی سے درست معلومات درج کریں تاکہ دشواری کا سامنا نہ کرنا پڑے۔
          </p>

          <form className="bpc-form-container" onSubmit={(e) => e.preventDefault()}>
            <div className="bpc-field">
              <label className="bpc-label">Account number</label>
              <div className="bpc-input-group">
                <span className="bpc-input-icon">👤</span>
                <input type="text" className="bpc-input-control" />
              </div>
            </div>

            <div className="bpc-field">
              <label className="bpc-label">Trx ID</label>
              <div className="bpc-input-group">
                <span className="bpc-input-icon">📋</span>
                <input type="text" className="bpc-input-control" />
              </div>
            </div>

            <div className="bpc-field">
              <label className="bpc-label">Amount</label>
              <div className="bpc-input-group">
                <span className="bpc-input-icon">$</span>
                <input type="number" className="bpc-input-control" />
              </div>
            </div>

            <div className="bpc-field">
              <label className="bpc-label">Payment Screenshot</label>
              <div className="bpc-file-group">
                <span className="bpc-input-icon">📄</span>
                <input type="file" className="bpc-file-input" />
              </div>
            </div>

            <button type="submit" className="bpc-btn-submit">
              REQUEST PIN
            </button>
          </form>
        </div>

        {/* Bottom Table Section */}
        <div className="bpc-table-container">
          <div className="bpc-table-responsive">
            <table className="bpc-data-table">
              <thead>
                <tr>
                  <th>ID <span className="bpc-sort-icon">⇅</span></th>
                  <th>ACCOUNT NUMBER <span className="bpc-sort-icon">⇅</span></th>
                  <th>TRX ID <span className="bpc-sort-icon">⇅</span></th>
                  <th>USER EMAIL <span className="bpc-sort-icon">⇅</span></th>
                  <th>AMOUNT <span className="bpc-sort-icon">⇅</span></th>
                  <th>SCREENSHOT <span className="bpc-sort-icon">⇅</span></th>
                  <th>STATUS <span className="bpc-sort-icon">⇅</span></th>
                </tr>
              </thead>
              <tbody>
                {/* Dummy Row for visual representation */}
                <tr>
                  <td colSpan="7" className="bpc-no-data">No data available in table</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPinCode;