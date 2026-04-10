import React, { useState } from 'react';
import { Smartphone, Loader2, CheckCircle2, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const formatCurrency = (n) => `KES ${n.toLocaleString('en-KE')}`;

async function simulateMpesaFlow(onStatusChange) {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  onStatusChange('sending');
  await delay(1500);
  onStatusChange('waiting');
  await delay(3000);
  if (Math.random() > 0.1) {
    onStatusChange('success');
    return {
      success: true,
      receiptNumber: `RGW${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      ticketId: crypto.randomUUID(),
    };
  }
  onStatusChange('failed');
  return { success: false };
}

const statusMessages = {
  sending: 'Initiating M-Pesa STK push…',
  waiting: 'STK push sent. Enter your M-Pesa PIN on your phone.',
  success: 'Payment confirmed!',
  failed:  'Payment was not completed. Please try again.',
};

export default function PaymentStep({ unit, onPaymentSuccess, onBack }) {
  const [phone, setPhone] = useState('');
  const [payStatus, setPayStatus] = useState(null);
  const [error, setError] = useState('');

  const isProcessing = payStatus === 'sending' || payStatus === 'waiting';

  const validatePhone = (v) => /^(07|01)\d{8}$/.test(v.replace(/\s/g, ''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validatePhone(phone)) {
      setError('Enter a valid Kenyan mobile number (e.g. 0712 345 678).');
      return;
    }
    const result = await simulateMpesaFlow(setPayStatus);
    if (result.success) onPaymentSuccess({ receiptNumber: result.receiptNumber, ticketId: result.ticketId });
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px 10px 36px',
    border: '1.5px solid var(--border)', borderRadius: 8,
    fontSize: '0.9375rem', color: 'var(--text-heading)',
    background: 'var(--input-bg)', outline: 'none',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Payment Details</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Complete your M-Pesa payment to confirm the booking.
        </p>
      </div>

      {/* Unit summary */}
      <div className="rounded-xl p-4 mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2"
          style={{ color: 'var(--text-muted)' }}>Selected Unit</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
              {unit.unitTitle}
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {unit.unitCode}
            </p>
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>
            {formatCurrency(unit.standardFee)}
          </span>
        </div>
      </div>

      {payStatus !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5"
              style={{ color: 'var(--text-heading)' }}>
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Smartphone size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }} />
              <input type="tel" placeholder="0712 345 678" value={phone}
                onChange={(e) => setPhone(e.target.value)} disabled={isProcessing}
                style={{ ...inputStyle, opacity: isProcessing ? 0.6 : 1 }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,107,58,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {error && (
              <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                <AlertTriangle size={12} /> {error}
              </p>
            )}
          </div>

          {payStatus && payStatus !== 'failed' && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg text-sm"
              style={{
                background: payStatus === 'success' ? 'rgba(22,163,74,0.08)' : 'rgba(26,107,58,0.06)',
                border: `1px solid ${payStatus === 'success' ? 'rgba(22,163,74,0.2)' : 'rgba(26,107,58,0.15)'}`,
                color: payStatus === 'success' ? 'var(--success)' : 'var(--primary)',
              }}>
              {isProcessing && <Loader2 size={16} className="animate-spin flex-shrink-0" />}
              {payStatus === 'success' && <CheckCircle2 size={16} className="flex-shrink-0" />}
              <span>{statusMessages[payStatus]}</span>
            </div>
          )}

          {payStatus === 'failed' && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg text-sm"
              style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', color: 'var(--danger)' }}>
              <XCircle size={16} className="flex-shrink-0" />
              <span>{statusMessages.failed}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={payStatus === 'failed' ? () => setPayStatus(null) : onBack}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ border: '1.5px solid var(--border)', color: 'var(--text-body)', background: 'var(--card-bg)', opacity: isProcessing ? 0.5 : 1 }}>
              <ArrowLeft size={15} />
              {payStatus === 'failed' ? 'Try Again' : 'Back'}
            </button>

            <button type="submit" disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors"
              style={{ background: 'var(--primary)', opacity: isProcessing ? 0.6 : 1 }}>
              {isProcessing
                ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                : `Pay Now · ${formatCurrency(unit.standardFee)}`
              }
            </button>
          </div>

          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            An STK push notification will be sent to your M-Pesa number. You have 60 seconds to enter your PIN.
          </p>
        </form>
      )}
    </div>
  );
}
