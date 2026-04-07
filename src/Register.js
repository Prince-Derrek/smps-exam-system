import React, { useState } from 'react';
import axios from 'axios'
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';



const Register = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    email: '',
    //course: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const API_BASE_URL = 'https://localhost:7211';

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
      registrationNumber: formData.registrationNumber, // MUST MATCH THE DTO
      email: formData.email,
      password: formData.password
    };
    console.log("SENDING TO BACKEND:", payload);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/student/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        regNumber: formData.registrationNumber,
        email: formData.email,
        //course: formData.course,
        password: formData.password
      });

      // Assuming your register endpoint also returns a token to auto-login
      const token = response.data.token;
      if (token) {
        sessionStorage.setItem('smps_jwt', token);
      }
      
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

        <input type="text" name="registrationNumber" placeholder="Registration Number" onChange={handleChange} required />
        <input type="email" name="email" placeholder="University Email" onChange={handleChange} required />
        {/*<input type="text" name="course" placeholder="Course of Study" onChange={handleChange} required />*/}
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