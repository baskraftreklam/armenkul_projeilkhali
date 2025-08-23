import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdminLoggedIn') === 'true';
  });

  useEffect(() => {
    if (isAdmin) {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
    } else {
      sessionStorage.removeItem('isAdminLoggedIn');
    }
  }, [isAdmin]);

  const login = (username, password) => {
    if (username === 'admin' && password === 'bas5561') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const value = { isAdmin, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};