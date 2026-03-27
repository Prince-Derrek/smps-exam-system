import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { CheckCircle2, ArrowRight, BookOpen, Download } from 'lucide-react';
import { mockStudent } from '../../../utils/mockData';

function formatCurrency(amount) {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export default function ConfirmationStep({ unit, receiptNumber, ticketId, onBookAnother }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Success icon */}
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle2 size={30} className="text-green-600" strokeWidth={2} />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-1">Booking Confirmed!</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-8">
        Your M-Pesa payment has been received. Your exam unit has been successfully registered.
      </p>

      {/* Ticket card */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        {/* Card header */}
        <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Verification Ticket
            </p>
            <p className="text-white font-bold text-sm mt-0.5 truncate">{unit.unitTitle}</p>
          </div>
          <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-1 rounded">
            {unit.unitCode}
          </span>
        </div>

        {/* QR Code */}
        <div className="flex justify-center p-6 bg-white">
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-inner">
            <QRCode value={ticketId} size={160} />
          </div>
        </div>

        {/* Details */}
        <div className="border-t border-dashed border-slate-200 mx-5" />
        <div className="px-5 py-4 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Student</span>
            <span className="font-medium text-slate-900">
              {mockStudent.firstName} {mockStudent.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Reg. No.</span>
            <span className="font-medium text-slate-900">{mockStudent.registrationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-bold text-slate-900">{formatCurrency(unit.standardFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">M-Pesa Receipt</span>
            <span className="font-mono text-xs text-slate-700">{receiptNumber}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-6 max-w-xs">
        Present this QR code to the invigilator at the exam venue. The ticket is
        single-use and tied to your student registration.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          to="/student/bookings"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <BookOpen size={15} /> View My Bookings
        </Link>
        <button
          onClick={onBookAnother}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
        >
          Book Another <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
