import React, { useState } from 'react';
import { generate } from '../services/aiService';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../services/api';
import { CONTENT_TYPES, TONES } from '../utils/constants';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ReactMarkdown from 'react-markdown';

const Generator = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast('Please enter a topic or description.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { data } = await generate({ topic, contentType: type, tone });
      setResult(data.data);
      toast('Content generated successfully!', 'success');
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      toast('Copied to clipboard!', 'success');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Left: Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
              1. What should I write about?
            </h3>
            <Input
              type="textarea"
              placeholder="e.g. Benefits of daily meditation for stress reduction..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </Card>

          <Card style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
              2. Content Type & Tone
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Type:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                  {CONTENT_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      disabled={loading}
                      style={{
                        padding: '10px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'center',
                        background: type === t.value ? 'var(--accent-gradient-soft)' : 'transparent',
                        color: type === t.value ? 'var(--accent-primary)' : 'var(--text-muted)',
                        borderColor: type === t.value ? 'var(--accent-primary)' : 'var(--border)',
                        transition: 'all var(--transition)'
                      }}
                    >
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{t.icon}</div>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Tone:</p>
                <select 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)', color: 'var(--text-primary)',
                    border: '1px solid var(--border)', outline: 'none'
                  }}
                >
                  {TONES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <Button onClick={handleGenerate} loading={loading} fullWidth style={{ marginTop: '8px' }}>
                🚀 Generate Content
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Output */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {result ? (
            <Card glass style={{ padding: '32px', height: '100%', minHeight: '500px', border: '1px solid var(--accent-primary)' }} className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  Generated Content
                </h3>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  📋 Copy Content
                </Button>
              </div>
              <div style={{ 
                fontSize: '15px', lineHeight: 1.7, color: 'var(--text-primary)',
                background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: 'var(--radius-md)',
                height: 'calc(100% - 60px)', overflowY: 'auto'
              }}>
                <ReactMarkdown>{result.content}</ReactMarkdown>
              </div>
            </Card>
          ) : (
            <div style={{ 
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)',
              padding: '40px', textAlign: 'center', color: 'var(--text-muted)'
            }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
                <h3>Ready to Create?</h3>
                <p>Choose your options and click generate.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
