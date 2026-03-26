import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// We will replace these with real pages later
const BookingPlaceholder = () => (
    <div className="p-10">
        <h1 className="text-2xl font-bold">Booking Wizard</h1>
        <p>Unit selection will appear here.</p>
    </div>
);

const ScannerPlaceholder = () => (
    <div className="p-10">
        <h1 className="text-2xl font-bold">Invigilator Scanner</h1>
        <p>Camera view will appear here.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                {/* Simple Navbar for Navigation Testing */}
                <nav className="p-4 bg-white shadow-sm flex gap-4">
                    <span className="font-bold text-blue-600">SMPS Exam System</span>
                </nav>

                {/* Route Definitions */}
                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/booking" replace />} />
                        <Route path="/booking" element={<BookingPlaceholder />} />
                        <Route path="/verify" element={<ScannerPlaceholder />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;