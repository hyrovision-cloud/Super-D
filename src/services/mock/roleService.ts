import { SystemRole } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export const roleService = {
  async getAllRoles(): Promise<SystemRole[]> {
    const roles = mockStore.getState().roles;
    return simulateDelay(roles);
  },

  async updateRolePermissions(roleId: string, permissions: string[]): Promise<SystemRole> {
    let updated: SystemRole | undefined;
    mockStore.setState((state) => {
      const roles = state.roles.map((r) => {
        if (r._id === roleId) {
          updated = { ...r, permissions };
          return updated;
        }
        return r;
      });
      return { ...state, roles };
    });
    if (!updated) throw new Error('Role not found');
    return simulateDelay(updated);
  },
};
