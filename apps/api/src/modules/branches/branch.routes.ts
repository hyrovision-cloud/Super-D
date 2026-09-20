import { Router } from 'express';
import { branchController } from './branch.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  enforceScope('ORGANIZATION'),
  branchController.getAllBranches
);

router.get(
  '/:branchId',
  authenticate,
  enforceScope('OWN_BRANCH'),
  branchController.getBranchById
);

router.post(
  '/',
  authenticate,
  requirePermission('branch.manage'),
  auditMiddleware('BRANCH', 'CREATE_BRANCH'),
  branchController.createBranch
);

router.patch(
  '/:branchId',
  authenticate,
  requirePermission('branch.manage'),
  auditMiddleware('BRANCH', 'UPDATE_BRANCH'),
  branchController.updateBranch
);

export const branchRoutes = router;
