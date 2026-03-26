import React, { useState } from 'react';
import './App.css'; 

function App() {
  // 1. States to store what the student types
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  // 2. Function that runs when the 'Login' button is clicked
  const handleLogin = (e) => {
    e.preventDefault();
    alert("Attempting Login for ID: " + studentId);
    // This is where you will eventually add the axios.post code
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* JKUAT Logo */}
        <img 
          src={require('./logo.png')} 
          alt="JKUAT Logo" 
          style={{ width: '100px', marginBottom: '10px' }} 
        />
        
        <h1>Student Portal</h1>

        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Student ID" 
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)} 
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          
          <button type="submit">Login to Portal</button>
        </form>

        {/* Optional: Add a small footer link */}
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#666' }}>
          <a href="#forgot" style={{ color: '#2e7d32', textDecoration: 'none' }}>Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default App;