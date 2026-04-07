import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png'; 

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const API_BASE_URL = 'https://localhost:7211';

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); 
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/student/login`, {
        email, 
        password
      });

      const token = response.data.token;
      sessionStorage.setItem('smps_jwt', token);
      setPassword('');
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Connection to backend failed.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="login-card">
      <img src={logo} alt="JKUAT Logo" className="logo" />
      <h2>Student Portal Login</h2>
      
      {error && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
      
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="University Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required 
        />
        
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? "Authenticating..." : "Login"}
        </button>
      </form>
      
      <p className="switch-text">
        Don't have an account? <span onClick={onSwitch}>Register here</span>
      </p>
    </div>
  );
};

export default Login;