// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optionally, render a spinner while checking auth state
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? (
    <>{children || <Outlet />}</> // Render children or Outlet if nested
  ) : (
    <Navigate to="/admin" replace /> // Redirect to login if not authenticated
  );
};

export default PrivateRoute;