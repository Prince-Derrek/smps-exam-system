import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Added Link
import api from '../../services/api'; // ✅ Import central api
import logo from '../../assets/logo.png'; 

const Register = () => { // ✅ Removed onSwitch prop
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true); 
    setError('');

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      registrationNumber: formData.registrationNumber, 
      email: formData.email,
      password: formData.password
    };

    try {
      // ✅ Using central API
      const response = await api.post('/api/auth/student/register', payload);

      const token = response.data.token;
      if (token) {
        sessionStorage.setItem('smps_jwt', token);
      }
      
      // Since it's successful, you can redirect straight to dashboard or back to login
      navigate('/login'); 
      
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || "Connection to backend failed.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="login-card">
      <img src={logo} alt="JKUAT Logo" className="logo" />
      <h2>Student Registration</h2>

      {error && <p className="error-message" style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <div className="name-row">
          <input 
            type="text" name="firstName" placeholder="First Name" 
            value={formData.firstName} onChange={handleChange} disabled={isLoading} required 
          />
          <input 
            type="text" name="lastName" placeholder="Last Name" 
            value={formData.lastName} onChange={handleChange} disabled={isLoading} required 
          />
        </div>

        <input type="text" name="registrationNumber" placeholder="Registration Number" value={formData.registrationNumber} onChange={handleChange} disabled={isLoading} required />
        <input type="email" name="email" placeholder="University Email" value={formData.email} onChange={handleChange} disabled={isLoading} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} disabled={isLoading} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} required />
        
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <p className="switch-text">
        {/* ✅ Replaced onClick span with a proper router Link */}
        Already have an account? <Link to="/login" style={{ color: 'blue', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
};

export default Register;