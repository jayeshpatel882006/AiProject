import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/aiService';
import { useToast } from '../components/ui/Toast';
import StatCard from '../components/dashboard/StatCard';
import UsageChart from '../components/dashboard/UsageChart';
import TypeChart from '../components/dashboard/TypeChart';
import HistoryTable from '../components/dashboard/HistoryTable';
import { getErrorMessage } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0, chat: 0, summarize: 0, generate: 0,
    dailyUsage: []
  });
  const [records, setRecords] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await getHistory({ limit: 10 });
        const allRecords = data.data.records;
        setRecords(allRecords);

        // Process stats locally from last 50 records for demo (normally would be a dedicated stats endpoint)
        const { data: fullHistory } = await getHistory({ limit: 50 });
        const history = fullHistory.data.records;

        const chat = history.filter(r => r.type === 'chat').length;
        const summarize = history.filter(r => r.type === 'summarize').length;
        const generate = history.filter(r => r.type === 'generate').length;

        // Mock daily usage for last 7 days based on data
        // const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const count = history.filter(r => new Date(r.createdAt).toDateString() === d.toDateString()).length;
          return { date: dateStr, count };
        });

        setStats({
          total: data.data.pagination.total,
          chat, summarize, generate,
          dailyUsage: last7Days
        });
      } catch (err) {
        toast(getErrorMessage(err), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        <StatCard label="Total Requests" value={stats.total} icon="📊" color="#6366f1" loading={loading} />
        <StatCard label="Chat Sessions" value={stats.chat} icon="💬" color="#8b5cf6" loading={loading} />
        <StatCard label="Summaries" value={stats.summarize} icon="📝" color="#06b6d4" loading={loading} />
        <StatCard label="Generations" value={stats.generate} icon="✨" color="#f59e0b" loading={loading} />
      </div>

      {/* Charts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        <UsageChart data={stats.dailyUsage} />
        <TypeChart chat={stats.chat} summarize={stats.summarize} generate={stats.generate} />
      </div>

      {/* Recent History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Recent Activity
        </h2>
        <div style={{ 
          background: 'var(--bg-surface)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          <HistoryTable records={records} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
