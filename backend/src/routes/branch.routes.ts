import { Router } from 'express';
import { branchController } from '../controllers/branch.controller';
import { authenticate } from '../middleware/auth.middleware';
import { enforceScope } from '../middleware/scope.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

router.get('/', authenticate, requirePermission('branch.view'), enforceScope('OWN_BRANCH'), branchController.getAllBranches);
router.get('/comparison', authenticate, requirePermission('organization.view'), enforceScope('ORGANIZATION'), branchController.getBranchComparison);
router.get('/:id', authenticate, requirePermission('branch.view'), enforceScope('OWN_BRANCH'), branchController.getBranchById);

export const branchRoutes = router;
