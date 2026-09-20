import { RoleModel, IRole } from './role.model';
import { NotFoundError, ForbiddenError } from '../../common/errors/AppError';

export class RoleService {
  async getAllRoles(): Promise<IRole[]> {
    return RoleModel.find().sort({ isSystem: -1, name: 1 });
  }

  async getRoleById(roleId: string): Promise<IRole> {
    const role = await RoleModel.findOne({
      $or: [{ roleId }, { _id: roleId }],
    });
    if (!role) {
      throw new NotFoundError('Role', roleId);
    }
    return role;
  }

  async createRole(data: Partial<IRole>): Promise<IRole> {
    return RoleModel.create(data);
  }

  async updatePermissions(roleId: string, permissions: string[]): Promise<IRole> {
    const role = await this.getRoleById(roleId);
    role.permissions = permissions;
    return role.save();
  }
}

export const roleService = new RoleService();
