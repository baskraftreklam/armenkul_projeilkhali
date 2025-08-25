import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = (username, password) => {
    if (username === 'admin' && password === 'bas5561') {
      // --- ANA KULLANICI PROFİLİ TEST VERİLERİYLE DOLDURULDU ---
      const userData = {
        id: 1,
        name: 'Alihan Tellioğlu',
        email: 'info@armenkul.com',
        officeName: 'Armenkul Emlak - Merkez Ofis',
        city: 'Samsun',
        phone: '0555 123 45 67',
        socialInstagram: 'https://www.instagram.com/alihan.tellioglu/',
        socialFacebook: 'https://facebook.com',
        socialYoutube: 'https://youtube.com',
        profilePicture: 'https://i.pravatar.cc/150?u=1',
      };
      setCurrentUser(userData);
      return true;
    }
    // Test için ikinci bir kullanıcı da ekleyebilirsiniz.
    // if (username === 'test' && password === 'test') { ... }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (userId, updatedData) => {
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...updatedData
      }));
    }
  };
  
  const deleteAccount = (userId) => {
    console.log(`Kullanıcı ${userId} silindi.`);
    setCurrentUser(null);
  };

  const signup = (userData) => {
    console.log("Yeni kullanıcı kaydı:", userData);
    const newUser = {
      id: Date.now(),
      ...userData
    };
    setCurrentUser(newUser);
    return true;
  };

  const value = {
    currentUser,
    isAdmin: !!currentUser,
    login,
    logout,
    updateUser,
    deleteAccount,
    signup
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