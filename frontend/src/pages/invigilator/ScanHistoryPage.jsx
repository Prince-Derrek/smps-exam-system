import React, { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../services/api';

const BRAND = '#1A5276';

const formatDateTime = (iso) => new Date(iso).toLocaleString('en-KE', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

export default function ScanHistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: backend endpoint GET /api/invigilator/scan-history needed
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/invigilator/scan-history');
        setHistory(response.data);
      } catch {
        setError('Could not load scan history. The endpoint may not be available yet.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="px-4 lg:px-8 py-7 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Scan History</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          All tickets you have scanned during this session.
        </p>
      </div>

      <div className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 size={24} className="animate-spin" style={{ color: BRAND }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading history…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16">
            <ClipboardList size={36} strokeWidth={1.25} className="mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>No history available</p>
            <p className="text-xs mt-1 max-w-xs text-center" style={{ color: 'var(--text-muted)' }}>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <ClipboardList size={36} strokeWidth={1.25} className="mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>No scans yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Scanned tickets will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'Reg. No.', 'Unit', 'Scanned At', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.ticketId} className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-4 font-semibold" style={{ color: 'var(--text-heading)' }}>{item.studentName}</td>
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{item.registrationNumber}</td>
                    <td className="px-5 py-4" style={{ color: 'var(--text-body)' }}>
                      <p>{item.unitTitle}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.unitCode}</p>
                    </td>
                    <td className="px-5 py-4" style={{ color: 'var(--text-muted)' }}>{formatDateTime(item.scannedAt)}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(22,163,74,0.1)', color: 'var(--success)' }}>
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
