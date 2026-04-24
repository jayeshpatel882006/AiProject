import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Card from '../ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

const TypeChart = ({ chat = 0, summarize = 0, generate = 0 }) => {
  const total = chat + summarize + generate;

  const chartData = {
    labels: ['Chat', 'Summarize', 'Generate'],
    datasets: [{
      data: [chat, summarize, generate],
      backgroundColor: ['rgba(99,102,241,0.85)', 'rgba(6,182,212,0.85)', 'rgba(139,92,246,0.85)'],
      borderColor: ['#6366f1', '#06b6d4', '#8b5cf6'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false, cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'var(--bg-surface)',
        titleColor: '#f1f5f9', bodyColor: '#64748b',
        borderColor: 'rgba(99,102,241,0.4)', borderWidth: 1, padding: 10,
      },
    },
  };

  const items = [
    { label: 'Chat',      value: chat,      color: '#6366f1' },
    { label: 'Summarize', value: summarize, color: '#06b6d4' },
    { label: 'Generate',  value: generate,  color: '#8b5cf6' },
  ];

  return (
    <Card style={{ flex: 1, minWidth: 220 }}>
      <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: 'var(--text-primary)' }}>
        🍩 Requests by Type
      </p>
      <div style={{ height: 160, position: 'relative' }}>
        {total > 0 ? (
          <>
            <Doughnut data={chartData} options={options} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{total}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total</div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 14 }}>No data yet</div>
        )}
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(({ label, value, color }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {label}
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TypeChart;
