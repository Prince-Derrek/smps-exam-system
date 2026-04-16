import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../../../features/auth/AuthContext';

const formatCurrency = (n) => `KES ${n.toLocaleString('en-KE')}`;

export default function ConfirmationStep({ unit, receiptNumber, ticketId, onBookAnother }) {
  const { user } = useAuth();

if (!unit){
  return <Navigate to="/student/bookings" replace />;
}

  return (
    <div className="flex flex-col items-center text-center">
      {/* Success icon */}
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'rgba(22,163,74,0.1)' }}>
        <CheckCircle2 size={30} strokeWidth={2} style={{ color: 'var(--success)' }} />
      </div>

      <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
        Booking Confirmed!
      </h2>
      <p className="text-sm max-w-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Your M-Pesa payment has been received. Your exam unit has been successfully registered.
      </p>

      {/* Ticket card */}
      <div className="w-full max-w-sm rounded-2xl overflow-hidden mb-6"
        style={{ border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(26,107,58,0.12)' }}>

        {/* Card header */}
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ background: 'var(--primary)' }}>
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              Verification Ticket
            </p>
            <p className="text-white font-bold text-sm mt-0.5 truncate">{unit.unitTitle}</p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gold)' }}>
            {unit.unitCode}
          </span>
        </div>

        {/* QR Code */}
        <div className="flex justify-center p-6" style={{ background: 'var(--card-bg)' }}>
          <div className="p-3 rounded-xl" style={{ border: '1px solid var(--border)' }}>
            <QRCode value={ticketId} size={160} />
          </div>
        </div>

        {/* Details */}
        <div className="px-5 pb-5 space-y-2.5 text-sm" style={{ background: 'var(--card-bg)' }}>
          <div className="border-t border-dashed mb-3" style={{ borderColor: 'var(--border)' }} />
          {[
            ['Student',       user?.firstName ?? '—'],
            ['Reg. No.',      user?.registrationNumber ?? '—'],
            ['Amount Paid',   formatCurrency(unit.standardFee)],
            ['M-Pesa Receipt',receiptNumber],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
        Present this QR code to the invigilator at the exam venue.
        The ticket is single-use and tied to your student registration.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link to="/student/bookings"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors"
          style={{ border: '1.5px solid var(--border)', color: 'var(--text-body)', background: 'var(--card-bg)' }}>
          <BookOpen size={15} /> View My Bookings
        </Link>
        <button onClick={onBookAnother}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: 'var(--primary)' }}>
          Book Another <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
