import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './utils/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

/* Pages */
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Summarizer from './pages/Summarizer';
import Generator from './pages/Generator';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />

              {/* Protected Dashboard Routes */}
              <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="chat" element={<Chat />} />
                <Route path="summarize" element={<Summarizer />} />
                <Route path="generate" element={<Generator />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/change-password" element={<ChangePassword />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
