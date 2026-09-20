import { EmployeeModel, IEmployee } from './employee.model';
import { NotFoundError } from '../../common/errors/AppError';

export class EmployeeService {
  async getAllEmployees(filter: Record<string, any> = {}): Promise<IEmployee[]> {
    return EmployeeModel.find(filter).sort({ name: 1 });
  }

  async getEmployeeById(employeeId: string): Promise<IEmployee> {
    const emp = await EmployeeModel.findOne({
      $or: [{ employeeId }, { employeeNumber: employeeId }, { _id: employeeId }],
    });
    if (!emp) {
      throw new NotFoundError('Employee', employeeId);
    }
    return emp;
  }

  async createEmployee(data: Partial<IEmployee>): Promise<IEmployee> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const employeeId = `EMP-${randomSuffix}`;
    const employeeNumber = `E-${randomSuffix}`;

    return EmployeeModel.create({
      ...data,
      employeeId,
      employeeNumber: data.employeeNumber || employeeNumber,
      status: data.status || 'ACTIVE',
    });
  }

  async updateEmployee(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee> {
    const emp = await EmployeeModel.findOneAndUpdate(
      { $or: [{ employeeId }, { employeeNumber: employeeId }, { _id: employeeId }] },
      { $set: data },
      { new: true }
    );
    if (!emp) {
      throw new NotFoundError('Employee', employeeId);
    }
    return emp;
  }
}

export const employeeService = new EmployeeService();
