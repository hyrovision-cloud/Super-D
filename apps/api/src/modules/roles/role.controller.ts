import { Request, Response, NextFunction } from 'express';
import { roleService } from './role.service';

export const PERMISSION_CATALOG = [
  // Patients
  { key: 'patient.view', module: 'Patients', description: 'View patient records and search patient directory' },
  { key: 'patient.create', module: 'Patients', description: 'Register new walk-in and emergency patients' },
  { key: 'patient.update', module: 'Patients', description: 'Update patient demographics and status' },
  { key: 'patient.archive', module: 'Patients', description: 'Archive inactive patient records' },
  // Medical records
  { key: 'medical_record.view', module: 'EMR', description: 'View clinical consultation notes and history' },
  { key: 'medical_record.create', module: 'EMR', description: 'Author clinical consultation notes and diagnoses' },
  // Appointments
  { key: 'appointment.view', module: 'Appointments', description: 'View doctor appointment schedules and slots' },
  { key: 'appointment.create', module: 'Appointments', description: 'Book new appointments' },
  { key: 'appointment.reschedule', module: 'Appointments', description: 'Reschedule or cancel appointments' },
  // Workforce
  { key: 'employee.view', module: 'Employees', description: 'View employee directory and credentials' },
  { key: 'employee.create', module: 'Employees', description: 'Onboard new hospital employees' },
  { key: 'employee.update', module: 'Employees', description: 'Update employee designation and department' },
  { key: 'attendance.view', module: 'Attendance', description: 'View daily attendance logs' },
  { key: 'attendance.record', module: 'Attendance', description: 'Record daily attendance punches' },
  { key: 'attendance.correct', module: 'Attendance', description: 'Supervised attendance correction' },
  // Leave
  { key: 'leave.view', module: 'Leave', description: 'View leave requests and approvals' },
  { key: 'leave.submit', module: 'Leave', description: 'Submit leave and permission requests' },
  { key: 'leave.review', module: 'Leave', description: 'Managerial review of leave requests' },
  { key: 'leave.final_approve', module: 'Leave', description: 'Final approval or rejection of leave' },
  // Complaints
  { key: 'complaint.view', module: 'Complaints', description: 'View patient and attendant grievances' },
  { key: 'complaint.create', module: 'Complaints', description: 'Log new complaints and queries' },
  { key: 'complaint.assign', module: 'Complaints', description: 'Assign complaints to investigation officers' },
  { key: 'complaint.resolve', module: 'Complaints', description: 'Resolve complaints and record corrective actions' },
  { key: 'complaint.view_confidential', module: 'Complaints', description: 'Access sensitive and confidential grievances' },
  // Marketing
  { key: 'marketing.view', module: 'Marketing', description: 'View marketing campaigns and digital content metrics' },
  { key: 'marketing.manage', module: 'Marketing', description: 'Create campaigns and track advertisements' },
  { key: 'lead.manage', module: 'Marketing', description: 'Manage patient leads and enquiries' },
  // Revenue
  { key: 'revenue.view', module: 'Revenue', description: 'View financial ledger and category collections' },
  { key: 'revenue.create', module: 'Revenue', description: 'Record new income and cashier receipts' },
  { key: 'revenue.correct', module: 'Revenue', description: 'Post financial adjustments and receipt reversals' },
  { key: 'revenue.export', module: 'Revenue', description: 'Export financial reports and tax ledgers' },
  // System & Admin
  { key: 'user.manage', module: 'Administration', description: 'Manage user credentials, status and sessions' },
  { key: 'role.manage', module: 'Administration', description: 'Create and configure organizational roles' },
  { key: 'permission.manage', module: 'Administration', description: 'Modify role permission matrices' },
  { key: 'branch.manage', module: 'Administration', description: 'Manage branch locations and facilities' },
  { key: 'report.view', module: 'Reports', description: 'View operational and executive reports' },
  { key: 'audit.view', module: 'Audit', description: 'Inspect append-only security and mutation audit logs' },
  // Owner Intelligence
  { key: 'owner.ai.view', module: 'Owner Intelligence', description: 'Access Owner AI Revenue Command Center (Hospital Intelligence)' },
];

export class RoleController {
  async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await roleService.getAllRoles();
      res.json({
        data: roles,
        meta: { totalItems: roles.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await roleService.getRoleById(req.params.roleId);
      res.json({ data: role, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async updateRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { permissions } = req.body;
      const updated = await roleService.updatePermissions(req.params.roleId, permissions || []);
      res.json({ data: updated, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async getPermissionsCatalog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        data: PERMISSION_CATALOG,
        meta: { totalItems: PERMISSION_CATALOG.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const roleController = new RoleController();
