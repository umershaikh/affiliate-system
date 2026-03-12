import React, { useState, useEffect } from 'react';
import apiFetch from '../../../../utils/api';
import { formatCurrencyPKR } from '../../../../utils/format';
import './RewardList.css';

const RewardList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [claimMsg, setClaimMsg] = useState(null);

  const fetchRewards = () => {
    apiFetch('/api/rewards')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(fetchRewards, []);

  const handleClaim = async (levelId) => {
    setClaimingId(levelId);
    setClaimMsg(null);
    try {
      const res = await apiFetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: levelId }),
      });
      const d = await res.json();
      setClaimMsg({ error: !d.success, text: d.message });
      if (d.success) fetchRewards();
    } catch {
      setClaimMsg({ error: true, text: 'Server error.' });
    }
    setClaimingId(null);
  };

  if (loading) {
    return (
      <div className="rl-page">
        <div className="rl-loader"><div className="rl-spinner" /><span>Loading rewards...</span></div>
      </div>
    );
  }

  if (!data) {
    return <div className="rl-page"><div className="rl-empty">Failed to load rewards.</div></div>;
  }

  const { levels, teamSize, pinsUsed, currentRank, nextLevel } = data;

  return (
    <div className="rl-page">
      {/* Header */}
      <div className="rl-header">
        <div>
          <h1 className="rl-header__title">Alpha Bonuses</h1>
          <p className="rl-header__sub">Build your team, unlock rewards, earn one-time bonuses</p>
        </div>
      </div>

      {/* Guide */}
      <div className="rl-guide">
        <div className="rl-guide__icon">📖</div>
        <div className="rl-guide__content">
          <h3>How Rewards Work</h3>
          <ol>
            <li><strong>Build your team</strong> — Use E-Pins to add members to your binary tree</li>
            <li><strong>Meet the requirement</strong> — Each level requires a certain number of team members</li>
            <li><strong>Unlock the level</strong> — Click the "Unlock" button when you're eligible</li>
            <li><strong>Get instant bonus</strong> — Once unlocked, the reward amount is credited <strong>one time</strong> to your account immediately</li>
          </ol>
          <p className="rl-guide__note">💡 You can claim multiple levels! Each level gives a one-time bonus when you complete its requirement.</p>
        </div>
      </div>

      {/* Progress Hero */}
      <div className="rl-hero">
        <div className="rl-hero__rank">
          <div className="rl-hero__rank-icon">🏆</div>
          <div>
            <div className="rl-hero__rank-label">Current Rank</div>
            <div className="rl-hero__rank-name">{currentRank}</div>
          </div>
        </div>
        <div className="rl-hero__stats">
          <div className="rl-hero__stat">
            <span className="rl-hero__stat-num">{teamSize}</span>
            <span className="rl-hero__stat-label">Team Members</span>
          </div>
          <div className="rl-hero__stat">
            <span className="rl-hero__stat-num">{pinsUsed}</span>
            <span className="rl-hero__stat-label">Pins Used</span>
          </div>
          <div className="rl-hero__stat">
            <span className="rl-hero__stat-num">{levels.filter(l => l.claimed).length}</span>
            <span className="rl-hero__stat-label">Levels Claimed</span>
          </div>
        </div>
        {nextLevel && (
          <div className="rl-hero__next">
            <div className="rl-hero__next-text">
              Next: <strong>{nextLevel.rank}</strong> — need {nextLevel.required} team members
            </div>
            <div className="rl-hero__bar-wrap">
              <div
                className="rl-hero__bar-fill"
                style={{ width: `${Math.min((teamSize / nextLevel.required) * 100, 100)}%` }}
              />
            </div>
            <div className="rl-hero__bar-label">
              {teamSize} / {nextLevel.required} members
            </div>
          </div>
        )}
      </div>

      {/* Claim message */}
      {claimMsg && (
        <div className={`rl-claim-msg ${claimMsg.error ? 'rl-claim-msg--error' : 'rl-claim-msg--success'}`}>
          {claimMsg.text}
        </div>
      )}

      {/* Level Cards */}
      <div className="rl-levels">
        {levels.map((level, i) => (
          <div
            key={level.id || i}
            className={`rl-level ${level.claimed ? 'rl-level--claimed' : level.unlocked ? 'rl-level--unlocked' : 'rl-level--locked'}`}
          >
            <div className="rl-level__num">{i + 1}</div>
            <div className="rl-level__body">
              <div className="rl-level__top">
                <h3 className="rl-level__rank">{level.rank}</h3>
                {level.claimed ? (
                  <span className="rl-level__badge rl-level__badge--claimed">✓ Claimed</span>
                ) : level.canClaim ? (
                  <button
                    className="rl-level__unlock-btn"
                    onClick={() => handleClaim(level.id)}
                    disabled={claimingId === level.id}
                  >
                    {claimingId === level.id ? '⏳ Claiming...' : '🔓 Unlock'}
                  </button>
                ) : level.unlocked ? (
                  <span className="rl-level__badge rl-level__badge--unlocked">✓ Eligible</span>
                ) : (
                  <span className="rl-level__badge rl-level__badge--locked">🔒 Locked</span>
                )}
              </div>
              <div className="rl-level__details">
                <div className="rl-level__detail">
                  <span className="rl-level__detail-label">Team Required</span>
                  <span className="rl-level__detail-value">{level.team}</span>
                </div>
                <div className="rl-level__detail">
                  <span className="rl-level__detail-label">Bonus Amount</span>
                  <span className="rl-level__detail-value rl-level__reward">Rs. {formatCurrencyPKR(level.reward)}</span>
                </div>
                {level.claimed && level.claimInfo && (
                  <>
                    <div className="rl-level__detail">
                      <span className="rl-level__detail-label">Claimed On</span>
                      <span className="rl-level__detail-value">{level.claimInfo.claimedAt}</span>
                    </div>
                    <div className="rl-level__detail">
                      <span className="rl-level__detail-label">Bonus Received</span>
                      <span className="rl-level__detail-value rl-level__reward">Rs. {formatCurrencyPKR(level.claimInfo.totalEarned)}</span>
                    </div>
                  </>
                )}
              </div>
              {!level.unlocked && (
                <div className="rl-level__progress">
                  <div className="rl-level__progress-bar">
                    <div
                      className="rl-level__progress-fill"
                      style={{ width: `${Math.min((teamSize / (level.required || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="rl-level__progress-text">
                    {teamSize}/{level.required} members
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardList;