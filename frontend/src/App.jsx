import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// ---------------- USER AUTH IMPORTS (Your Work) ----------------
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// -------------- STUDENT PORTAL IMPORTS (Teammate's Work) --------------
import StudentLayout from './layouts/StudentLayout';
import DashboardPage from './pages/student/DashboardPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/student/MyBookingsPage';

// Invigilator scanner — placeholder until that portal is built
const ScannerPlaceholder = () => (
  <div className="p-10">
    <h1 className="text-2xl font-bold text-slate-900">Invigilator Scanner</h1>
    <p className="text-slate-500 mt-2">Camera view will appear here.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container"> 
        <Routes>
          {/* Root redirect -> Route to Login first! */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Distinct Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student portal — nested under the shared layout */}
          <Route path="/student" element={<StudentLayout />}>
            {/* When hitting /student directly, push to dashboard */}
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="book" element={<BookingPage />} />
            <Route path="bookings" element={<MyBookingsPage />} />
          </Route>

          {/* Invigilator portal — to be built separately */}
          <Route path="/verify" element={<ScannerPlaceholder />} />
          
          {/* Security: Redirect any unknown URL back to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;