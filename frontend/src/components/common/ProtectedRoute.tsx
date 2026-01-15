import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerified?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'member'], 
  requireVerified = false,
  adminOnly = false
}) => {
  const { state } = useAuth();
  const location = useLocation();

  // If loading, show a loading indicator
  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin only is required but user is not admin
  if (adminOnly && state.user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If role is not allowed, redirect to home
  if (allowedRoles && !allowedRoles.includes(state.user?.role)) {
    return <Navigate to="/" replace />;
  }

  // If verification is required but user is not verified
  if (requireVerified && state.user?.status !== 'verified') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;