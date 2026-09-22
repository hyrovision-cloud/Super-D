import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType, SystemRole } from '@/types';
import { mockStore } from '@/services/mock/mockStore';
import { authApi } from '@/services/api/authApi';
import { canRoleAccessRoute } from '@/routes/rolePermissions';

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
    return (localStorage.getItem('superd_demo_role') as RoleType) || 'Super Admin';
  });

  useEffect(() => {
    const user = users.find((u) => u.role === currentRole) || users[0];
    if (user?.email) {
      authApi.login({ email: user.email, password: '•••' }).catch(() => {
        // Fallback gracefully
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
      localStorage.setItem('superd_demo_role', role);
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

  const canAccessRoute = (route: string): boolean => {
    return canRoleAccessRoute(currentRole, route);
  };

  const resetDemoData = () => {
    mockStore.resetToDefaults();
    setCurrentRole('Super Admin');
    localStorage.removeItem('superd_demo_role');
    localStorage.removeItem('superd_demo_selected_branch');
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
