import { Employee, AttendanceRecord } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export const employeeService = {
  async getEmployees(branchId?: string): Promise<Employee[]> {
    let employees = [...mockStore.getState().employees];
    if (branchId && branchId !== 'all') {
      employees = employees.filter((e) => e.branchId === branchId);
    }
    return simulateDelay(employees);
  },

  async getAttendanceRecords(branchId?: string, date?: string): Promise<AttendanceRecord[]> {
    let attendance = [...mockStore.getState().attendance];
    if (branchId && branchId !== 'all') {
      attendance = attendance.filter((a) => a.branchId === branchId);
    }
    if (date) {
      attendance = attendance.filter((a) => a.date === date);
    }
    return simulateDelay(attendance);
  },
};
