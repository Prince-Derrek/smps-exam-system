import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import SettingsPage from './pages/settings/SettingsPage';

// ── Landing ──────────────────────────────────────────────────────────────────
import LandingPage from './pages/LandingPage';

// ── Student Auth & Portal ─────────────────────────────────────────────────────
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentLayout from './layouts/StudentLayout';
import DashboardPage from './pages/student/DashboardPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/student/MyBookingsPage';

// ── Invigilator Auth & Portal ─────────────────────────────────────────────────
import InvigilatorLogin from './components/Auth/InvigilatorLogin';
import InvigilatorLayout from './layouts/InvigilatorLayout';
import ScannerPage from './pages/ScannerPage';
import ScanHistoryPage from './pages/invigilator/ScanHistoryPage';

// ── Admin Auth & Portal ───────────────────────────────────────────────────────
import AdminLogin from './components/Auth/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import StudentsPage from './pages/admin/StudentsPage';
import BookingsPage from './pages/admin/BookingsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import ExamUnitsPage from './pages/admin/ExamUnitsPage';
import InvigilatorsPage from './pages/admin/InvigilatorsPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Landing — role selector */}
          <Route path="/" element={<LandingPage />} />

          {/* ── Student ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="book" element={<BookingPage />} />
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ── Invigilator ── */}
          <Route path="/invigilator/login" element={<InvigilatorLogin />} />
          <Route path="/invigilator" element={<InvigilatorLayout />}>
            <Route index element={<Navigate to="/invigilator/scanner" replace />} />
            <Route path="scanner" element={<ScannerPage />} />
            <Route path="history" element={<ScanHistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ── Admin ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="exam-units" element={<ExamUnitsPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="invigilators" element={<InvigilatorsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
