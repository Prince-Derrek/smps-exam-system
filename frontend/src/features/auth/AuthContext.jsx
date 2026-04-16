import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Prevents rendering before auth check

  useEffect(() => {
    // 1. When the app loads or refreshes, immediately check Local Storage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      // 2. If token exists, restore the session state
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // 3. Mark loading as complete so the app can render
    setLoading(false);
  }, []);

  // Use this function when the user submits the Login form
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user info (name, reg number, etc)
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    // Optional: window.location.href = '/login';
  };

  // If we are still checking local storage, don't render the protected routes yet
  if (loading) {
    return null; // Or return a <Loader /> component here
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);