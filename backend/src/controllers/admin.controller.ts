import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { BRANCH_IDS } from '../config/constants';
import { RoleModel } from '../models/Role.model';
import { UserModel } from '../models/User.model';
import { ForbiddenError, NotFoundError, ValidationError } from '../utils/AppError';
import { sendSuccess } from '../utils/response';

const safeUser = (user: any) => {
  const row = user.toObject ? user.toObject() : user;
  const { passwordHash: _passwordHash, ...safe } = row;
  return safe;
};

function validateBranches(branches: string[]) {
  if (!branches.length || branches.some((id) => !BRANCH_IDS.includes(id as any))) throw new ValidationError('One or more branch assignments are invalid.');
}

export const adminController = {
  async listUsers(_req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, (await UserModel.find().sort({ name: 1 })).map(safeUser)); } catch (e) { next(e); }
  },
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user!.permissions.includes('role.assign')) throw new ForbiddenError('You do not have permission to assign roles.');
      const role = await RoleModel.findOne({ name: req.body.role });
      if (!role) throw new ValidationError('Assigned role does not exist.');
      const assignedBranches = req.body.assignedBranches || [req.body.primaryBranchId];
      validateBranches(assignedBranches);
      const user = await UserModel.create({ ...req.body, roles: [req.body.role], assignedBranches, passwordHash: await bcrypt.hash(req.body.password, 10) });
      sendSuccess(res, safeUser(user), 'User created.', 201);
    } catch (e) { next(e); }
  },
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) throw new NotFoundError('User', req.params.id);
      const roleChanged = req.body.role && req.body.role !== user.role;
      if (roleChanged && !req.user!.permissions.includes('role.assign')) throw new ForbiddenError('You do not have permission to assign roles.');
      if (roleChanged && !(await RoleModel.exists({ name: req.body.role }))) throw new ValidationError('Assigned role does not exist.');
      if (req.body.assignedBranches) validateBranches(req.body.assignedBranches);
      if (req.body.primaryBranchId) validateBranches([req.body.primaryBranchId]);
      const allowed = ['name', 'phone', 'department', 'status', 'role', 'primaryBranchId', 'assignedBranches'];
      for (const key of allowed) if (req.body[key] !== undefined) (user as any)[key] = req.body[key];
      if (roleChanged) user.roles = [req.body.role];
      await user.save();
      sendSuccess(res, safeUser(user), 'User updated.');
    } catch (e) { next(e); }
  },
  async listRoles(_req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await RoleModel.find().sort({ name: 1 }).lean()); } catch (e) { next(e); }
  },
  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await RoleModel.findById(req.params.id);
      if (!role) throw new NotFoundError('Role', req.params.id);
      if (req.body.permissions) role.permissions = [...new Set<string>((req.body.permissions as unknown[]).map(String))];
      if (req.body.description !== undefined) role.description = req.body.description;
      await role.save();
      sendSuccess(res, role, 'Role permissions updated.');
    } catch (e) { next(e); }
  },
};
