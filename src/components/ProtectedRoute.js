// src/components/ProtectedRoute.js DOSYASININ DOĞRU İÇERİĞİ

import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAdmin) {
    // Kullanıcı admin değilse, onu /admin/login sayfasına yönlendir.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Kullanıcı admin ise, sarmaladığı alt bileşenleri (children) göster.
  return children;
}

export default ProtectedRoute;