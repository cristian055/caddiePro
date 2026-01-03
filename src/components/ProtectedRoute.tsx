import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the appropriate page based on their role
    if (user.role === 'caddie') {
      return <Navigate to="/turns" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
