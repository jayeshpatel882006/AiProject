import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard',  subtitle: 'Overview of your AI usage' },
  '/chat':      { title: 'AI Chat',    subtitle: 'Multi-turn conversation with Groq' },
  '/summarize': { title: 'Summarizer', subtitle: 'Condense long text instantly' },
  '/generate':  { title: 'Generator',  subtitle: 'Create content with AI' },
  '/profile':   { title: 'My Profile', subtitle: 'Manage your account settings' },
  '/profile/change-password': { title: 'Security', subtitle: 'Update your account password' },
};

const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { title: 'NexusAI', subtitle: '' };

  return (
    <header style={{
      height: 'var(--topbar-height)', background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '0 var(--main-padding, 28px)', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {page.title}
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{page.subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            width: 40, height: 40, borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, cursor: 'pointer', transition: 'all var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Clickable Avatar for Profile */}
        <Link 
          to="/profile" 
          title="My Profile"
          style={{ 
            display: 'flex', alignItems: 'center', gap: 10, 
            textDecoration: 'none', color: 'inherit',
            padding: '4px 12px', borderRadius: 'var(--radius-md)',
            transition: 'background var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          {user?.name && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                Pro Plan
              </div>
            </div>
          )}
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 15,
            boxShadow: 'var(--shadow-accent)', border: '2px solid transparent',
            transition: 'border-color var(--transition)',
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
