import React from 'react';

const variants = {
  Pending:        { bg: 'rgba(245,166,35,0.12)',  color: '#D4891A',  label: 'Pending' },
  AwaitingPayment:{ bg: 'rgba(26,107,58,0.08)',   color: '#1A6B3A',  label: 'Awaiting Payment' },
  Paid:           { bg: 'rgba(22,163,74,0.1)',    color: '#15803D',  label: 'Paid' },
  Failed:         { bg: 'rgba(220,38,38,0.08)',   color: '#DC2626',  label: 'Failed' },
  Consumed:       { bg: 'rgba(61,82,71,0.1)',     color: '#3D5247',  label: 'Consumed' },
};

export default function Badge({ status }) {
  const v = variants[status] ?? variants.Consumed;
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: v.bg, color: v.color }}>
      {v.label}
    </span>
  );
}
