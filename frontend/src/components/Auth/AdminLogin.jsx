import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import logo from '../../assets/jkuat-logo.png';
import { useAuth } from '../../features/auth/AuthContext';

const BRAND = '#4A235A';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // TODO: backend endpoint POST /api/auth/admin/login needed
      const response = await api.post('/api/auth/admin/login', { email, password });
      const { token, name, email: userEmail } = response.data;
      login(token, { fullName: name, email: userEmail, role: 'Admin' });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand" style={{ background: BRAND }}>
        <img src={logo} alt="JKUAT" className="auth-brand-logo" />
        <div className="auth-brand-body">
          <h1 className="auth-brand-title">
            Admin<br />
            <span style={{ color: '#F5A623' }}>Control Panel</span>
          </h1>
          <p className="auth-brand-sub">
            Manage exam units, students, invigilators, bookings and payment records across the system.
          </p>
        </div>
        <p className="auth-brand-footer">© {new Date().getFullYear()} JKUAT · SMPS Exam System</p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <img src={logo} alt="JKUAT" className="mobile-logo" />
          <h2>Administrator Sign In</h2>
          <p className="auth-subtitle">Sign in with your admin credentials.</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-error" style={{ background: 'rgba(74,35,90,0.06)', border: '1px solid rgba(74,35,90,0.2)', color: BRAND, marginBottom: 16 }}>
            ⚠️ Admin backend endpoints are pending. UI is ready for integration.
          </div>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">Admin Email</label>
              <input id="email" type="email" placeholder="admin@jkuat.ac.ke"
                value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading} required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading} required />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}
              style={{ background: BRAND }}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <button type="button"
            onClick={() => {
              login('mock-admin-token', { fullName: 'Dr. Admin User', email: 'admin@jkuat.ac.ke', role: 'Admin' });
              navigate('/admin/dashboard');
            }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold mt-3"
            style={{ border: `1.5px dashed ${BRAND}`, color: BRAND, background: `${BRAND}08` }}>
            🔧 Preview Admin Dashboard (Mock)
          </button>

          <p className="auth-switch">
            <Link to="/" style={{ color: BRAND }}>← Back to role selection</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
