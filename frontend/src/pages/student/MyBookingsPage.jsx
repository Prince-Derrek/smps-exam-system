import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, BookOpen, ArrowRight, Info } from 'lucide-react';
import QRCode from 'react-qr-code';
import { mockBookings } from '../../utils/mockData';
import { useAuth } from '../../features/auth/AuthContext';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const STATUS_FILTERS = ['All', 'Pending', 'AwaitingPayment', 'Paid', 'Failed', 'Consumed'];

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-KE', {
  day: '2-digit', month: 'short', year: 'numeric',
});

const formatCurrency = (n) => `KES ${n.toLocaleString('en-KE')}`;

function TicketModal({ booking, onClose, user }) {
  if (!booking) return null;
  const { examUnit, paymentRecord, ticket } = booking;

  return (
    <Modal isOpen={!!booking} onClose={onClose} title="Exam Verification Ticket">
      <div className="flex flex-col items-center mb-6">
        <div className="p-4 rounded-xl inline-block" style={{ border: '2px solid var(--border)' }}>
          <QRCode value={ticket.id} size={176} />
        </div>
        <p className="text-xs mt-3 text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
          Present this QR code to the invigilator at the exam venue. Each ticket is single-use.
        </p>
      </div>

      <dl className="space-y-0 text-sm">
        {[
          ['Student',       `${user?.firstName ?? ''}`],
          ['Reg. Number',   user?.registrationNumber ?? '—'],
          ['Unit Code',     examUnit.unitCode],
          ['Unit',          examUnit.unitTitle],
          ['Amount Paid',   formatCurrency(paymentRecord.amount)],
          ['M-Pesa Receipt',paymentRecord.mpesaReceiptNumber],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between py-2.5"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <dt className="font-medium" style={{ color: 'var(--text-muted)' }}>{label}</dt>
            <dd className="font-semibold text-right max-w-[60%]"
              style={{ color: 'var(--text-heading)' }}>{value}</dd>
          </div>
        ))}
        <div className="flex justify-between py-2.5">
          <dt className="font-medium" style={{ color: 'var(--text-muted)' }}>Status</dt>
          <dd><Badge status={booking.status} /></dd>
        </div>
      </dl>

      {ticket.isUsed && (
        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            This ticket was scanned on {ticket.scannedAt ? formatDate(ticket.scannedAt) : '—'}.
          </p>
        </div>
      )}
    </Modal>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16" style={{ color: 'var(--text-muted)' }}>
      <BookOpen size={40} strokeWidth={1.25} className="mb-3 opacity-40" />
      <p className="text-sm font-semibold" style={{ color: 'var(--text-body)' }}>No bookings found</p>
      <p className="text-xs mt-1 mb-5">You haven't made any bookings yet.</p>
      <Link to="/student/book"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
        style={{ background: 'var(--primary)' }}>
        Book an Exam Unit <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function MyBookingsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useAuth();

  const filtered = activeFilter === 'All'
    ? mockBookings
    : mockBookings.filter((b) => b.status === activeFilter);

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="px-4 lg:px-8 py-7 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>My Bookings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Track your exam registrations and access your verification tickets.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={activeFilter === f
              ? { background: 'var(--primary)', color: 'white' }
              : { background: 'white', color: 'var(--text-body)', border: '1px solid var(--border)' }
            }>
            {f === 'AwaitingPayment' ? 'Awaiting Payment' : f}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {sorted.length === 0 ? <EmptyState /> : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                    {['Unit', 'Fee', 'Date', 'Status', ''].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide ${h === '' ? 'text-right' : 'text-left'}`}
                        style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-5 py-4">
                        <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>
                          {booking.examUnit.unitTitle}
                        </p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {booking.examUnit.unitCode}
                        </p>
                      </td>
                      <td className="px-5 py-4" style={{ color: 'var(--text-body)' }}>
                        {formatCurrency(booking.examUnit.standardFee)}
                      </td>
                      <td className="px-5 py-4" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-5 py-4"><Badge status={booking.status} /></td>
                      <td className="px-5 py-4 text-right">
                        {booking.status === 'Paid' && booking.ticket && (
                          <button onClick={() => setSelectedBooking(booking)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                            style={{ color: 'var(--primary)' }}>
                            <QrCode size={13} /> View Ticket
                          </button>
                        )}
                        {booking.status === 'Failed' && (
                          <Link to="/student/book"
                            className="text-xs font-semibold flex items-center gap-1 justify-end hover:opacity-80"
                            style={{ color: 'var(--text-muted)' }}>
                            Rebook <ArrowRight size={12} />
                          </Link>
                        )}
                        {!['Paid', 'Failed'].includes(booking.status) && (
                          <span style={{ color: 'var(--border)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y" style={{ borderColor: 'var(--border)' }}>
              {sorted.map((booking) => (
                <div key={booking.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-heading)' }}>
                        {booking.examUnit.unitTitle}
                      </p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {booking.examUnit.unitCode}
                      </p>
                    </div>
                    <Badge status={booking.status} />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(booking.createdAt)}
                    </p>
                    {booking.status === 'Paid' && booking.ticket && (
                      <button onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: 'var(--primary)' }}>
                        <QrCode size={13} /> View Ticket
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <TicketModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} user={user} />
    </div>
  );
}
