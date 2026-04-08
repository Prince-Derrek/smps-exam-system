import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockExamUnits, bookedUnitIds } from '../../../utils/mockData';

function formatCurrency(amount) {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export default function UnitSelectionStep({ onSelect }) {
  const [query, setQuery] = useState('');

  const filtered = mockExamUnits.filter(
    (u) =>
      u.unitTitle.toLowerCase().includes(query.toLowerCase()) ||
      u.unitCode.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Select an Exam Unit</h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose the supplementary exam unit you wish to register for.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search by unit code or title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Unit cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-slate-400">
          <AlertCircle size={32} strokeWidth={1.5} className="mb-2" />
          <p className="text-sm">No units match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((unit) => {
            const alreadyBooked = bookedUnitIds.includes(unit.id);
            return (
              <div
                key={unit.id}
                className={`relative flex flex-col rounded-xl border p-4 transition-all ${
                  alreadyBooked
                    ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md cursor-pointer group'
                }`}
                onClick={() => !alreadyBooked && onSelect(unit)}
              >
                {/* Already booked indicator */}
                {alreadyBooked && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-green-600">
                    <CheckCircle2 size={13} />
                    Booked
                  </div>
                )}

                <span className="inline-block text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mb-2 self-start">
                  {unit.unitCode}
                </span>

                <p className="text-sm font-semibold text-slate-900 leading-snug flex-1 mb-3 group-hover:text-blue-700 transition-colors">
                  {unit.unitTitle}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-base font-bold text-slate-800">
                    {formatCurrency(unit.standardFee)}
                  </span>
                  {!alreadyBooked && (
                    <span className="text-xs font-medium text-blue-600 group-hover:underline">
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
