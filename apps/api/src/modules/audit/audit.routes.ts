import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('audit.view'),
  enforceScope('ORGANIZATION'),
  auditController.getAuditLogs
);

export const auditRoutes = router;
