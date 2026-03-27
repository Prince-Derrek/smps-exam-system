import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './Register';

function App() {
  // This state still controls whether the "/" path shows Login or Register
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Router>
      <div className="login-container">
        <Routes>
          {/* Main Route: Shows the Login/Register toggle at the root URL */}
          <Route 
            path="/" 
            element={
              isLogin ? (
                <Login onSwitch={() => setIsLogin(false)} />
              ) : (
                <Register onSwitch={() => setIsLogin(true)} />
              )
            } 
          />
          
          {/* Placeholder for Dashboard (Prince's requirement 5.4) */}
          {/* When Login is successful, the 'navigate' function sends users here */}
          <Route 
            path="/dashboard" 
            element={<div style={{color: 'white', fontSize: '24px'}}>Welcome to the Student Dashboard!</div>} 
          />
          
          {/* Security: Redirect any unknown URL back to the home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;