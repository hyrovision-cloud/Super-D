import { Router } from 'express';
import { roleController } from './role.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get('/', authenticate, roleController.getAllRoles);
router.get('/permissions', authenticate, roleController.getPermissionsCatalog);
router.get('/:roleId', authenticate, roleController.getRoleById);

router.put(
  '/:roleId/permissions',
  authenticate,
  requirePermission('permission.manage'),
  auditMiddleware('ROLES', 'UPDATE_PERMISSIONS'),
  roleController.updateRolePermissions
);

export const roleRoutes = router;
