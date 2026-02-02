import React from 'react';
import './WithdrawHistory.css';

const WithdrawHistory = () => {
  // Generic dummy data for development
  const dummyData = [
    { id: 1, email: "user.alpha@example.com", amount: "1,200", status: "SUCCESS", updatedAt: "2025-06-19 09:18:39" },
    { id: 2, email: "user.beta@example.com", amount: "850", status: "SUCCESS", updatedAt: "2025-06-20 10:22:15" },
    { id: 3, email: "user.gamma@example.com", amount: "430", status: "SUCCESS", updatedAt: "2025-06-21 14:05:01" },
    { id: 4, email: "user.delta@example.com", amount: "2,100", status: "SUCCESS", updatedAt: "2025-06-22 16:30:22" },
    { id: 5, email: "user.epsilon@example.com", amount: "95", status: "SUCCESS", updatedAt: "2025-06-23 08:12:44" },
  ];

  return (
    <div className="wh-wrapper">
      <div className="wh-breadcrumb-nav">
        <span className="wh-icon-home">🏠</span> / Withdrawal History
      </div>
      <h2 className="wh-page-heading">Withdrawal History</h2>

      <div className="wh-data-card">
        <div className="wh-data-header">
          Withdraws List
        </div>
        
        <div className="wh-table-container">
          <table className="wh-custom-table">
            <thead>
              <tr>
                <th>ID <span className="wh-sort-arrows">⇅</span></th>
                <th>EMAIL <span className="wh-sort-arrows">⇅</span></th>
                <th>AMOUNT <span className="wh-sort-arrows">⇅</span></th>
                <th>STATUS <span className="wh-sort-arrows">⇅</span></th>
                <th>UPDATED AT <span className="wh-sort-arrows">⇅</span></th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.email}</td>
                  <td>{row.amount}</td>
                  <td>
                    <span className="wh-text-success">{row.status}</span>
                  </td>
                  <td>{row.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawHistory;