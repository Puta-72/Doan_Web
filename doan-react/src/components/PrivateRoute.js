import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
