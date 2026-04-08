import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, AlertCircle, ArrowRight, QrCode } from 'lucide-react';
import { mockStudent, mockBookings, mockExamUnits } from '../../utils/mockData';
import Badge from '../../components/ui/Badge';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" strokeWidth={2} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const activeCount = mockBookings.filter((b) =>
    ['Pending', 'AwaitingPayment'].includes(b.status)
  ).length;

  const paidCount = mockBookings.filter((b) => b.status === 'Paid').length;
  const failedCount = mockBookings.filter((b) => b.status === 'Failed').length;

  const recent = [...mockBookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {mockStudent.firstName}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {mockStudent.registrationNumber} &nbsp;·&nbsp; {mockStudent.email}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Clock}
          label="Active Bookings"
          value={activeCount}
          color="bg-amber-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Paid Tickets"
          value={paidCount}
          color="bg-green-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Failed Payments"
          value={failedCount}
          color="bg-red-500"
        />
        <StatCard
          icon={BookOpen}
          label="Units Available"
          value={mockExamUnits.length}
          color="bg-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Recent Bookings</h2>
            <Link
              to="/student/bookings"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <BookOpen size={36} strokeWidth={1.5} className="mb-2" />
              <p className="text-sm">No bookings yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {booking.examUnit.unitTitle}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {booking.examUnit.unitCode} &nbsp;·&nbsp; {formatDate(booking.createdAt)}
                    </p>
                  </div>
                  <Badge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions panel */}
        <div className="flex flex-col gap-4">
          {/* Book new unit CTA */}
          <div className="bg-blue-600 rounded-xl p-5 flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <BookOpen size={20} className="text-white" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">Register for an Exam</h3>
            <p className="text-blue-100 text-xs leading-relaxed mb-4">
              Browse available supplementary exam units and complete your booking.
            </p>
            <Link
              to="/student/book"
              className="mt-auto inline-flex items-center justify-center gap-2 bg-white text-blue-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Book an Exam Unit <ArrowRight size={15} />
            </Link>
          </div>

          {/* Ticket reminder */}
          {paidCount > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <QrCode size={18} className="text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">Ticket Ready</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    You have {paidCount} paid ticket{paidCount > 1 ? 's' : ''} ready for use at the exam venue.
                  </p>
                  <Link
                    to="/student/bookings"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
                  >
                    View tickets <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
