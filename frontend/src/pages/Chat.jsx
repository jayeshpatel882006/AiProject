import React, { useState, useRef, useEffect } from 'react';
import { sendChat, getHistory } from '../services/aiService';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../services/api';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import TypingIndicator from '../components/chat/TypingIndicator';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data } = await getHistory({ type: 'chat', limit: 5 });
        // Reverse history to show oldest first in chat flow
        const historyRecords = data.data.records.reverse().map(r => [
          { role: 'user', content: r.prompt, timestamp: r.createdAt },
          { role: 'assistant', content: r.response, timestamp: r.createdAt }
        ]).flat();
        setMessages(historyRecords);
      } catch (err) {
        // Silently fail for history
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (content) => {
    const userMsg = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Extract last 10 messages for context
      const historyContext = messages.slice(-10).map(({ role, content }) => ({ role, content }));
      
      const { data } = await sendChat({ message: content, history: historyContext });
      
      const assistantMsg = { 
        role: 'assistant', 
        content: data.data.reply, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - var(--topbar-height) - 56px)',
      maxWidth: '1000px',
      margin: '0 auto',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {/* Messages Area */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {historyLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>💬</div>
            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Start a Conversation</h3>
              <p>Ask anything! I'm here to help.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={idx} {...msg} />
          ))
        )}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <MessageInput onSend={handleSend} loading={loading} />
    </div>
  );
};

export default Chat;
