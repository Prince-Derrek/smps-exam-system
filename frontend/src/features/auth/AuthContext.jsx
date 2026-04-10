import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // profile: { firstName/fullName, email, registrationNumber/staffNumber, role }
  const login = (token, profile) => {
    sessionStorage.setItem('smps_jwt', token);
    setUser(profile);
  };

  const logout = () => {
    sessionStorage.removeItem('smps_jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
