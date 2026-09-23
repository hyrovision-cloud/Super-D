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
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    return httpClient.post<AuthenticatedUser>('/auth/login', credentials);
  },

  async logout(): Promise<{ loggedOut: boolean }> {
    return httpClient.post<{ loggedOut: boolean }>('/auth/logout');
  },

  async getMe(): Promise<AuthenticatedUser> {
    return httpClient.get<AuthenticatedUser>('/auth/me');
  },
};
