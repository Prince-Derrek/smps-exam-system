import React from 'react';
import { Loader2 } from 'lucide-react';

const BRAND = '#4A235A';

export default function DataTable({ columns, rows, loading, emptyIcon: EmptyIcon, emptyText }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Loader2 size={24} className="animate-spin" style={{ color: BRAND }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center py-16">
        {EmptyIcon && <EmptyIcon size={36} strokeWidth={1.25} className="mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />}
        <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{emptyText ?? 'No records found'}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <th key={col.key} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-muted)' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="transition-colors"
              style={{ borderBottom: '1px solid var(--border)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4" style={{ color: 'var(--text-body)' }}>
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
