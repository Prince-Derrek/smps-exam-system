import React, { useEffect, useState } from 'react';
import { Users, BookOpen, CreditCard, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';
import { getAdminStats, getAdminTrends } from '../../services/adminService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch both endpoints concurrently for speed
        const [statsData, trendsData] = await Promise.all([
          getAdminStats(),
          getAdminTrends(30) // Get last 30 days
        ]);
        
        setStats(statsData);
        setTrends(trendsData);
      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const cards = [
    { icon: Users,       label: 'Total Students',    value: stats?.totalStudents,    accent: BRAND },
    { icon: BookOpen,    label: 'Total Bookings',     value: stats?.totalBookings,    accent: '#1A5276' },
    { icon: CreditCard,  label: 'Total Revenue (KES)', value: Number(stats?.totalRevenue || 0).toLocaleString('en-KE'), accent: 'var(--success)' },
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
      <div className="rounded-xl p-6"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        
        <div className="mb-6 flex items-center gap-2">
          <TrendingUp size={20} style={{ color: BRAND }} />
          <h2 className="text-base font-bold" style={{ color: 'var(--text-heading)' }}>30-Day Booking Trends</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[280px]">
            <Loader2 className="animate-spin text-muted" size={32} />
          </div>
        ) : trends.length === 0 ? (
          <div className="flex justify-center items-center h-[280px] text-sm" style={{ color: 'var(--text-muted)' }}>
            No booking data available for this period.
          </div>
        ) : (
          /* 👇 WE DROPPED RESPONSIVE CONTAINER AND GRADIENTS FOR A HARDCODED TEST */
          <div style={{ width: '100%', overflowX: 'auto', padding: '10px' }}>
            <AreaChart 
              width={800} 
              height={280} 
              data={trends} 
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateLabel" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="bookingCount" 
                stroke={BRAND} 
                fill={BRAND} 
              />
            </AreaChart>
          </div>
        )}
      </div>
    </div>
  );
}
