import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

export const userRoutes = Router();
userRoutes.use(authenticate);
userRoutes.get('/', requirePermission('user.view'), adminController.listUsers);
userRoutes.post('/', requirePermission('user.create'), adminController.createUser);
userRoutes.patch('/:id', requirePermission('user.update'), adminController.updateUser);

export const roleRoutes = Router();
roleRoutes.use(authenticate);
roleRoutes.get('/', requirePermission('role.view'), adminController.listRoles);
roleRoutes.patch('/:id', requirePermission('role.update'), adminController.updateRole);
