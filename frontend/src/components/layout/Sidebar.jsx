import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/chat',      icon: '💬', label: 'Chat' },
  { to: '/summarize', icon: '📝', label: 'Summarizer' },
  { to: '/generate',  icon: '✨', label: 'Generator' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const w = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <aside style={{
      width: w, minHeight: '100vh', background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden', flexShrink: 0,
      position: 'sticky', top: 0, height: '100vh', zIndex: 1000,
    }}>

      {/* Logo Section */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          height: 'var(--topbar-height)', padding: collapsed ? '0' : '0 20px', 
          display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)',
          justifyContent: collapsed ? 'center' : 'flex-start', gap: 12,
          transition: 'background var(--transition)',
          cursor: 'pointer'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 18,
            boxShadow: 'var(--shadow-accent)', color: '#fff'
          }}>⚡</div>
          {!collapsed && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                <span className="gradient-text">NexusAI</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Pro Engine</div>
            </div>
          )}
        </div>
      </Link>

      {/* Navigation Section */}
      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            title={collapsed ? label : ''}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              height: '44px',
              padding: collapsed ? '0' : '0 14px',
              borderRadius: 'var(--radius-md)', textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'all 0.2s ease',
              background: isActive ? 'var(--accent-gradient-soft)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: isActive ? 600 : 500, fontSize: 14,
              position: 'relative'
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'var(--bg-input)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {icon}
            </span>
            {!collapsed && <span style={{ animation: 'fadeIn 0.3s ease', whiteSpace: 'nowrap' }}>{label}</span>}
            
            {/* Active indicator dot for collapsed state */}
            {collapsed && (
              <div style={{
                position: 'absolute', right: 6, width: 5, height: 5, 
                borderRadius: '50%', background: 'var(--accent-primary)',
                display: 'none' // Hidden for now to keep it clean, but fixed the prop type
              }} />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Section */}
      <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--border)' }}>
        {!collapsed && user && (
          <div style={{
            padding: '12px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            marginBottom: 4, animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button 
            onClick={handleLogout} 
            title={collapsed ? 'Logout' : ''}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, height: '40px',
              padding: collapsed ? '0' : '0 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: 'none', border: 'none', borderRadius: 'var(--radius-md)',
              color: 'var(--danger)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              width: '100%', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span style={{ fontSize: 18, display: 'flex' }}>🚪</span>
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>Logout</span>}
          </button>

          <button 
            onClick={() => setCollapsed(c => !c)} 
            title={collapsed ? 'Expand' : 'Collapse'}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, height: '40px',
              padding: collapsed ? '0' : '0 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: 'var(--bg-input)', border: 'none',
              borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
              fontSize: 13, cursor: 'pointer', width: '100%',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <span style={{ 
              fontSize: 14, 
              transform: collapsed ? 'rotate(180deg)' : 'none', 
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex'
            }}>◀</span>
            {!collapsed && <span style={{ fontWeight: 600 }}>Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
