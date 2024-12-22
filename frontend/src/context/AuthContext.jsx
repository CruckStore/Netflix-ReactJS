import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || storedUser === 'undefined') {
        localStorage.removeItem('user'); // Supprime les données corrompues
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Erreur lors du parsing de user depuis localStorage :', error);
      localStorage.removeItem('user'); // Supprime les données corrompues
      return null;
    }
  });

  const login = (userData) => {
    if (!userData) {
      console.error('Données utilisateur invalides fournies à login');
      return;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
