import React, { useState } from 'react';
import './TransactionTable.css';

const TransactionTable = () => {
  const [activeTab, setActiveTab] = useState('deposit');

  const deposits = [
    { name: 'Ashish Tyagi', date: '30 December, 2025', amount: '$12.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
    { name: 'Super Admin', date: '05 October, 2025', amount: '$100.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/user/profile/666d82018c62c1718452737.jpg' },
    { name: 'Muhammad Ahmed', date: '13 September, 2025', amount: '$20.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
    { name: 'Corrie Lee', date: '31 August, 2025', amount: '$5,090.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
    { name: 'Onhj Vbb', date: '04 August, 2025', amount: '$100.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
    { name: 'Corrie Lee', date: '16 July, 2025', amount: '$598.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
    { name: 'Adigun Tolulope', date: '12 July, 2025', amount: '$7,000.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
    { name: 'Adigun Tolulope', date: '12 July, 2025', amount: '$1,200.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
    { name: 'Wunmi Adebola', date: '18 March, 2025', amount: '$2,000.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/user/profile/67da39da6b4a01742354906.png' },
    { name: 'MOKIAWA Jovette', date: '04 March, 2025', amount: '$2,000.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
  ];

  const withdraws = [
    { name: 'morsalin jannat', date: '25 February, 2023', amount: '$10.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/avatar.png' },
    { name: 'test test', date: '04 April, 2022', amount: '$100.00 USD', img: 'https://script.viserlab.com/revptc/assets/images/user/profile/63f9b184e9ae41677308292.jpg' },
  ];

  const currentData = activeTab === 'deposit' ? deposits : withdraws;

  return (
    <section className="rtx-transaction-section">
      <div className="rtx-container">
        <div className="rtx-section-header">
          <span className="rtx-sub-title">TRANSACTIONS</span>
          <h2 className="rtx-main-title">Our Latest Deposits and Withdraws</h2>
        </div>

        <div className="rtx-tab-menu">
          <button 
            className={`rtx-tab-btn ${activeTab === 'deposit' ? 'rtx-active' : ''}`}
            onClick={() => setActiveTab('deposit')}
          >
            LATEST DEPOSITS
          </button>
          <button 
            className={`rtx-tab-btn ${activeTab === 'withdraw' ? 'rtx-active' : ''}`}
            onClick={() => setActiveTab('withdraw')}
          >
            LATEST WITHDRAWS
          </button>
        </div>

        <div className="rtx-table-wrapper">
          <table className="rtx-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="rtx-author">
                      <img src={item.img} alt="user" className="rtx-avatar" />
                      <span className="rtx-name">{item.name}</span>
                    </div>
                  </td>
                  <td>{item.date}</td>
                  <td className="rtx-amount">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TransactionTable;