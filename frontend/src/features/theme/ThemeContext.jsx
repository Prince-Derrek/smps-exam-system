import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('smps_theme') || 'light');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('smps_fontsize') || 'normal');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smps_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize);
    localStorage.setItem('smps_fontsize', fontSize);
  }, [fontSize]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
