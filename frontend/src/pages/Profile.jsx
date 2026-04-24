import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card glass style={{ padding: '40px', textAlign: 'center' }} className="fade-in">
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'var(--accent-gradient)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: '32px',
          margin: '0 auto 24px', boxShadow: 'var(--shadow-accent)'
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
          {user?.name}
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          {user?.email}
        </p>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: '12px',
          padding: '24px', background: 'var(--bg-input)',
          borderRadius: 'var(--radius-lg)', textAlign: 'left',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Account Type</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Pro Member</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Joined On</span>
            <span style={{ color: 'var(--text-primary)' }}>{new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <Link to="/profile/change-password" style={{ textDecoration: 'none' }}>
          <Button fullWidth variant="ghost">
            🔑 Change Account Password
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default Profile;
