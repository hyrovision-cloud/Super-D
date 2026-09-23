import { httpClient } from './httpClient';

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  permissions: string[];
  primaryBranchId: string;
  assignedBranches: string[];
  status: string;
  avatarUrl?: string;
  department?: string;
  phone?: string;
  employeeId?: string;
  token?: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    const res = await httpClient.post<AuthenticatedUser>('/auth/login', credentials);
    if (res?.token && typeof window !== 'undefined') {
      localStorage.setItem('superd_auth_token', res.token);
    }
    return res;
  },

  async logout(): Promise<{ loggedOut: boolean }> {
    try {
      return await httpClient.post<{ loggedOut: boolean }>('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('superd_auth_token');
      }
    }
  },

  async getMe(): Promise<AuthenticatedUser> {
    return httpClient.get<AuthenticatedUser>('/auth/me');
  },
};
