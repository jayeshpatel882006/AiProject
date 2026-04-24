import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  /* Validate stored token on mount */
  useEffect(() => {
    const bootstrap = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data.user);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  const login = useCallback((userData, jwt) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
