import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatTime } from '../../utils/formatters';

const MessageBubble = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '20px',
      gap: '4px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '2px',
        padding: '0 4px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
          {isUser ? 'You' : 'NexusAI'}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-placeholder)' }}>
          {formatTime(timestamp || new Date())}
        </span>
      </div>
      <div style={{
        maxWidth: '85%',
        padding: '12px 16px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? 'var(--accent-gradient)' : 'var(--bg-glass)',
        color: isUser ? '#fff' : 'var(--text-primary)',
        border: isUser ? 'none' : '1px solid var(--border)',
        boxShadow: isUser ? 'var(--shadow-accent)' : 'var(--shadow-sm)',
        fontSize: '14px',
        lineHeight: '1.5',
      }}>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props} style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: '4px' }}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MessageBubble;
