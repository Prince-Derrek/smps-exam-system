import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

        {/* Student portal — nested under the shared layout */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
        </Route>

        {/* Invigilator portal — to be built separately */}
        <Route path="/verify" element={<ScannerPlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
