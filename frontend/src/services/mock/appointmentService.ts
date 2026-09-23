import { Appointment, AppointmentStatus, DoctorProfile } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export interface AppointmentFilters {
  branchId?: string;
  doctorId?: string;
  status?: AppointmentStatus | 'ALL';
  date?: string;
}

export const appointmentService = {
  async getAppointments(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    let appointments = [...mockStore.getState().appointments];

    if (filters.branchId && filters.branchId !== 'all') {
      appointments = appointments.filter((a) => a.branchId === filters.branchId);
    }

    if (filters.doctorId && filters.doctorId !== 'all') {
      appointments = appointments.filter((a) => a.doctorId === filters.doctorId);
    }

    if (filters.status && filters.status !== 'ALL') {
      appointments = appointments.filter((a) => a.status === filters.status);
    }

    if (filters.date) {
      appointments = appointments.filter((a) => a.dateTime.startsWith(filters.date!));
    }

    return simulateDelay(appointments);
  },

  async getDoctors(branchId?: string): Promise<DoctorProfile[]> {
    let doctors = [...mockStore.getState().doctors];
    if (branchId && branchId !== 'all') {
      doctors = doctors.filter((d) => d.branchIds.includes(branchId));
    }
    return simulateDelay(doctors);
  },

  async bookAppointment(
    data: Omit<Appointment, '_id' | 'appointmentNumber'>
  ): Promise<Appointment> {
    const branch = mockStore.getState().branches.find((b) => b._id === data.branchId);
    const branchCode = branch ? branch.code.replace('BR-', '') : 'GEN';
    const randNum = Math.floor(100 + Math.random() * 900);
    const appointmentNumber = `APT-${branchCode}-24-${randNum}`;

    const appointment: Appointment = {
      ...data,
      _id: `apt-${Date.now()}`,
      appointmentNumber,
    };

    mockStore.setState((state) => ({
      ...state,
      appointments: [appointment, ...state.appointments],
    }));

    return simulateDelay(appointment);
  },

  async transitionStatus(
    appointmentId: string,
    status: AppointmentStatus,
    cancellationReason?: string
  ): Promise<Appointment> {
    let updated: Appointment | undefined;
    mockStore.setState((state) => {
      const appointments = state.appointments.map((a) => {
        if (a._id === appointmentId) {
          updated = {
            ...a,
            status,
            ...(cancellationReason ? { cancellationReason } : {}),
          };
          return updated;
        }
        return a;
      });
      return { ...state, appointments };
    });

    if (!updated) throw new Error('Appointment not found');
    return simulateDelay(updated);
  },

  async rescheduleAppointment(
    appointmentId: string,
    newDateTime: string,
    reason?: string
  ): Promise<Appointment> {
    let updated: Appointment | undefined;
    mockStore.setState((state) => {
      const appointments = state.appointments.map((a) => {
        if (a._id === appointmentId) {
          updated = {
            ...a,
            dateTime: newDateTime,
            status: 'SCHEDULED',
            notes: reason ? `${a.notes || ''} [Rescheduled: ${reason}]` : a.notes,
          };
          return updated;
        }
        return a;
      });
      return { ...state, appointments };
    });

    if (!updated) throw new Error('Appointment not found');
    return simulateDelay(updated);
  },
};
