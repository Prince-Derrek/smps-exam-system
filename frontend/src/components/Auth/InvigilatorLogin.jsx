import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import logo from '../../assets/jkuat-logo.png';
import { useAuth } from '../../features/auth/AuthContext';

export default function InvigilatorLogin() {
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
      const response = await api.post('/api/auth/invigilator/login', { email, password });
      const { token, name, email: userEmail, registrationNumber } = response.data;
      login(token, { fullName: name, email: userEmail, staffNumber: registrationNumber, role: 'Invigilator' });
      setPassword('');
      navigate('/invigilator/scanner');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand" style={{ background: '#1A5276' }}>
        <img src={logo} alt="JKUAT" className="auth-brand-logo" />
        <div className="auth-brand-body">
          <h1 className="auth-brand-title">
            Invigilator<br />
            <span style={{ color: '#F5A623' }}>Verification Portal</span>
          </h1>
          <p className="auth-brand-sub">
            Scan student QR tickets at the exam venue to verify attendance and mark entries.
          </p>
        </div>
        <p className="auth-brand-footer">© {new Date().getFullYear()} JKUAT · SMPS Exam System</p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <img src={logo} alt="JKUAT" className="mobile-logo" />
          <h2>Invigilator Sign In</h2>
          <p className="auth-subtitle">Sign in with your staff credentials to access the scanner.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">Staff Email</label>
              <input id="email" type="email" placeholder="you@jkuat.ac.ke"
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
              style={{ background: '#1A5276' }}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <button type="button"
            onClick={() => {
              login('mock-invigilator-token', { fullName: 'Dr. Jane Mwangi', email: 'jane@jkuat.ac.ke', staffNumber: 'JKUAT-1234', role: 'Invigilator' });
              navigate('/invigilator/scanner');
            }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold mt-3"
            style={{ border: '1.5px dashed #1A5276', color: '#1A5276', background: 'rgba(26,82,118,0.06)' }}>
            🔧 Preview Invigilator Dashboard (Mock)
          </button>

          <p className="auth-switch">
            <Link to="/" style={{ color: '#1A5276' }}>← Back to role selection</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
