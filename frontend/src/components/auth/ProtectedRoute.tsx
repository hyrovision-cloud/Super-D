import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, canAccessRoute } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Unauthenticated users must authenticate
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 2. Permission metadata is evaluated from the backend-provided permission set.
  const isAllowed = canAccessRoute(location.pathname);
  if (!isAllowed) {
    return <Navigate to="/access-denied" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
