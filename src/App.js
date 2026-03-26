import React, { useState } from 'react';
import './App.css'; 

function App() {

  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = (e) => {
    e.preventDefault();
    alert("Attempting Login for ID: " + studentId);
  
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

        {}
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#666' }}>
          <a href="#forgot" style={{ color: '#2e7d32', textDecoration: 'none' }}>Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default App;