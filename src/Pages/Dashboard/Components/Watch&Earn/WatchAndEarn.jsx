import React from 'react'

function WatchAndEarn() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', textAlign: 'center', color: '#64748b' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📺</div>
      <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>No subscription purchased yet...</h2>
      <p>Please purchase one to watch ads.</p>
    </div>
  )
}

export default WatchAndEarn