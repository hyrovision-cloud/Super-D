import { Request, Response, NextFunction } from 'express';
import { employeeService } from './employee.service';

export class EmployeeController {
  async getAllEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter: Record<string, any> = { ...req.scopeFilter };
      if (req.query.department && req.query.department !== 'all') {
        filter.department = req.query.department;
      }
      if (req.query.role && req.query.role !== 'all') {
        filter.role = req.query.role;
      }
      if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
      }

      const employees = await employeeService.getAllEmployees(filter);
      res.json({
        data: employees,
        meta: { totalItems: employees.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getEmployeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const emp = await employeeService.getEmployeeById(req.params.employeeId);
      res.json({ data: emp, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const emp = await employeeService.createEmployee(req.body);
      res.status(201).json({ data: emp, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const emp = await employeeService.updateEmployee(req.params.employeeId, req.body);
      res.json({ data: emp, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }
}

export const employeeController = new EmployeeController();
