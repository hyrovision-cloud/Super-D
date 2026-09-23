import { Router } from 'express';
import { patientController } from '../controllers/patient.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { enforceScope } from '../middleware/scope.middleware';
import { validate } from '../middleware/validate.middleware';
import { createPatientSchema, updatePatientSchema } from '../validators/patient.validator';
import { auditMiddleware } from '../services/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('patient.view'),
  enforceScope('OWN_BRANCH'),
  patientController.getAllPatients
);

router.patch(
  '/:patientId', authenticate, requirePermission('patient.update'), enforceScope('OWN_BRANCH'), validate(updatePatientSchema), auditMiddleware('PATIENTS', 'UPDATE_PATIENT'), patientController.updatePatient
);

router.delete(
  '/:patientId', authenticate, requirePermission('patient.delete'), enforceScope('OWN_BRANCH'), auditMiddleware('PATIENTS', 'DELETE_PATIENT'), patientController.deletePatient
);

router.post(
  '/:patientId/medical-records', authenticate, requirePermission('medical_record.create'), enforceScope('OWN_BRANCH'), auditMiddleware('PATIENTS', 'CREATE_MEDICAL_RECORD'), patientController.addMedicalRecord
);

router.post(
  '/',
  authenticate,
  requirePermission('patient.create'),
  enforceScope('OWN_BRANCH'),
  validate(createPatientSchema),
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

router.get(
  '/:patientId/records',
  authenticate,
  requirePermission('medical_record.view'),
  enforceScope('OWN_BRANCH'),
  patientController.getMedicalRecords
);

router.get(
  '/:patientId/medical-records',
  authenticate,
  requirePermission('medical_record.view'),
  enforceScope('OWN_BRANCH'),
  patientController.getMedicalRecords
);

export const patientRoutes = router;
