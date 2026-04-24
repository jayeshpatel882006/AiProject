import React, { useState } from 'react';
import { summarize } from '../services/aiService';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../services/api';
import { SUMMARY_STYLES } from '../utils/constants';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ReactMarkdown from 'react-markdown';

const Summarizer = () => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('concise');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleSummarize = async () => {
    if (text.trim().length < 50) {
      toast('Please enter at least 50 characters to summarize.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { data } = await summarize({ text, style });
      setResult(data.data);
      toast('Text summarized successfully!', 'success');
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.summary);
      toast('Copied to clipboard!', 'success');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
          Enter Text to Summarize
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            type="textarea"
            placeholder="Paste your long article, document, or notes here (min 50 chars)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            rows={10}
            style={{ fontSize: '15px' }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Summary Style:</span>
            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              {SUMMARY_STYLES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  disabled={loading}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    background: style === s.value ? 'var(--bg-surface)' : 'transparent',
                    color: style === s.value ? 'var(--accent-primary)' : 'var(--text-muted)',
                    boxShadow: style === s.value ? 'var(--shadow-sm)' : 'none',
                    transition: 'all var(--transition)'
                  }}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            
            <div style={{ flex: 1 }} />
            
            <Button onClick={handleSummarize} loading={loading} disabled={!text.trim() || loading} style={{ minWidth: '160px' }}>
              ✨ Summarize Now
            </Button>
          </div>
        </div>
      </Card>

      {result && (
        <Card glass style={{ padding: '32px', border: '1px solid var(--accent-primary)' }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-primary)' }}>
              Summary Result
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ fontSize: '12px', background: 'var(--bg-input)', padding: '4px 10px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                {result.usage.totalTokens} tokens
              </div>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                📋 Copy
              </Button>
            </div>
          </div>
          <div style={{ 
            fontSize: '16px', lineHeight: 1.6, color: 'var(--text-primary)',
            background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-md)'
          }}>
            <ReactMarkdown>{result.summary}</ReactMarkdown>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Summarizer;
