import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  return (
    <Router>
      {/* Changed class name to be more generic since this wraps the whole app now */}
      <div className="app-container"> 
        <Routes>
          {/* Automatically redirect the root URL to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Distinct Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Placeholder for Dashboard */}
          <Route 
            path="/dashboard" 
            element={<div style={{color: 'white', fontSize: '24px'}}>Welcome to the Student Dashboard!</div>} 
          />
          
          {/* Security: Redirect any unknown URL back to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;