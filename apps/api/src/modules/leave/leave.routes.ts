import { Router } from 'express';
import { leaveController } from './leave.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('leave.view'),
  enforceScope('OWN_BRANCH'),
  leaveController.getAllLeaveRequests
);

router.post(
  '/',
  authenticate,
  requirePermission('leave.submit'),
  enforceScope('OWN_RECORDS'),
  auditMiddleware('LEAVE', 'SUBMIT_LEAVE'),
  leaveController.submitLeaveRequest
);

router.get(
  '/:requestId',
  authenticate,
  requirePermission('leave.view'),
  enforceScope('OWN_BRANCH'),
  leaveController.getLeaveRequestById
);

router.post(
  '/:requestId/decision',
  authenticate,
  requirePermission('leave.review'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('LEAVE', 'DECIDE_LEAVE'),
  leaveController.recordDecision
);

export const leaveRoutes = router;
