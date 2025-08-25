import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const signup = (userData) => {
    const userExists = users.find(user => user.email === userData.email);
    if (userExists) {
      alert('Bu e-posta adresi zaten kayıtlı.');
      return false;
    }
    // Dosya nesnesini localStorage'a kaydetmemek için siliyoruz.
    const { profilePictureFile, ...submissionData } = userData;
    
    const newUser = { id: Date.now(), ...submissionData };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const login = (email, password) => {
    if (email === 'admin' && password === 'bas5561') {
        const adminUser = { id: 'admin', name: 'Admin', email: 'admin', city: 'Samsun' };
        setCurrentUser(adminUser);
        return true;
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const deleteAccount = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    logout();
  };

  const updateUser = (userId, updatedData) => {
      const { profilePictureFile, ...submissionData } = updatedData;
      const updatedUsers = users.map(user => 
          user.id === userId ? { ...user, ...submissionData } : user
      );
      setUsers(updatedUsers);
      if (currentUser && currentUser.id === userId) {
          setCurrentUser(prev => ({ ...prev, ...submissionData }));
      }
  };

  const value = { 
    currentUser,
    isAdmin: currentUser ? true : false,
    signup,
    login,
    logout,
    deleteAccount,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};