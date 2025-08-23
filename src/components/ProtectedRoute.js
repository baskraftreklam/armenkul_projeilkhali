import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;