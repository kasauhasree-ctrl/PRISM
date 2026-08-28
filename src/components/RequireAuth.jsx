import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export const RequireAuth = ({ children }) => {
  const { authenticated, checking } = useAuth();
  const loc = useLocation();
  if (checking) return null; // or a spinner
  if (!authenticated) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
};

export default RequireAuth;
