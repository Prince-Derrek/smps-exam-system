import React from 'react';
import BookingWizard from '../features/booking/BookingWizard';

export default function BookingPage() {
  return (
    <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Book an Exam Unit</h1>
        <p className="text-slate-500 text-sm mt-1">
          Complete the steps below to register and pay for your supplementary exam.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <BookingWizard />
      </div>
    </div>
  );
}
