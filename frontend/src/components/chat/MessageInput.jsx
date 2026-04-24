import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';

const MessageInput = ({ onSend, loading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (text.trim() && !loading) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <div style={{
      padding: '20px',
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={loading}
          style={{
            flex: 1,
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            resize: 'none',
            maxHeight: '200px',
            minHeight: '48px',
            transition: 'border-color var(--transition)',
          }}
        />
        <Button
          onClick={handleSend}
          disabled={!text.trim() || loading}
          loading={loading}
          style={{
            height: '48px',
            width: '48px',
            borderRadius: '50%',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '20px' }}>⚡</span>
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
