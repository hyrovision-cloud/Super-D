import { SystemRole } from '@/types';
import { httpClient } from '@/services/api/httpClient';

const mapRole = (row: any): SystemRole => ({ ...row, _id: String(row._id), isSystem: Boolean(row.isSystemRole), dataScope: row.dataScope || 'OWN_BRANCH' });

// Compatibility import path; role permissions are read and written through the API.
export const roleService = {
  async getAllRoles(): Promise<SystemRole[]> { return (await httpClient.get<any[]>('/roles')).map(mapRole); },
  async updateRolePermissions(roleId: string, permissions: string[]): Promise<SystemRole> { return mapRole(await httpClient.patch<any>(`/roles/${roleId}`, { permissions })); },
};
