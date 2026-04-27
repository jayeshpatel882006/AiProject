import React, { useEffect, useRef } from 'react';
import Card from '../ui/Card';

const StatCard = ({ label, value, icon, color, suffix = '', loading }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (loading || !ref.current) return;
    const target = Number(value) || 0;
    // let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) ref.current.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, loading, suffix]);

  return (
    <Card hover style={{ flex: 1, minWidth: 160 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8 }}>{label}</p>
          {loading ? (
            <div style={{
              width: 60, height: 28, background: 'var(--bg-input)',
              borderRadius: 6, animation: 'shimmer 1.4s infinite',
            }} />
          ) : (
            <p ref={ref} style={{
              fontSize: 30, fontWeight: 800, color: 'var(--text-primary)',
              letterSpacing: '-1px', lineHeight: 1,
            }}>0</p>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-sm)',
          background: `${color}22`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 22,
          flexShrink: 0,
        }}>{icon}</div>
      </div>
      <div style={{
        marginTop: 14, height: 3, borderRadius: 99,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
    </Card>
  );
};

export default StatCard;
