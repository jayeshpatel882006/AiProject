import React, { useState } from 'react';

const Input = ({
  label, error, hint, type = 'text', icon, rightElement,
  value, onChange, placeholder, disabled, required, name,
  rows, style = {}, ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const isTextarea = type === 'textarea';
  const inputType  = type === 'password' ? (showPwd ? 'text' : 'password') : type;

  const containerStyle = {
    display: 'flex', flexDirection: 'column', gap: '6px', width: '100%',
  };
  const labelStyle = {
    fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)',
  };
  const wrapperStyle = {
    position: 'relative', display: 'flex', alignItems: isTextarea ? 'flex-start' : 'center',
  };
  const baseInput = {
    width: '100%', background: 'var(--bg-input)', color: 'var(--text-primary)',
    border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent-primary)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'inherit',
    fontSize: '14px', padding: icon ? '10px 12px 10px 38px' : '10px 14px',
    paddingRight: (type === 'password' || rightElement) ? '44px' : '14px',
    transition: 'border-color var(--transition), box-shadow var(--transition)',
    boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
    resize: isTextarea ? 'vertical' : 'none', minHeight: isTextarea ? '120px' : 'auto',
    ...style,
  };
  const iconStyle = {
    position: 'absolute', left: 12, top: isTextarea ? 12 : '50%',
    transform: isTextarea ? 'none' : 'translateY(-50%)',
    color: focused ? 'var(--accent-primary)' : 'var(--text-muted)',
    fontSize: '16px', pointerEvents: 'none', transition: 'color var(--transition)',
  };

  const sharedEvents = {
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={wrapperStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        {isTextarea ? (
          <textarea
            name={name} value={value} onChange={onChange}
            placeholder={placeholder} disabled={disabled}
            rows={rows || 5} style={baseInput} {...sharedEvents} {...rest}
          />
        ) : (
          <input
            type={inputType} name={name} value={value} onChange={onChange}
            placeholder={placeholder} disabled={disabled} required={required}
            style={baseInput} {...sharedEvents} {...rest}
          />
        )}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            style={{
              position: 'absolute', right: 12, background: 'none', border: 'none',
              color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
          >
            {showPwd ? '🙈' : '👁️'}
          </button>
        )}
        {rightElement && !type.includes('password') && (
          <div style={{ position: 'absolute', right: 12 }}>{rightElement}</div>
        )}
      </div>
      {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>⚠ {error}</span>}
      {hint && !error && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
};

export default Input;
