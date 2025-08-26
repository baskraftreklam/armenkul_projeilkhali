import React, { createContext, useState, useContext, useEffect } from 'react';
// Simülasyon için kullanıcı verilerini import ediyoruz
import mockData from '../data/db.json';

const AuthContext = createContext(null);

// Gerçek bir backend olmadığından, kullanıcıları buradan alıyoruz.
const users = mockData.users;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // --- GİRİŞ MANTIĞI EKLENDİ ---
  const login = (email, password) => {
    // Kullanıcıyı e-posta adresine göre bul
    const user = users.find(u => u.email === email);
    
    // Şimdilik şifre kontrolü yapmıyoruz, sadece e-posta yeterli.
    // Gerçek bir uygulamada burada şifre de kontrol edilmelidir.
    if (user) {
      setCurrentUser(user);
      return true; // Giriş başarılı
    }
    
    return false; // Kullanıcı bulunamadı, giriş başarısız
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const updateUser = (updatedData) => {
    if (currentUser) {
        const newUser = { ...currentUser, ...updatedData };
        setCurrentUser(newUser);
    }
  };
  
  const deleteAccount = (userId) => {
    console.log(`Kullanıcı ${userId} silindi.`);
    setCurrentUser(null);
  };

  const signup = (userData) => {
    // Bu simülasyonda yeni kayıtlı kullanıcıyı state'e eklemiyoruz,
    // sadece login/logout döngüsünü simüle ediyoruz.
    console.log("New user signed up:", userData);
    return true;
  };

  const value = {
    currentUser,
    // --- DEĞİŞİKLİK: isAdmin yerine daha esnek rol kontrolü ---
    isAdmin: currentUser ? (currentUser.role === 'admin' || currentUser.role === 'superadmin') : false,
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