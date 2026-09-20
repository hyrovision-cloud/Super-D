import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType, SystemRole } from '@/types';
import { mockStore } from '@/services/mock/mockStore';

import { authApi } from '@/services/api/authApi';

interface AuthContextType {
  currentUser: User;
  currentRole: RoleType;
  effectiveRole: SystemRole | undefined;
  users: User[];
  switchRole: (role: RoleType) => void;
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockStore.getState().users);
  const [roles, setRoles] = useState<SystemRole[]>(mockStore.getState().roles);

  const [currentRole, setCurrentRole] = useState<RoleType>(() => {
    return (localStorage.getItem('aarogya_demo_role') as RoleType) || 'Hospital Owner';
  });

  useEffect(() => {
    const user = users.find((u) => u.role === currentRole) || users[0];
    if (user?.email) {
      authApi.login({ email: user.email, password: '•••' }).catch(() => {
        // Fallback gracefully if backend is initializing
      });
    }
  }, [currentRole, users]);

  useEffect(() => {
    const unsubscribe = mockStore.subscribe(() => {
      setUsers(mockStore.getState().users);
      setRoles(mockStore.getState().roles);
    });
    return unsubscribe;
  }, []);

  const switchRole = (role: RoleType) => {
    setCurrentRole(role);
    try {
      localStorage.setItem('aarogya_demo_role', role);
    } catch {
      // ignore
    }
  };

  const currentUser =
    users.find((u) => u.role === currentRole) || users[0] || mockStore.getState().users[0];

  const effectiveRole = roles.find((r) => r.name === currentRole);

  const hasPermission = (permission: string): boolean => {
    if (!effectiveRole) return false;
    return effectiveRole.permissions.includes(permission);
  };

  // Check if current role can access a particular route
  const canAccessRoute = (route: string): boolean => {
    switch (route) {
      case '/dashboards/owner':
        return currentRole === 'Hospital Owner' || currentRole === 'Global Admin' || currentRole === 'Branch Manager';
      case '/dashboards/admin':
        return currentRole === 'Global Admin';
      case '/branches':
        return currentRole === 'Global Admin' || currentRole === 'Hospital Owner' || currentRole === 'Branch Manager';
      case '/users':
      case '/roles':
        return currentRole === 'Global Admin';
      case '/patients':
        return (
          currentRole === 'Receptionist' ||
          currentRole === 'Doctor' ||
          currentRole === 'Branch Manager' ||
          currentRole === 'Hospital Owner' ||
          currentRole === 'Global Admin'
        );
      case '/appointments':
        return (
          currentRole === 'Receptionist' ||
          currentRole === 'Doctor' ||
          currentRole === 'Branch Manager' ||
          currentRole === 'Hospital Owner' ||
          currentRole === 'Global Admin'
        );
      case '/employees':
        return (
          currentRole === 'HR Manager' ||
          currentRole === 'Branch Manager' ||
          currentRole === 'Hospital Owner' ||
          currentRole === 'Global Admin'
        );
      case '/leave':
        return (
          currentRole === 'HR Manager' ||
          currentRole === 'Branch Manager' ||
          currentRole === 'Doctor' ||
          currentRole === 'Hospital Owner' ||
          currentRole === 'Global Admin'
        );
      case '/complaints':
        return (
          currentRole === 'Complaints and Query Manager' ||
          currentRole === 'Branch Manager' ||
          currentRole === 'Hospital Owner' ||
          currentRole === 'Global Admin'
        );
      case '/marketing':
        return currentRole === 'Marketing Manager' || currentRole === 'Hospital Owner' || currentRole === 'Global Admin';
      case '/finance':
        return currentRole === 'Finance Manager' || currentRole === 'Hospital Owner' || currentRole === 'Global Admin';
      case '/reports':
        return (
          currentRole === 'Hospital Owner' ||
          currentRole === 'Finance Manager' ||
          currentRole === 'Global Admin' ||
          currentRole === 'Branch Manager'
        );
      default:
        return true;
    }
  };

  const resetDemoData = () => {
    mockStore.resetToDefaults();
    setCurrentRole('Hospital Owner');
    localStorage.removeItem('aarogya_demo_role');
    localStorage.removeItem('aarogya_demo_selected_branch');
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        effectiveRole,
        users,
        switchRole,
        hasPermission,
        canAccessRoute,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
