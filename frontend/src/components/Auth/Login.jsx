import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/auth';
import logo from '../../assets/jkuat-logo.png';
import { useAuth } from '../../features/auth/AuthContext';

export default function Login() {
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
      const response = await api.post('/api/auth/student/login', { email, password });
      const { token, name, email: userEmail, registrationNumber } = response.data;
      login(token, { firstName: name, email: userEmail, registrationNumber });
      setPassword('');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <img src={logo} alt="JKUAT" className="auth-brand-logo" />
        <div className="auth-brand-body">
          <h1 className="auth-brand-title">
            Supplementary<br />
            Exam <span>Portal</span>
          </h1>
          <p className="auth-brand-sub">
            Register for supplementary examinations, complete M-Pesa payments,
            and receive your digital verification ticket — all in one place.
          </p>
        </div>
        <p className="auth-brand-footer">© {new Date().getFullYear()} JKUAT · SMPS Exam System</p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <img src={logo} alt="JKUAT" className="mobile-logo" />
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to your student account to continue.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">University Email</label>
              <input id="email" type="email" placeholder="you@students.jkuat.ac.ke"
                value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading} required />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading} required />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
