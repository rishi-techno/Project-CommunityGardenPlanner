import React from 'react';

const Loader = ({ text = 'Loading...', fullPage = false }) => {
  const style = fullPage ? {
    position: 'fixed', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'rgba(250,247,242,0.85)',
    zIndex: 999,
    backdropFilter: 'blur(4px)',
  } : {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  };

  return (
    <div style={style}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid var(--green-100)',
        borderTopColor: 'var(--green-700)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;
