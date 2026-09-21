import { httpClient } from './httpClient';

export const authApi = {
  async login(credentials: { email: string; password?: string }) {
    const res = await httpClient.post('/auth/login', credentials);
    if (res.accessToken) {
      localStorage.setItem('superd_access_token', res.accessToken);
    }
    return res;
  },

  async logout() {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('superd_access_token');
    }
  },

  async getMe() {
    return httpClient.get('/auth/me');
  },

  async getEffectivePermissions() {
    return httpClient.get('/auth/effective-permissions');
  },
};
