import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Added Link
import api from '../../services/api'; // ✅ Import our new central api service
import logo from '../../assets/logo.png'; 

const Login = () => { // ✅ Removed onSwitch prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); 
    setError('');

    try {
      // ✅ Look how clean this is now! We just pass the relative path.
      const response = await api.post('/api/auth/student/login', {
        email, 
        password
      });

      const token = response.data.token;
      sessionStorage.setItem('smps_jwt', token);
      setPassword('');
      navigate('/student/dashboard');
      
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
        {/* ✅ Replaced onClick span with a proper router Link */}
        Don't have an account? <Link to="/register" style={{ color: 'blue', textDecoration: 'none' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;