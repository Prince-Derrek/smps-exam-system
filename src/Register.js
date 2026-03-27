import React, { useState } from 'react';
import logo from './logo.png';

const Register = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
    console.log("Registration Data:", formData);
    alert(`Account created for ${formData.firstName} ${formData.lastName}`);
  };

  return (
    <div className="login-card">
      <img src={logo} alt="JKUAT Logo" className="logo" />
      <h2>Student Registration</h2>
      <form onSubmit={handleRegister}>
        {}
        <div className="name-row">
          <input 
            type="text" name="firstName" placeholder="First Name" 
            onChange={handleChange} required 
          />
          <input 
            type="text" name="lastName" placeholder="Last Name" 
            onChange={handleChange} required 
          />
        </div>

        <input type="text" name="regNumber" placeholder="Registration Number" onChange={handleChange} required />
        <input type="email" name="email" placeholder="University Email" onChange={handleChange} required />
        <input type="text" name="course" placeholder="Course of Study" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        
        <button type="submit" className="login-button">Create Account</button>
      </form>
      <p className="switch-text">
        Already have an account? <span onClick={onSwitch}>Login here</span>
      </p>
    </div>
  );
};

export default Register;