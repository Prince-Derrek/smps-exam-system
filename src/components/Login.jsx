import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

const Login = ({ onSwitch }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        studentId,
        password
      });

      const token = response.data.token;
      sessionStorage.setItem('smps_jwt', token);

      setPassword('');

      navigate('/dashboard');
      
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card">
      <img src={logo} alt="JKUAT Logo" className="logo" />
      <h2>Student Portal Login</h2>
      
      {}
      {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
      
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Registration Number" 
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={isLoading} // 4.5: Disable input while loading
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
          {}
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