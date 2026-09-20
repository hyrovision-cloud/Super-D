import { Router } from 'express';
import { appointmentController } from './appointment.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('appointment.view'),
  enforceScope('OWN_BRANCH'),
  appointmentController.getAllAppointments
);

router.post(
  '/',
  authenticate,
  requirePermission('appointment.create'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('APPOINTMENTS', 'BOOK_APPOINTMENT'),
  appointmentController.bookAppointment
);

router.get(
  '/:appointmentId',
  authenticate,
  requirePermission('appointment.view'),
  enforceScope('OWN_BRANCH'),
  appointmentController.getAppointmentById
);

router.post(
  '/:appointmentId/transition',
  authenticate,
  requirePermission('appointment.view'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('APPOINTMENTS', 'TRANSITION_STATUS'),
  appointmentController.transitionStatus
);

router.post(
  '/:appointmentId/reschedule',
  authenticate,
  requirePermission('appointment.reschedule'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('APPOINTMENTS', 'RESCHEDULE_APPOINTMENT'),
  appointmentController.rescheduleAppointment
);

export const appointmentRoutes = router;
