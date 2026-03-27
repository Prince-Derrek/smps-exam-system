import React from 'react';

const variants = {
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  AwaitingPayment: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
  Paid: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
  Failed: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
  Consumed: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20',
};

const labels = {
  Pending: 'Pending',
  AwaitingPayment: 'Awaiting Payment',
  Paid: 'Paid',
  Failed: 'Failed',
  Consumed: 'Consumed',
};

export default function Badge({ status }) {
  const classes = variants[status] ?? 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20';
  const label = labels[status] ?? status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
