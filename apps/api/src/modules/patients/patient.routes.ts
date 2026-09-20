import { Router } from 'express';
import { patientController } from './patient.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('patient.view'),
  enforceScope('OWN_BRANCH'),
  patientController.getAllPatients
);

router.post(
  '/',
  authenticate,
  requirePermission('patient.create'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('PATIENTS', 'REGISTER_PATIENT'),
  patientController.registerPatient
);

router.get(
  '/:patientId',
  authenticate,
  requirePermission('patient.view'),
  enforceScope('OWN_BRANCH'),
  patientController.getPatientById
);

router.patch(
  '/:patientId',
  authenticate,
  requirePermission('patient.update'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('PATIENTS', 'UPDATE_PATIENT'),
  patientController.updatePatient
);

router.get(
  '/:patientId/medical-records',
  authenticate,
  requirePermission('medical_record.view'),
  patientController.getMedicalRecords
);

router.post(
  '/:patientId/medical-records',
  authenticate,
  requirePermission('medical_record.create'),
  auditMiddleware('EMR', 'ADD_MEDICAL_RECORD'),
  patientController.addMedicalRecord
);

export const patientRoutes = router;
