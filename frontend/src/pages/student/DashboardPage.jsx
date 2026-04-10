import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, AlertCircle, ArrowRight, QrCode } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import Badge from '../../components/ui/Badge';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-xl p-5 flex items-center gap-4"
      style={{ border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accent === 'gold' ? 'rgba(245,166,35,0.12)' : 'rgba(26,107,58,0.08)' }}>
        <Icon size={20} strokeWidth={2}
          style={{ color: accent === 'gold' ? 'var(--gold-dark)' : 'var(--primary)' }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{value}</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const activeCount = 0;
  const paidCount = 0;
  const failedCount = 0;
  const recent = [];

  return (
    <div className="px-4 lg:px-8 py-7 max-w-6xl mx-auto">

      <div className="rounded-2xl p-6 mb-7 flex items-center justify-between gap-4 overflow-hidden relative"
        style={{ background: 'var(--primary)' }}>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'var(--gold)' }} />
        <div className="absolute -right-4 bottom-0 w-32 h-32 rounded-full opacity-5"
          style={{ background: 'white' }} />

        <div className="relative z-10">
          <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Welcome back</p>
          <h1 className="text-2xl font-bold text-white leading-tight">{user?.firstName ?? 'Student'}</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {user?.registrationNumber} &nbsp;·&nbsp; {user?.email}
          </p>
        </div>

        <Link to="/student/book"
          className="relative z-10 flex-shrink-0 hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--gold)', color: 'var(--primary)' }}>
          Book Exam <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard icon={Clock}       label="Active Bookings" value={activeCount} accent="primary" />
        <StatCard icon={CheckCircle} label="Paid Tickets"    value={paidCount}   accent="gold" />
        <StatCard icon={AlertCircle} label="Failed Payments" value={failedCount} accent="primary" />
        <StatCard icon={BookOpen}    label="Units Available" value="—"           accent="gold" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Recent Bookings</h2>
            <Link to="/student/bookings"
              className="text-xs font-semibold flex items-center gap-1 hover:opacity-80"
              style={{ color: 'var(--primary)' }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center py-14">
              <BookOpen size={36} strokeWidth={1.25} className="mb-3 opacity-30"
                style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>No bookings yet</p>
              <p className="text-xs mt-1 mb-5" style={{ color: 'var(--text-muted)' }}>
                Register for your first supplementary exam unit.
              </p>
              <Link to="/student/book"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: 'var(--primary)' }}>
                Book an Exam Unit <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {recent.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-heading)' }}>
                      {booking.examUnit.unitTitle}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {booking.examUnit.unitCode}
                    </p>
                  </div>
                  <Badge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl p-5 flex flex-col" style={{ background: 'var(--primary)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              <BookOpen size={20} className="text-white" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">Register for an Exam</h3>
            <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Browse available supplementary exam units and complete your booking.
            </p>
            <Link to="/student/book"
              className="mt-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg"
              style={{ background: 'var(--gold)', color: 'var(--primary)' }}>
              Book an Exam Unit <ArrowRight size={15} />
            </Link>
          </div>

          {paidCount > 0 && (
            <div className="bg-white rounded-xl p-5"
              style={{ border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(245,166,35,0.12)' }}>
                  <QrCode size={18} style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Ticket Ready</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    You have {paidCount} paid ticket{paidCount > 1 ? 's' : ''} ready for the exam venue.
                  </p>
                  <Link to="/student/bookings"
                    className="text-xs font-semibold flex items-center gap-1 mt-2 hover:opacity-80"
                    style={{ color: 'var(--primary)' }}>
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
