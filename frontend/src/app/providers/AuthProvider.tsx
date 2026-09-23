import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType, SystemRole } from '@/types';
import { authApi, AuthenticatedUser, LoginCredentials } from '@/services/api/authApi';
import { canAccessRoute as permissionCanAccessRoute } from '@/routes/rolePermissions';

interface AuthContextType {
  currentUser: User;
  currentRole: RoleType;
  effectiveRole: SystemRole | undefined;
  permissions: string[];
  assignedBranches: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  users: User[];
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: RoleType) => void;
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapAuthUser(res: AuthenticatedUser): User {
  return {
    _id: res.id,
    name: res.name,
    email: res.email,
    employeeId: res.employeeId || 'EMP-001',
    role: res.role as RoleType,
    branchIds: res.assignedBranches && res.assignedBranches.length > 0 ? res.assignedBranches : [res.primaryBranchId],
    primaryBranchId: res.primaryBranchId || 'branch-trichy',
    status: (res.status as any) || 'ACTIVE',
    avatarUrl:
      res.avatarUrl ||
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    department: res.department || 'Hospital Administration',
    phone: res.phone || '+91 98401 12345',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<RoleType>('Super Admin');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [assignedBranches, setAssignedBranches] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from backend HttpOnly cookie on application launch
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const res = await authApi.getMe();
        if (!isMounted) return;
        const user = mapAuthUser(res);
        setCurrentUser(user);
        setCurrentRole(user.role);
        setPermissions(res.permissions || []);
        setAssignedBranches(res.assignedBranches || [res.primaryBranchId]);
        setIsAuthenticated(true);
      } catch {
        if (!isMounted) return;
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const res = await authApi.login(credentials);
    const user = mapAuthUser(res);
    setCurrentUser(user);
    setCurrentRole(user.role);
    setPermissions(res.permissions || []);
    setAssignedBranches(res.assignedBranches || [res.primaryBranchId]);
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setPermissions([]);
      setAssignedBranches([]);
    }
  };

  // Non-authoritative development role switcher (for previewing role UI in mock mode)
  const switchRole = (_role: RoleType) => {};

  const effectiveRole: SystemRole | undefined = undefined;

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const canAccessRoute = (route: string): boolean => {
    return permissionCanAccessRoute(permissions, route);
  };

  const resetDemoData = () => {
    logout();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#10b981] flex items-center justify-center shadow-lg shadow-cyan-500/25 mb-4 animate-pulse">
          <svg viewBox="0 0 32 32" className="w-9 h-9 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 28.5C15.6 28.5 15.2 28.3 14.9 28C8.5 21.6 4 17.5 4 12C4 7.5 7.5 4 12 4C14.3 4 16.5 5 18 6.7C19.5 5 21.7 4 24 4C28.5 4 32 7.5 32 12C32 17.5 27.5 21.6 21.1 28C20.8 28.3 20.4 28.5 20 28.5H16Z" />
            <rect x="14" y="9" width="4" height="10" rx="1" fill="#ffffff" />
            <rect x="11" y="12" width="10" height="4" rx="1" fill="#ffffff" />
          </svg>
        </div>
        <div className="text-white text-lg font-bold tracking-tight">Super D Management System</div>
        <p className="text-xs text-slate-400 mt-1">Verifying authenticated session...</p>
        <div className="mt-5 w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#0ea5e9] rounded-full animate-indeterminate"></div>
        </div>
      </div>
    );
  }

  const activeUser = currentUser as User;

  return (
    <AuthContext.Provider
      value={{
        currentUser: activeUser,
        currentRole,
        effectiveRole,
        permissions,
        assignedBranches,
        isAuthenticated,
        isLoading,
        users,
        login,
        logout,
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
