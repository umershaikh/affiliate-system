import React from 'react';
import './RewardList.css';

const RewardList = () => {
  // Array of data extracted from the provided image
  const rewardItems = [
    { team: "10/10", rank: "Level 1", reward: "1,000", status: "Non-active" },
    { team: "25/25", rank: "Level 2", reward: "2,000", status: "Non-active" },
    { team: "50/50", rank: "Level 3", reward: "3,000", status: "Non-active" },
    { team: "100/100", rank: "Level 4", reward: "5,000", status: "Non-active" },
    { team: "250/250", rank: "Level 5", reward: "10,000", status: "Non-active" },
    { team: "500/500", rank: "Level 6", reward: "30,000", status: "Non-active" },
    { team: "1000/1000", rank: "Level 7", reward: "50,000", status: "Non-active" },
    { team: "2.5k / 2.5k", rank: "Level 8", reward: "125,000", status: "Non-active" },
    { team: "5k / 5k", rank: "Level 9", reward: "250,000", status: "Non-active" },
    { team: "10k / 10k", rank: "Level 10", reward: "500,000", status: "Non-active" },
    { team: "20k / 20k", rank: "Level 11", reward: "800,000", status: "Non-active" },
    { team: "35k / 35k", rank: "Level 12", reward: "1,000,000", status: "Non-active" },
    { team: "50k / 50k", rank: "Level 13", reward: "1,500,000", status: "Non-active" },
  ];

  return (
    <div className="rl-uniq-wrapper">
      <div className="rl-uniq-breadcrumb">
        <span>🏠</span> / Reward List
      </div>
      
      <h1 className="rl-uniq-header-text">Reward List</h1>

      <div className="rl-uniq-reward-card">
        <div className="rl-uniq-blue-banner">
          Ranks & Rewards
        </div>

        <div className="rl-uniq-responsive-table">
          <table className="rl-uniq-table-main">
            <thead>
              <tr>
                <th>Team <span className="rl-uniq-sort-symbol">⇅</span></th>
                <th>Rank <span className="rl-uniq-sort-symbol">⇅</span></th>
                <th>Reward <span className="rl-uniq-sort-symbol">⇅</span></th>
                <th style={{ textAlign: 'right' }}>Status <span className="rl-uniq-sort-symbol">⇅</span></th>
              </tr>
            </thead>
            <tbody>
              {rewardItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.team}</td>
                  <td>{item.rank}</td>
                  <td>{item.reward}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="rl-uniq-status-pill">{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rl-uniq-pagination-bar">
          <button className="rl-uniq-page-circle">‹</button>
          <button className="rl-uniq-page-circle rl-uniq-is-active">1</button>
          <button className="rl-uniq-page-circle">2</button>
        </div>
      </div>
    </div>
  );
};

export default RewardList;