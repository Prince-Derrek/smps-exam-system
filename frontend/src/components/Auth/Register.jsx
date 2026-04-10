import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import logo from '../../assets/jkuat-logo.png';
import { useAuth } from '../../features/auth/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', registrationNumber: '',
    email: '', password: '', confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await api.post('/api/auth/student/register', payload);
      const { token, name, email: userEmail, registrationNumber } = response.data;
      login(token, { firstName: name, email: userEmail, registrationNumber });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Brand panel */}
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

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <img src={logo} alt="JKUAT" className="mobile-logo" />
          <h2>Create account</h2>
          <p className="auth-subtitle">Fill in your details to register as a student.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="name-row">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" name="firstName" placeholder="John"
                  value={formData.firstName} onChange={handleChange} disabled={isLoading} required />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" name="lastName" placeholder="Doe"
                  value={formData.lastName} onChange={handleChange} disabled={isLoading} required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="registrationNumber">Registration Number</label>
              <input id="registrationNumber" type="text" name="registrationNumber"
                placeholder="CS/2022/0147" value={formData.registrationNumber}
                onChange={handleChange} disabled={isLoading} required />
            </div>

            <div className="field">
              <label htmlFor="email">University Email</label>
              <input id="email" type="email" name="email"
                placeholder="you@students.jkuat.ac.ke" value={formData.email}
                onChange={handleChange} disabled={isLoading} required />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" name="password"
                placeholder="Create a strong password" value={formData.password}
                onChange={handleChange} disabled={isLoading} required />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" name="confirmPassword"
                placeholder="Repeat your password" value={formData.confirmPassword}
                onChange={handleChange} disabled={isLoading} required />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
