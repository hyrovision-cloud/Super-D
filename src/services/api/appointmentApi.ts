import { httpClient } from './httpClient';
import { Appointment } from '../../types';

export const appointmentApi = {
  async getAppointments(filters?: { branchId?: string; doctorId?: string; status?: string; date?: string }): Promise<Appointment[]> {
    return httpClient.get<Appointment[]>('/appointments', filters);
  },

  async bookAppointment(data: Partial<Appointment>): Promise<Appointment> {
    return httpClient.post<Appointment>('/appointments', data);
  },

  async transitionStatus(appointmentId: string, status: string, reason?: string): Promise<Appointment> {
    return httpClient.post<Appointment>(`/appointments/${appointmentId}/transition`, { status, reason });
  },

  async rescheduleAppointment(appointmentId: string, newDate: string, newSlotTime: string, reason: string): Promise<Appointment> {
    return httpClient.post<Appointment>(`/appointments/${appointmentId}/reschedule`, { newDate, newSlotTime, reason });
  },
};
