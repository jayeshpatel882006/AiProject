import React from 'react';

const Card = ({ children, style = {}, glass = false, hover = false, padding = '24px', onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  const base = {
    background: glass ? 'var(--bg-glass)' : 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding,
    backdropFilter: glass ? 'blur(16px)' : 'none',
    WebkitBackdropFilter: glass ? 'blur(16px)' : 'none',
    boxShadow: hovered && hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
    transform: hovered && hover ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all 0.25s ease',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      style={base}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};

export default Card;
