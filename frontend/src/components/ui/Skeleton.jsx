import React from 'react';

const shimmerStyle = {
  background: 'linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-surface-2) 50%, var(--bg-surface) 75%)',
  backgroundSize: '400px 100%',
  animation: 'shimmer 1.4s infinite',
  borderRadius: 'var(--radius-sm)',
};

const Skeleton = ({ width = '100%', height = 20, style = {}, rounded = false }) => (
  <div style={{
    ...shimmerStyle,
    width, height,
    borderRadius: rounded ? 99 : 'var(--radius-sm)',
    ...style,
  }} />
);

export const SkeletonCard = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}>
    <Skeleton width="60%" height={18} />
    <Skeleton height={14} />
    <Skeleton height={14} width="80%" />
  </div>
);

export default Skeleton;
