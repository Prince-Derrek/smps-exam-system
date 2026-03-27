import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';
import Register from './Register';

function App() {

  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-container">
      {isLogin ? (
        <div className="login-card">
          <img src={logo} alt="JKUAT Logo" className="logo" />
          <h2>Student Portal Login</h2>
          <form>
            <input type="text" placeholder="Registration Number" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="switch-text">
            Don't have an account? <span onClick={() => setIsLogin(false)} style={{color: '#2e7d32', cursor: 'pointer', fontWeight: 'bold'}}>Register here</span>
          </p>
        </div>
      ) : (
        <Register onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default App;