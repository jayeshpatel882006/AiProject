import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { signup as apiSignup, login as apiLogin } from '../services/authService';
import { getErrorMessage } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await apiLogin({ email: formData.email, password: formData.password });
        login(data.data.user, data.data.token);
        toast('Welcome back!', 'success');
      } else {
        const { data } = await apiSignup(formData);
        login(data.data.user, data.data.token);
        toast('Account created successfully!', 'success');
      }
      navigate('/dashboard');
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorative Elements */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none'
      }} />

      <Card glass style={{ width: '100%', maxWidth: '400px', padding: 'var(--main-padding, 40px)' }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', background: 'var(--accent-gradient)',
            borderRadius: '12px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px',
            boxShadow: 'var(--shadow-accent)'
          }}>⚡</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {isLogin ? 'Login to access your AI workspace' : 'Create an account for free'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <Input
              label="Full Name"
              name="name"
              placeholder="Jayesh Patel"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="jayesh@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            hint={!isLogin && "Min 8 chars, 1 upper, 1 lower, 1 number"}
          />

          <Button type="submit" fullWidth loading={loading} style={{ marginTop: '10px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none', border: 'none', color: 'var(--accent-primary)',
                fontWeight: 600, cursor: 'pointer', padding: 0
              }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
