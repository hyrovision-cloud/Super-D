import { Router } from 'express';
import { revenueController } from './revenue.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('revenue.view'),
  enforceScope('OWN_BRANCH'),
  revenueController.getAllIncomeRecords
);

router.post(
  '/',
  authenticate,
  requirePermission('revenue.create'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('REVENUE', 'RECORD_INCOME'),
  revenueController.recordIncome
);

router.get(
  '/:incomeId',
  authenticate,
  requirePermission('revenue.view'),
  enforceScope('OWN_BRANCH'),
  revenueController.getIncomeRecordById
);

router.post(
  '/:incomeId/adjustments',
  authenticate,
  requirePermission('revenue.correct'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('REVENUE', 'POST_ADJUSTMENT'),
  revenueController.recordAdjustment
);

export const revenueRoutes = router;
