import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar - Desktop Only */}
      <div className="desktop-only">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main style={{
          flex: 1, padding: 'var(--main-padding, 28px)', overflowY: 'auto',
          animation: 'fadeIn 0.35s ease both',
        }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav - Mobile Only */}
      <div className="mobile-only" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 'var(--mobile-nav-height)', background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '0 10px', backdropFilter: 'blur(10px)',
      }}>
        {[
          { to: '/dashboard', icon: '⊞', label: 'Home' },
          { to: '/chat',      icon: '💬', label: 'Chat' },
          { to: '/summarize', icon: '📝', label: 'Summ' },
          { to: '/generate',  icon: '✨', label: 'Gen' },
          { to: '/profile',   icon: '👤', label: 'Me' },
        ].map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            textDecoration: 'none', color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
            transition: 'all 0.2s ease', padding: '8px 0', width: '20%',
          })}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default DashboardLayout;
