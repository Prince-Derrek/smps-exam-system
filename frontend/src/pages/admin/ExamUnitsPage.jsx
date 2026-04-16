import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Pencil } from 'lucide-react';
import { getAdminExamUnits, createExamUnit, updateExamUnit } from '../../services/adminService';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

const BRAND = '#4A235A';
const formatCurrency = (n) => `KES ${Number(n).toLocaleString('en-KE')}`;

function ExamUnitModal({ unit, onClose, onSaved }) {
  const isEdit = !!unit?.id;
  const [form, setForm] = useState({ unitCode: unit?.unitCode ?? '', unitTitle: unit?.unitTitle ?? '', standardFee: unit?.standardFee ?? '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 👇 FIX: Use the service functions
      if (isEdit) {
        await updateExamUnit(unit.id, form);
      } else {
        await createExamUnit(form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={isEdit ? 'Edit Exam Unit' : 'Add Exam Unit'}>
      {error && <div className="auth-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field">
          <label>Unit Code</label>
          <input type="text" placeholder="e.g. CS 201" value={form.unitCode}
            onChange={(e) => setForm({ ...form, unitCode: e.target.value })} required />
        </div>
        <div className="field">
          <label>Unit Title</label>
          <input type="text" placeholder="e.g. Data Structures & Algorithms" value={form.unitTitle}
            onChange={(e) => setForm({ ...form, unitTitle: e.target.value })} required />
        </div>
        <div className="field">
          <label>Standard Fee (KES)</label>
          <input type="number" placeholder="e.g. 3500" value={form.standardFee}
            onChange={(e) => setForm({ ...form, standardFee: e.target.value })} required />
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
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Unit'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function ExamUnitsPage() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalUnit, setModalUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      // 👇 FIX: Use the service function
      const data = await getAdminExamUnits();
      setUnits(data);
    } catch (err) {
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUnits(); }, []);

  useEffect(() => { fetchUnits(); }, []);

  const columns = [
    { key: 'unitCode', label: 'Code', render: (r) => (
      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded"
        style={{ background: `${BRAND}10`, color: BRAND }}>{r.unitCode}</span>
    )},
    { key: 'unitTitle', label: 'Title', render: (r) => (
      <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{r.unitTitle}</span>
    )},
    { key: 'standardFee', label: 'Fee', render: (r) => formatCurrency(r.standardFee) },
    { key: 'actions', label: '', render: (r) => (
      <button onClick={() => { setModalUnit(r); setShowModal(true); }}
        className="inline-flex items-center gap-1 text-xs font-semibold hover:opacity-80"
        style={{ color: BRAND }}>
        <Pencil size={13} /> Edit
      </button>
    )},
  ];

  return (
    <div className="px-4 lg:px-8 py-7 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Exam Units</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage supplementary exam units.</p>
        </div>
        <button onClick={() => { setModalUnit(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: BRAND }}>
          <Plus size={16} /> Add Unit
        </button>
      </div>

      <div className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <DataTable columns={columns} rows={units} loading={loading}
          emptyIcon={BookOpen} emptyText="No exam units found." />
      </div>

      {showModal && (
        <ExamUnitModal unit={modalUnit} onClose={() => setShowModal(false)} onSaved={fetchUnits} />
      )}
    </div>
  );
}
