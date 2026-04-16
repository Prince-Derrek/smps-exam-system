import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, RotateCcw } from 'lucide-react';
import ScannerWidget from '../features/verification/components/ScannerWidget';
import { verifyTicket } from '../services/ticketService'; // Import the service function

const BRAND = '#1A5276';

function ScanResult({ result, onReset }) {
  if (!result) return null;

  const isSuccess = result.success;

  return (
    <div className="w-full max-w-sm mx-auto mt-6 rounded-2xl p-6 flex flex-col items-center text-center"
      style={{
        background: isSuccess ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)',
        border: `1.5px solid ${isSuccess ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)'}`,
      }}>
      {isSuccess
        ? <CheckCircle2 size={44} strokeWidth={1.5} style={{ color: 'var(--success)' }} className="mb-3" />
        : <XCircle size={44} strokeWidth={1.5} style={{ color: 'var(--danger)' }} className="mb-3" />
      }

      <p className="text-base font-bold mb-1"
        style={{ color: isSuccess ? 'var(--success)' : 'var(--danger)' }}>
        {isSuccess ? 'Ticket Valid ✓' : 'Ticket Invalid ✗'}
      </p>

      {isSuccess && result.data && (
        <div className="w-full mt-3 space-y-2 text-sm text-left">
          {[
            ['Student',   result.data.studentName],
            ['Reg. No.',  result.data.registrationNumber],
            ['Unit',      result.data.unitTitle],
            ['Unit Code', result.data.unitCode],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5"
              style={{ borderBottom: '1px solid rgba(22,163,74,0.15)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>{value ?? '—'}</span>
            </div>
          ))}
        </div>
      )}

      {!isSuccess && (
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          {result.message ?? 'This ticket is invalid or has already been used.'}
        </p>
      )}

      <button onClick={onReset}
        className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: BRAND }}>
        <RotateCcw size={15} /> Scan Next Student
      </button>
    </div>
  );
}

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleScan = async (ticketId) => {
    setIsVerifying(true);
    setScanResult(null);
    try {
      // 👇 FIX: Use the clean service function
      const data = await verifyTicket(ticketId);
      
      // If it reaches here, the backend validated it and consumed it!
      setScanResult({ success: true, data: data });
    } catch (err) {
      // If backend throws InvalidOperationException (already used) or NotFound
      setScanResult({
        success: false,
        message: err.response?.data?.message ?? 'Ticket verification failed.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => setScanResult(null);

  return (
    <div className="px-4 lg:px-8 py-7 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>QR Scanner</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Point the camera at a student's QR ticket to verify their exam entry.
        </p>
      </div>

      <div className="rounded-2xl p-6"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {isVerifying ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader2 size={36} className="animate-spin" style={{ color: BRAND }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Verifying ticket…</p>
          </div>
        ) : scanResult ? (
          <ScanResult result={scanResult} onReset={handleReset} />
        ) : (
          <ScannerWidget onScan={handleScan} disabled={isVerifying} />
        )}
      </div>
    </div>
  );
}
