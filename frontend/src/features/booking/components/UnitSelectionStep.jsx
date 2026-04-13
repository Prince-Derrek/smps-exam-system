import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockExamUnits, bookedUnitIds } from '../../../utils/mockData';

const formatCurrency = (n) => `KES ${n.toLocaleString('en-KE')}`;

export default function UnitSelectionStep({ onSelect }) {
  const [query, setQuery] = useState('');

  const filtered = mockExamUnits.filter((u) =>
    u.unitTitle.toLowerCase().includes(query.toLowerCase()) ||
    u.unitCode.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>
          Select an Exam Unit
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Choose the supplementary exam unit you wish to register for.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search by unit code or title…"
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none transition"
          style={{
            border: '1.5px solid var(--border)', background: 'var(--input-bg)',
            color: 'var(--text-heading)',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,107,58,0.12)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12" style={{ color: 'var(--text-muted)' }}>
          <AlertCircle size={32} strokeWidth={1.5} className="mb-2 opacity-40" />
          <p className="text-sm">No units match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((unit) => {
            const alreadyBooked = bookedUnitIds.includes(unit.id);
            return (
              <div key={unit.id}
                className="relative flex flex-col rounded-xl p-4 transition-all"
                style={{
                  border: `1.5px solid var(--border)`,
                  background: alreadyBooked ? 'var(--surface)' : 'var(--card-bg)',
                  opacity: alreadyBooked ? 0.65 : 1,
                  cursor: alreadyBooked ? 'not-allowed' : 'pointer',
                }}
                onClick={() => !alreadyBooked && onSelect(unit)}
                onMouseEnter={(e) => { if (!alreadyBooked) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,107,58,0.12)'; }}}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {alreadyBooked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold"
                    style={{ color: 'var(--success)' }}>
                    <CheckCircle2 size={13} /> Booked
                  </div>
                )}

                <span className="inline-block text-xs font-mono font-bold px-2 py-0.5 rounded mb-2 self-start"
                  style={{ background: 'rgba(26,107,58,0.08)', color: 'var(--primary)' }}>
                  {unit.unitCode}
                </span>

                <p className="text-sm font-semibold leading-snug flex-1 mb-3"
                  style={{ color: 'var(--text-heading)' }}>
                  {unit.unitTitle}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-base font-bold" style={{ color: 'var(--text-heading)' }}>
                    {formatCurrency(unit.standardFee)}
                  </span>
                  {!alreadyBooked && (
                    <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                      Select →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
