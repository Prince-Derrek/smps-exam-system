import React, { useEffect, useState } from 'react';
import { UserCheck, Plus } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

const BRAND = '#4A235A';

function AddInvigilatorModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ fullName: '', staffNumber: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/invigilator/register', form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to register invigilator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Register Invigilator">
      {error && <div className="auth-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field">
          <label>Full Name</label>
          <input type="text" placeholder="e.g. Dr. Jane Mwangi" value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        </div>
        <div className="field">
          <label>Staff Number</label>
          <input type="text" placeholder="e.g. JKUAT-1234" value={form.staffNumber}
            onChange={(e) => setForm({ ...form, staffNumber: e.target.value })} required />
        </div>
        <div className="field">
          <label>Staff Email</label>
          <input type="email" placeholder="staff@jkuat.ac.ke" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label>Temporary Password</label>
          <input type="password" placeholder="Set a temporary password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-body)' }}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: BRAND, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Registering…' : 'Register'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function InvigilatorsPage() {
  const [invigilators, setInvigilators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchInvigilators = () => {
    setLoading(true);
    // TODO: backend endpoint GET /api/admin/invigilators needed
    api.get('/api/admin/invigilators')
      .then((r) => setInvigilators(r.data))
      .catch(() => setInvigilators([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInvigilators(); }, []);

  const columns = [
    { key: 'fullName', label: 'Name', render: (r) => (
      <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{r.fullName}</span>
    )},
    { key: 'staffNumber', label: 'Staff No.', render: (r) => (
      <span className="font-mono text-xs">{r.staffNumber}</span>
    )},
    { key: 'email', label: 'Email' },
    { key: 'scannedCount', label: 'Tickets Scanned', render: (r) => (
      <span className="font-semibold">{r.scannedCount ?? 0}</span>
    )},
  ];

  return (
    <div className="px-4 lg:px-8 py-7 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Invigilators</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage exam invigilators.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: BRAND }}>
          <Plus size={16} /> Register Invigilator
        </button>
      </div>

      <div className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <DataTable columns={columns} rows={invigilators} loading={loading}
          emptyIcon={UserCheck} emptyText="No invigilators registered yet." />
      </div>

      {showModal && (
        <AddInvigilatorModal onClose={() => setShowModal(false)} onSaved={fetchInvigilators} />
      )}
    </div>
  );
}
