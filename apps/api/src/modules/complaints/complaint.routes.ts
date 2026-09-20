import { Router } from 'express';
import { complaintController } from './complaint.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('complaint.view'),
  enforceScope('OWN_BRANCH'),
  complaintController.getAllComplaints
);

router.post(
  '/',
  authenticate,
  requirePermission('complaint.create'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('COMPLAINTS', 'CREATE_COMPLAINT'),
  complaintController.createComplaint
);

router.get(
  '/:complaintId',
  authenticate,
  requirePermission('complaint.view'),
  enforceScope('OWN_BRANCH'),
  complaintController.getComplaintById
);

router.post(
  '/:complaintId/assign',
  authenticate,
  requirePermission('complaint.assign'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('COMPLAINTS', 'ASSIGN_COMPLAINT'),
  complaintController.assignComplaint
);

router.post(
  '/:complaintId/resolve',
  authenticate,
  requirePermission('complaint.resolve'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('COMPLAINTS', 'RESOLVE_COMPLAINT'),
  complaintController.resolveComplaint
);

export const complaintRoutes = router;
