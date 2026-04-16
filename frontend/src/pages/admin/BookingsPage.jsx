import React, { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { getAdminBookings } from '../../services/adminService';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });
const formatCurrency = (n) => `KES ${Number(n).toLocaleString('en-KE')}`;

const columns = [
  { key: 'studentName', label: 'Student', render: (r) => (
    <div>
      <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>{r.studentName}</p>
      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.registrationNumber}</p>
    </div>
  )},
  { key: 'unitTitle', label: 'Exam Unit', render: (r) => (
    <div>
      <p>{r.unitTitle}</p>
      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.unitCode}</p>
    </div>
  )},
  { key: 'status', label: 'Status', render: (r) => <Badge status={r.status} /> },
  { key: 'amount', label: 'Amount', render: (r) => r.amount ? formatCurrency(r.amount) : '—' },
  { key: 'createdAt', label: 'Date', render: (r) => formatDate(r.createdAt) },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // 👇 FIX: Use the service
        const data = await getAdminBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="px-4 lg:px-8 py-7 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Bookings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>All exam bookings across all students.</p>
      </div>
      <div className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <DataTable columns={columns} rows={bookings} loading={loading}
          emptyIcon={ClipboardList} emptyText="No bookings found." />
      </div>
    </div>
  );
}
