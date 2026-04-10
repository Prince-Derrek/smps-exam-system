import React from 'react';
import BookingWizard from '../features/booking/BookingWizard';

export default function BookingPage() {
  return (
    <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Book an Exam Unit</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Complete the steps below to register and pay for your supplementary exam.
        </p>
      </div>

      <div className="rounded-xl p-6 lg:p-8"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <BookingWizard />
      </div>
    </div>
  );
}
