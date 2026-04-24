import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const colors = {
    success: { bg: 'var(--success-bg)', border: 'var(--success)', color: 'var(--success)' },
    error:   { bg: 'var(--danger-bg)',  border: 'var(--danger)',  color: 'var(--danger)' },
    warning: { bg: 'var(--warning-bg)', border: 'var(--warning)', color: 'var(--warning)' },
    info:    { bg: 'var(--info-bg)',    border: 'var(--info)',    color: 'var(--info)' },
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 10, zIndex: 9999,
      }}>
        {toasts.map(({ id, message, type }) => {
          const c = colors[type] || colors.info;
          return (
            <div key={id} className="fade-in" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 18px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)', border: `1px solid ${c.border}`,
              boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)',
              fontSize: '14px', fontWeight: 500, maxWidth: 360,
            }}>
              <span>{icons[type]}</span>
              <span>{message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be within ToastProvider');
  return ctx;
};
