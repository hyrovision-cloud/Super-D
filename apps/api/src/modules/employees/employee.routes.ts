import { Router } from 'express';
import { employeeController } from './employee.controller';
import { authenticate } from '../../common/auth/auth.middleware';
import { requirePermission } from '../../common/rbac/rbac.middleware';
import { enforceScope } from '../../common/scope/scope.middleware';
import { auditMiddleware } from '../../common/audit/audit.service';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('employee.view'),
  enforceScope('OWN_BRANCH'),
  employeeController.getAllEmployees
);

router.post(
  '/',
  authenticate,
  requirePermission('employee.create'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('EMPLOYEES', 'CREATE_EMPLOYEE'),
  employeeController.createEmployee
);

router.get(
  '/:employeeId',
  authenticate,
  requirePermission('employee.view'),
  enforceScope('OWN_BRANCH'),
  employeeController.getEmployeeById
);

router.patch(
  '/:employeeId',
  authenticate,
  requirePermission('employee.update'),
  enforceScope('OWN_BRANCH'),
  auditMiddleware('EMPLOYEES', 'UPDATE_EMPLOYEE'),
  employeeController.updateEmployee
);

export const employeeRoutes = router;
