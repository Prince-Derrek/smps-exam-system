import React, { useEffect, useState } from 'react';
import { Users, BookOpen, CreditCard, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../services/auth';

const BRAND = '#4A235A';

function StatCard({ icon: Icon, label, value, accent, loading }) {
  return (
    <div className="rounded-xl p-5 flex items-center gap-4"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}15` }}>
        <Icon size={20} strokeWidth={2} style={{ color: accent }} />
      </div>
      <div>
        {loading
          ? <div className="w-12 h-6 rounded animate-pulse" style={{ background: 'var(--border)' }} />
          : <p className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{value}</p>
        }
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: backend endpoint GET /api/admin/stats needed
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        setStats(res.data);
      } catch {
        // Mock data for preview
        setStats({ totalStudents: 142, totalBookings: 318, totalRevenue: '1,113,000', verifiedTickets: 87 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: Users,       label: 'Total Students',    value: stats?.totalStudents,    accent: BRAND },
    { icon: BookOpen,    label: 'Total Bookings',     value: stats?.totalBookings,    accent: '#1A5276' },
    { icon: CreditCard,  label: 'Total Revenue (KES)',value: stats?.totalRevenue,     accent: 'var(--success)' },
    { icon: CheckCircle, label: 'Verified Tickets',   value: stats?.verifiedTickets,  accent: '#F5A623' },
  ];

  return (
    <div className="px-4 lg:px-8 py-7 max-w-6xl mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>System-wide overview.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {cards.map((c) => <StatCard key={c.label} {...c} loading={loading} />)}
      </div>

      {/* Placeholder for charts — backend data needed */}
      <div className="rounded-xl p-8 flex flex-col items-center justify-center"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', minHeight: 240 }}>
        <TrendingUp size={36} strokeWidth={1.25} className="mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>Booking trends chart</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Available once backend analytics endpoint is ready.
        </p>
      </div>
    </div>
  );
}
