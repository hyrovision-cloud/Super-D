import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('user.manage'),
  enforceScope('ORGANIZATION'),
  userController.getAllUsers
);

router.post(
  '/',
  authenticate,
  requirePermission('user.manage'),
  auditMiddleware('USERS', 'CREATE_USER'),
  userController.createUser
);

router.get(
  '/:userId',
  authenticate,
  requirePermission('user.manage'),
  userController.getUserById
);

router.post(
  '/:userId/activate',
  authenticate,
  requirePermission('user.manage'),
  auditMiddleware('USERS', 'ACTIVATE_USER'),
  userController.activateUser
);

router.post(
  '/:userId/disable',
  authenticate,
  requirePermission('user.manage'),
  auditMiddleware('USERS', 'DISABLE_USER'),
  userController.disableUser
);

router.post(
  '/:userId/revoke-sessions',
  authenticate,
  requirePermission('user.manage'),
  auditMiddleware('USERS', 'REVOKE_SESSIONS'),
  userController.revokeSessions
);

export const userRoutes = router;
