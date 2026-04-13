import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../features/theme/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="p-2 rounded-lg transition-colors"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      {theme === 'light'
        ? <Moon size={16} strokeWidth={1.75} />
        : <Sun size={16} strokeWidth={1.75} />
      }
    </button>
  );
}
