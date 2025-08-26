import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SuperAdminRoute({ children }) {
  const { currentUser } = useAuth();
  let location = useLocation();

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // Eğer kullanıcı giriş yapmış ama rolü superadmin değilse, anasayfaya yönlendir.
  if (currentUser.role !== 'superadmin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default SuperAdminRoute;