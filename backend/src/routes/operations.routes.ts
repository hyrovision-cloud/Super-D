import { Router } from 'express';
import { operationsController as c } from '../controllers/operations.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { enforceScope } from '../middleware/scope.middleware';

function resource(viewPermission: string, createPermission: string, updatePermission: string, handlers: { list: any; create: any; update?: any }, scope: 'ORGANIZATION' | 'OWN_BRANCH' | 'OWN_RECORDS' = 'OWN_BRANCH') {
  const r = Router();
  r.use(authenticate);
  r.get('/', requirePermission(viewPermission), enforceScope(scope), handlers.list);
  r.post('/', requirePermission(createPermission), enforceScope(scope), handlers.create);
  if (handlers.update) r.patch('/:id', requirePermission(updatePermission), enforceScope(scope), handlers.update);
  return r;
}

export const appointmentRoutes = resource('appointment.view', 'appointment.create', 'appointment.update', { list: c.appointments, create: c.createAppointment, update: c.updateAppointment });
export const employeeRoutes = resource('employee.view', 'employee.create', 'employee.update', { list: c.employees, create: c.createEmployee, update: c.updateEmployee });
export const doctorRoutes = resource('appointment.view', 'employee.create', 'employee.update', { list: (req: any, res: any, next: any) => { req.query.status ||= 'ACTIVE'; req.scopeFilter = { ...(req.scopeFilter || {}), role: 'Doctor' }; return c.doctors(req, res, next); }, create: c.createEmployee });
export const attendanceRoutes = Router();
attendanceRoutes.use(authenticate);
attendanceRoutes.get('/', requirePermission('attendance.view'), enforceScope('OWN_BRANCH'), c.attendance);
attendanceRoutes.post('/', requirePermission('attendance.mark'), enforceScope('OWN_BRANCH'), c.createAttendance);
attendanceRoutes.patch('/:id', requirePermission('attendance.update'), enforceScope('OWN_BRANCH'), c.updateAttendance);
attendanceRoutes.delete('/:id', requirePermission('attendance.delete'), enforceScope('OWN_BRANCH'), c.archiveAttendance);
export const leaveRoutes = resource('leave.view', 'leave.request', 'leave.approve', { list: c.leave, create: c.createLeave, update: c.updateLeave }, 'OWN_BRANCH');
export const complaintRoutes = resource('complaint.view', 'complaint.create', 'complaint.update', { list: c.complaints, create: c.createComplaint, update: c.updateComplaint });
export const revenueRoutes = resource('revenue.view', 'revenue.create', 'revenue.update', { list: c.revenue, create: c.createRevenue, update: c.updateRevenue });
export const expenseRoutes = resource('expense.view', 'expense.create', 'expense.update', { list: c.expenses, create: c.createExpense, update: c.updateExpense });
export const advertisementRoutes = resource('advertisement.view', 'advertisement.create', 'advertisement.update', { list: c.advertisements, create: c.createAdvertisement, update: c.updateAdvertisement });
export const leadRoutes = resource('lead.view', 'lead.create', 'lead.update', { list: c.leads, create: c.createLead, update: c.updateLead });

export const notificationRoutes = Router();
notificationRoutes.use(authenticate);
notificationRoutes.get('/', requirePermission('notification.view'), c.notifications);
notificationRoutes.patch('/read-all', requirePermission('notification.view'), c.markAllNotificationsRead);
notificationRoutes.patch('/:id/read', requirePermission('notification.view'), c.markNotificationRead);

export const dashboardRoutes = Router();
dashboardRoutes.use(authenticate);
dashboardRoutes.get('/finance/summary', requirePermission('revenue.view'), enforceScope('OWN_BRANCH'), c.financeSummary);
dashboardRoutes.get('/owner/summary', requirePermission('dashboard.owner.view'), enforceScope('ORGANIZATION'), c.ownerSummary);
dashboardRoutes.get('/owner/branches', requirePermission('dashboard.owner.view'), enforceScope('ORGANIZATION'), c.financeSummary);
