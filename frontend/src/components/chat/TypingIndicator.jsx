import React from 'react';

const TypingIndicator = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '12px 16px',
      borderRadius: '16px 16px 16px 4px',
      background: 'var(--bg-glass)',
      border: '1px solid var(--border)',
      width: 'fit-content',
      marginBottom: '20px',
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        background: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'pulse-dot 1.2s infinite ease-in-out',
      }} />
      <div style={{
        width: '6px',
        height: '6px',
        background: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'pulse-dot 1.2s infinite ease-in-out 0.2s',
      }} />
      <div style={{
        width: '6px',
        height: '6px',
        background: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'pulse-dot 1.2s infinite ease-in-out 0.4s',
      }} />
    </div>
  );
};

export default TypingIndicator;
