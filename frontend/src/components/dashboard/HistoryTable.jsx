import React from 'react';
import Badge from '../ui/Badge';
import { truncate, formatDateTime } from '../../utils/formatters';
import Skeleton from '../ui/Skeleton';

const HistoryTable = ({ records = [], loading }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[...Array(5)].map((_, i) => <Skeleton key={i} height={52} />)}
      </div>
    );
  }

  if (!records.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '40px 20px',
        color: 'var(--text-muted)', fontSize: 14,
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🤖</div>
        No AI history yet. Start chatting, summarizing, or generating content!
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Type', 'Prompt', 'Response Preview', 'Date'].map(h => (
              <th key={h} style={{
                padding: '10px 14px', textAlign: 'left',
                color: 'var(--text-muted)', fontWeight: 600, fontSize: 12,
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r._id} style={{
              borderBottom: '1px solid var(--border)',
              background: i % 2 === 0 ? 'transparent' : 'var(--bg-glass)',
              transition: 'background var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-gradient-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--bg-glass)'}
            >
              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                <Badge type={r.type} />
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--text-primary)', maxWidth: 200 }}>
                {truncate(r.prompt, 60)}
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--text-muted)', maxWidth: 220 }}>
                {truncate(r.response, 70)}
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: 12 }}>
                {formatDateTime(r.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
