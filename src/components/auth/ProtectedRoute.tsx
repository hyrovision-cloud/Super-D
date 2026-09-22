import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { canRoleAccessRoute } from '@/routes/rolePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentRole } = useAuth();
  const location = useLocation();

  const isAllowed = canRoleAccessRoute(currentRole, location.pathname);

  if (!isAllowed) {
    return <Navigate to="/access-denied" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
