import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      background: 'var(--bg-base)', padding: '20px'
    }}>
      <div style={{ fontSize: '120px', fontWeight: 800, color: 'var(--accent-primary)', opacity: 0.5, marginBottom: '-20px' }}>404</div>
      <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button size="lg">Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
