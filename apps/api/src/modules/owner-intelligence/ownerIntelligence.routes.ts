import { Router } from 'express';
import { ownerIntelligenceController } from './ownerIntelligence.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';

const router = Router();

// Owner AI Intelligence is strictly restricted to users with BOTH:
// permission: owner.ai.view AND scope: ORGANIZATION
router.post(
  '/query',
  authenticate,
  requirePermission('owner.ai.view'),
  enforceScope('ORGANIZATION'),
  ownerIntelligenceController.queryIntelligence
);

router.get(
  '/brief',
  authenticate,
  requirePermission('owner.ai.view'),
  enforceScope('ORGANIZATION'),
  ownerIntelligenceController.getExecutiveBrief
);

router.get(
  '/history',
  authenticate,
  requirePermission('owner.ai.view'),
  enforceScope('ORGANIZATION'),
  ownerIntelligenceController.getQueryHistory
);

export const ownerIntelligenceRoutes = router;
