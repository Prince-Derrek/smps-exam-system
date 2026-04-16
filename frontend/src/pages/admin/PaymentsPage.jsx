import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import api from '../../services/auth';
import DataTable from '../../components/ui/DataTable';

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });
const formatCurrency = (n) => `KES ${Number(n).toLocaleString('en-KE')}`;

const paymentStatusStyle = {
  Completed:  { bg: 'rgba(22,163,74,0.1)',   color: 'var(--success)' },
  Pending:    { bg: 'rgba(245,166,35,0.12)', color: '#D4891A' },
  Failed:     { bg: 'rgba(220,38,38,0.08)',  color: 'var(--danger)' },
  Cancelled:  { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
};

const columns = [
  { key: 'studentName', label: 'Student', render: (r) => (
    <div>
      <p className="font-semibold" style={{ color: 'var(--text-heading)' }}>{r.studentName}</p>
      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.phoneNumber}</p>
    </div>
  )},
  { key: 'unitTitle', label: 'Unit' },
  { key: 'amount', label: 'Amount', render: (r) => (
    <span className="font-semibold">{formatCurrency(r.amount)}</span>
  )},
  { key: 'mpesaReceiptNumber', label: 'M-Pesa Receipt', render: (r) => (
    <span className="font-mono text-xs">{r.mpesaReceiptNumber ?? '—'}</span>
  )},
  { key: 'status', label: 'Status', render: (r) => {
    const s = paymentStatusStyle[r.status] ?? paymentStatusStyle.Pending;
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: s.bg, color: s.color }}>
        {r.status}
      </span>
    );
  }},
  { key: 'transactionDate', label: 'Date', render: (r) => formatDate(r.transactionDate) },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: backend endpoint GET /api/admin/payments needed
    api.get('/api/admin/payments')
      .then((r) => setPayments(r.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 lg:px-8 py-7 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Payments</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>All M-Pesa payment records.</p>
      </div>
      <div className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <DataTable columns={columns} rows={payments} loading={loading}
          emptyIcon={CreditCard} emptyText="No payment records found." />
      </div>
    </div>
  );
}
