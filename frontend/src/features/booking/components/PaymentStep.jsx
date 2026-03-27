import React, { useState } from 'react';
import { Smartphone, Loader2, CheckCircle2, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

function formatCurrency(amount) {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

// Simulates the M-Pesa STK push flow with staged status updates
async function simulateMpesaFlow(onStatusChange) {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  onStatusChange('sending');
  await delay(1500);

  onStatusChange('waiting');
  await delay(3000);

  // 90% success rate in simulation
  if (Math.random() > 0.1) {
    onStatusChange('success');
    return {
      success: true,
      receiptNumber: `RGW${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      ticketId: crypto.randomUUID(),
    };
  } else {
    onStatusChange('failed');
    return { success: false };
  }
}

const statusMessages = {
  sending: 'Initiating M-Pesa STK push…',
  waiting: 'STK push sent. Enter your M-Pesa PIN on your phone.',
  success: 'Payment confirmed!',
  failed: 'Payment was not completed. Please try again.',
};

export default function PaymentStep({ unit, onPaymentSuccess, onBack }) {
  const [phone, setPhone] = useState('');
  const [payStatus, setPayStatus] = useState(null); // null | sending | waiting | success | failed
  const [error, setError] = useState('');

  const isProcessing = payStatus === 'sending' || payStatus === 'waiting';

  const validatePhone = (value) => {
    const cleaned = value.replace(/\s/g, '');
    return /^(07|01)\d{8}$/.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePhone(phone)) {
      setError('Enter a valid Kenyan mobile number (e.g. 0712 345 678).');
      return;
    }

    const result = await simulateMpesaFlow(setPayStatus);
    if (result.success) {
      onPaymentSuccess({ receiptNumber: result.receiptNumber, ticketId: result.ticketId });
    }
  };

  const handleRetry = () => {
    setPayStatus(null);
    setError('');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
        <p className="text-sm text-slate-500 mt-1">
          Complete your M-Pesa payment to confirm the booking.
        </p>
      </div>

      {/* Selected unit summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Selected Unit
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">{unit.unitTitle}</p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{unit.unitCode}</p>
          </div>
          <span className="text-lg font-bold text-slate-900">{formatCurrency(unit.standardFee)}</span>
        </div>
      </div>

      {/* Payment form */}
      {payStatus !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Smartphone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isProcessing}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} /> {error}
              </p>
            )}
          </div>

          {/* Status indicator */}
          {payStatus && payStatus !== 'failed' && (
            <div className={`flex items-center gap-2.5 p-3 rounded-lg text-sm ${
              payStatus === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {isProcessing && <Loader2 size={16} className="animate-spin flex-shrink-0" />}
              {payStatus === 'success' && <CheckCircle2 size={16} className="flex-shrink-0" />}
              <span>{statusMessages[payStatus]}</span>
            </div>
          )}

          {payStatus === 'failed' && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
              <XCircle size={16} className="flex-shrink-0" />
              <span>{statusMessages.failed}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={payStatus === 'failed' ? handleRetry : onBack}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <ArrowLeft size={15} />
              {payStatus === 'failed' ? 'Try Again' : 'Back'}
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing…
                </>
              ) : (
                `Pay Now · ${formatCurrency(unit.standardFee)}`
              )}
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            An STK push notification will be sent to your registered M-Pesa number.
            You have 60 seconds to enter your PIN.
          </p>
        </form>
      )}
    </div>
  );
}
