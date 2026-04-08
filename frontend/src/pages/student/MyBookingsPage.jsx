import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, BookOpen, ArrowRight, Info } from 'lucide-react';
import QRCode from 'react-qr-code';
import { mockBookings, mockStudent } from '../../utils/mockData';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const STATUS_FILTERS = ['All', 'Pending', 'AwaitingPayment', 'Paid', 'Failed', 'Consumed'];

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount) {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

function TicketModal({ booking, onClose }) {
  if (!booking) return null;
  const { examUnit, paymentRecord, ticket } = booking;

  return (
    <Modal isOpen={!!booking} onClose={onClose} title="Exam Verification Ticket">
      {/* QR Code */}
      <div className="flex flex-col items-center mb-6">
        <div className="p-4 rounded-xl border-2 border-slate-200 bg-white inline-block">
          <QRCode value={ticket.id} size={180} />
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center max-w-xs">
          Present this QR code to the invigilator at the exam venue. Each ticket is single-use.
        </p>
      </div>

      {/* Details */}
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-slate-100">
          <dt className="text-slate-500 font-medium">Student</dt>
          <dd className="text-slate-900 font-semibold">
            {mockStudent.firstName} {mockStudent.lastName}
          </dd>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <dt className="text-slate-500 font-medium">Reg. Number</dt>
          <dd className="text-slate-900">{mockStudent.registrationNumber}</dd>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <dt className="text-slate-500 font-medium">Unit Code</dt>
          <dd className="text-slate-900 font-mono">{examUnit.unitCode}</dd>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <dt className="text-slate-500 font-medium">Unit</dt>
          <dd className="text-slate-900 text-right max-w-[60%]">{examUnit.unitTitle}</dd>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <dt className="text-slate-500 font-medium">Amount Paid</dt>
          <dd className="text-slate-900 font-semibold">{formatCurrency(paymentRecord.amount)}</dd>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <dt className="text-slate-500 font-medium">M-Pesa Receipt</dt>
          <dd className="text-slate-900 font-mono text-xs">{paymentRecord.mpesaReceiptNumber}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-slate-500 font-medium">Status</dt>
          <dd><Badge status={booking.status} /></dd>
        </div>
      </dl>

      {ticket.isUsed && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <Info size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            This ticket has already been scanned on{' '}
            {ticket.scannedAt ? formatDate(ticket.scannedAt) : '—'}.
          </p>
        </div>
      )}
    </Modal>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-slate-400">
      <BookOpen size={44} strokeWidth={1.25} className="mb-3" />
      <p className="text-sm font-medium text-slate-600">No bookings found</p>
      <p className="text-xs mt-1 mb-4">You haven't made any bookings yet.</p>
      <Link
        to="/student/book"
        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Book an Exam Unit <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function MyBookingsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filtered = activeFilter === 'All'
    ? mockBookings
    : mockBookings.filter((b) => b.status === activeFilter);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track your exam registrations and download your verification tickets.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeFilter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'AwaitingPayment' ? 'Awaiting Payment' : f}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Unit
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Fee
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{booking.examUnit.unitTitle}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          {booking.examUnit.unitCode}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {formatCurrency(booking.examUnit.standardFee)}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={booking.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {booking.status === 'Paid' && booking.ticket && (
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <QrCode size={14} /> View Ticket
                          </button>
                        )}
                        {booking.status === 'Failed' && (
                          <Link
                            to="/student/book"
                            className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1 justify-end"
                          >
                            Rebook <ArrowRight size={12} />
                          </Link>
                        )}
                        {!['Paid', 'Failed'].includes(booking.status) && (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-slate-100">
              {sorted.map((booking) => (
                <div key={booking.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {booking.examUnit.unitTitle}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {booking.examUnit.unitCode}
                      </p>
                    </div>
                    <Badge status={booking.status} />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-slate-500">{formatDate(booking.createdAt)}</p>
                    {booking.status === 'Paid' && booking.ticket && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600"
                      >
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

      {/* Ticket modal */}
      <TicketModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
