import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

const Register = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    regNumber: '',
    email: '',
    course: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registering User:", formData);
    alert(`Registration initiated for ${formData.regNumber}`);
  };

  return (
    <div className="login-card">
      <img src={logo} alt="JKUAT Logo" className="logo" />
      <h2>Student Registration</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <input 
            type="text" name="fullName" placeholder="Full Name" 
            value={formData.fullName} onChange={handleChange} required 
          />
        </div>
        <div className="input-group">
          <input 
            type="text" name="regNumber" placeholder="Registration Number (e.g. SCT211...)" 
            value={formData.regNumber} onChange={handleChange} required 
          />
        </div>
        <div className="input-group">
          <input 
            type="email" name="email" placeholder="University Email" 
            value={formData.email} onChange={handleChange} required 
          />
        </div>
        <div className="input-group">
          <input 
            type="text" name="course" placeholder="Course (e.g. BSc. Mathematics)" 
            value={formData.course} onChange={handleChange} required 
          />
        </div>
        <div className="input-group">
          <input 
            type="password" name="password" placeholder="Create Password" 
            value={formData.password} onChange={handleChange} required 
          />
        </div>
        <div className="input-group">
          <input 
            type="password" name="confirmPassword" placeholder="Confirm Password" 
            value={formData.confirmPassword} onChange={handleChange} required 
          />
        </div>
        <button type="submit" className="login-button">Create Account</button>
      </form>
      <p className="switch-text">
        Already have an account? <span onClick={onSwitch} className="link">Login here</span>
      </p>
    </div>
  );
};

export default Register;