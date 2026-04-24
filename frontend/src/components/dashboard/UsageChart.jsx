import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import Card from '../ui/Card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const UsageChart = ({ data = [] }) => {
  const labels = data.map(d => d.date);
  const values = data.map(d => d.count);

  const chartData = {
    labels,
    datasets: [{
      label: 'AI Requests',
      data: values,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.12)',
      borderWidth: 2.5,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'var(--bg-surface)',
        titleColor: '#f1f5f9',
        bodyColor: '#64748b',
        borderColor: 'rgba(99,102,241,0.4)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  return (
    <Card style={{ flex: 2, minWidth: 280 }}>
      <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: 'var(--text-primary)' }}>
        📈 Daily Usage — Last 7 Days
      </p>
      <div style={{ height: 220 }}>
        {data.length > 0
          ? <Line data={chartData} options={options} />
          : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No data yet. Start using AI features!</div>
        }
      </div>
    </Card>
  );
};

export default UsageChart;
