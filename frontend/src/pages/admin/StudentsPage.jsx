import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });

const columns = [
  { key: 'firstName', label: 'Name', render: (r) => (
    <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{r.firstName} {r.lastName}</span>
  )},
  { key: 'registrationNumber', label: 'Reg. No.', render: (r) => (
    <span className="font-mono text-xs">{r.registrationNumber}</span>
  )},
  { key: 'email', label: 'Email' },
  { key: 'bookingsCount', label: 'Bookings', render: (r) => (
    <span className="font-semibold">{r.bookingsCount ?? 0}</span>
  )},
  { key: 'createdAt', label: 'Registered', render: (r) => formatDate(r.createdAt) },
];

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: backend endpoint GET /api/admin/students needed
    api.get('/api/admin/students')
      .then((r) => setStudents(r.data))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 lg:px-8 py-7 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Students</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>All registered students in the system.</p>
      </div>
      <div className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <DataTable columns={columns} rows={students} loading={loading}
          emptyIcon={Users} emptyText="No students registered yet." />
      </div>
    </div>
  );
}
