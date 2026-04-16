import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { getAvailableUnits } from '../../../services/bookingService';

const formatCurrency = (n) => `KES ${n.toLocaleString('en-KE')}`;

export default function UnitSelectionStep({ onSelect }) {
  const [query, setQuery] = useState('');
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setIsLoading(true);
        const data = await getAvailableUnits();
        setUnits(data);
      } catch (err) {
        console.error("Failed to fetch units:", err);
        setError("Could not load available units. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const filtered = units.filter((u) =>
    u.unitTitle.toLowerCase().includes(query.toLowerCase()) ||
    u.unitCode.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Select an Exam Unit</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Choose the supplementary exam unit you wish to register for.
        </p>
      </div>

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search by unit code or title…"
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none transition"
          style={{ border: '1.5px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text-heading)' }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : error ? (
        <div className="text-red-500 text-center py-4 text-sm font-semibold">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12" style={{ color: 'var(--text-muted)' }}>
          <AlertCircle size={32} strokeWidth={1.5} className="mb-2 opacity-40" />
          <p className="text-sm">No units match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((unit) => (
            <div key={unit.id}
              onClick={() => onSelect(unit)}
              className="relative flex flex-col rounded-xl p-4 transition-all cursor-pointer"
              style={{ border: `1.5px solid var(--border)`, background: 'var(--card-bg)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,107,58,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <span className="inline-block text-xs font-mono font-bold px-2 py-0.5 rounded mb-2 self-start"
                style={{ background: 'rgba(26,107,58,0.08)', color: 'var(--primary)' }}>
                {unit.unitCode}
              </span>
              <p className="text-sm font-semibold leading-snug flex-1 mb-3" style={{ color: 'var(--text-heading)' }}>
                {unit.unitTitle}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-base font-bold" style={{ color: 'var(--text-heading)' }}>
                  {formatCurrency(unit.standardFee)}
                </span>
                <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>Select →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}