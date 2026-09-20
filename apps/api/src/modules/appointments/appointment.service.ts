import mongoose from 'mongoose';
import { AppointmentModel, IAppointment } from './appointment.model';
import { NotFoundError, ConflictError, ValidationError } from '../../common/errors/AppError';
import { eventBus } from '../../common/events/eventBus';

export class AppointmentService {
  async getAllAppointments(filter: Record<string, any> = {}): Promise<IAppointment[]> {
    return AppointmentModel.find(filter).sort({ date: 1, slotTime: 1 });
  }

  async getAppointmentById(appointmentId: string): Promise<IAppointment> {
    const isObjectId = mongoose.Types.ObjectId.isValid(appointmentId);
    const query = isObjectId ? { $or: [{ appointmentId }, { _id: appointmentId }] } : { appointmentId };
    const appt = await AppointmentModel.findOne(query);
    if (!appt) {
      throw new NotFoundError('Appointment', appointmentId);
    }
    return appt;
  }

  async bookAppointment(data: Partial<IAppointment>): Promise<IAppointment> {
    // Check doctor conflict
    const activeStatuses = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION'];
    const conflict = await AppointmentModel.findOne({
      doctorId: data.doctorId,
      date: data.date,
      slotTime: data.slotTime,
      status: { $in: activeStatuses },
    });

    if (conflict) {
      throw new ConflictError(
        `Doctor ${data.doctorName || 'selected'} already has an active appointment at ${data.slotTime} on ${data.date}.`
      );
    }

    const appointmentId = `APT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newAppt = await AppointmentModel.create({
      ...data,
      appointmentId,
      status: data.status || 'SCHEDULED',
    });

    // Notify doctor and branch administrator
    await eventBus.dispatchNotification({
      recipientUserId: newAppt.doctorId,
      title: 'New Appointment Booked',
      message: `Patient ${newAppt.patientName} scheduled for ${newAppt.date} at ${newAppt.slotTime} (${newAppt.type}).`,
      type: 'APPOINTMENT',
      priority: 'MEDIUM',
      module: 'APPOINTMENTS',
      recordId: newAppt.appointmentId,
      branchId: newAppt.branchId,
    });

    return newAppt;
  }

  async transitionStatus(
    appointmentId: string,
    targetStatus: IAppointment['status'],
    reason?: string
  ): Promise<IAppointment> {
    const appt = await this.getAppointmentById(appointmentId);

    const validTransitions: Record<string, string[]> = {
      SCHEDULED: ['CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
      CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
      CHECKED_IN: ['IN_CONSULTATION', 'CANCELLED'],
      IN_CONSULTATION: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
      NO_SHOW: [],
    };

    const allowed = validTransitions[appt.status] || [];
    if (!allowed.includes(targetStatus)) {
      throw new ValidationError(
        `Illegal status transition from '${appt.status}' to '${targetStatus}'.`
      );
    }

    appt.status = targetStatus;
    if (targetStatus === 'CANCELLED' && reason) {
      appt.cancelReason = reason;
    }
    await appt.save();

    if (targetStatus === 'CANCELLED' || targetStatus === 'CHECKED_IN') {
      await eventBus.dispatchNotification({
        recipientUserId: appt.doctorId,
        title: `Appointment ${targetStatus === 'CANCELLED' ? 'Cancelled' : 'Patient Arrived'}`,
        message: `Patient ${appt.patientName} is now marked as ${targetStatus}.`,
        type: 'APPOINTMENT',
        priority: targetStatus === 'CANCELLED' ? 'HIGH' : 'MEDIUM',
        module: 'APPOINTMENTS',
        recordId: appt.appointmentId,
        branchId: appt.branchId,
      });
    }

    return appt;
  }

  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newSlotTime: string,
    reason: string
  ): Promise<IAppointment> {
    if (!reason || reason.trim().length < 3) {
      throw new ValidationError('A mandatory reason is required to reschedule an appointment.');
    }

    const appt = await this.getAppointmentById(appointmentId);

    // Check conflict at target date/slot
    const activeStatuses = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION'];
    const conflict = await AppointmentModel.findOne({
      doctorId: appt.doctorId,
      date: newDate,
      slotTime: newSlotTime,
      status: { $in: activeStatuses },
      appointmentId: { $ne: appt.appointmentId },
    });

    if (conflict) {
      throw new ConflictError(`Slot ${newSlotTime} on ${newDate} is already reserved.`);
    }

    appt.notes = `${appt.notes ? appt.notes + ' | ' : ''}Rescheduled from ${appt.date} ${appt.slotTime} to ${newDate} ${newSlotTime}. Reason: ${reason}`;
    appt.date = newDate;
    appt.slotTime = newSlotTime;
    appt.rescheduleReason = reason;
    appt.status = 'SCHEDULED';
    await appt.save();

    await eventBus.dispatchNotification({
      recipientUserId: appt.doctorId,
      title: 'Appointment Rescheduled',
      message: `Patient ${appt.patientName} moved to ${newDate} at ${newSlotTime}. Reason: ${reason}`,
      type: 'APPOINTMENT',
      priority: 'MEDIUM',
      module: 'APPOINTMENTS',
      recordId: appt.appointmentId,
      branchId: appt.branchId,
    });

    return appt;
  }
}

export const appointmentService = new AppointmentService();
