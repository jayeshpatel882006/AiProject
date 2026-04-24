import React from 'react';

const styles = {
  base: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', fontWeight: 600, borderRadius: 'var(--radius-sm)',
    border: 'none', cursor: 'pointer', transition: 'all var(--transition)',
    fontFamily: 'inherit', textDecoration: 'none',
  },
  sizes: {
    sm: { padding: '6px 14px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '13px 28px', fontSize: '15px' },
  },
  variants: {
    primary: {
      background: 'var(--accent-gradient)',
      color: '#fff',
      boxShadow: '0 2px 12px rgba(99,102,241,0.3)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)',
    },
    danger: {
      background: 'var(--danger-bg)',
      color: 'var(--danger)',
      border: '1px solid rgba(239,68,68,0.3)',
    },
    subtle: {
      background: 'var(--accent-gradient-soft)',
      color: 'var(--accent-primary)',
    },
  },
};

const Button = ({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, fullWidth = false,
  onClick, type = 'button', style = {}, ...rest
}) => {
  const combined = {
    ...styles.base,
    ...styles.sizes[size],
    ...styles.variants[variant],
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    ...style,
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} style={combined} {...rest}>
      {loading && (
        <span style={{
          width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', display: 'inline-block',
        }} />
      )}
      {children}
    </button>
  );
};

export default Button;
