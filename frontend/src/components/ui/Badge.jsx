import React from 'react';
import { TYPE_COLORS } from '../../utils/constants';
import { capitalize } from '../../utils/formatters';

const Badge = ({ type, label, style = {} }) => {
  const colors = TYPE_COLORS[type] || { bg: 'var(--bg-input)', color: 'var(--text-muted)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99, fontSize: '12px', fontWeight: 600,
      background: colors.bg, color: colors.color,
      ...style,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: colors.color,
      }} />
      {label || capitalize(type)}
    </span>
  );
};

export default Badge;
