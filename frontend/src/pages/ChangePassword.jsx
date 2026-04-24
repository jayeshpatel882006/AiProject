import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword as apiChangePassword } from '../services/authService';
import { useToast } from '../components/ui/Toast';
import { getErrorMessage } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast('New passwords do not match', 'error');
    }

    setLoading(true);
    try {
      await apiChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast('Password updated successfully! Please login again.', 'success');
      // On backend, password change increments tokenVersion, invalidating current session
      navigate('/login');
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Card style={{ padding: '32px' }} className="fade-in">
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>
          Update Your Password
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={formData.currentPassword}
            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
            required
          />
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            required
            hint="Min 8 chars, 1 upper, 1 lower, 1 number"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" fullWidth onClick={() => navigate('/profile')}>Cancel</Button>
            <Button type="submit" fullWidth loading={loading}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
