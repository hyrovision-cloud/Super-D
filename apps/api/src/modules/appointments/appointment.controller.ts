import { Request, Response, NextFunction } from 'express';
import { appointmentService } from './appointment.service';

export class AppointmentController {
  async getAllAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter: Record<string, any> = { ...req.scopeFilter };
      if (req.query.doctorId && req.query.doctorId !== 'all') {
        filter.doctorId = req.query.doctorId;
      }
      if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
      }
      if (req.query.date) {
        filter.date = req.query.date;
      }

      const appointments = await appointmentService.getAllAppointments(filter);
      res.json({
        data: appointments,
        meta: { totalItems: appointments.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAppointmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appt = await appointmentService.getAppointmentById(req.params.appointmentId);
      res.json({ data: appt, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async bookAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appt = await appointmentService.bookAppointment(req.body);
      res.status(201).json({ data: appt, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async transitionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, reason } = req.body;
      const appt = await appointmentService.transitionStatus(req.params.appointmentId, status, reason);
      res.json({ data: appt, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async rescheduleAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { newDate, newSlotTime, reason } = req.body;
      const appt = await appointmentService.rescheduleAppointment(
        req.params.appointmentId,
        newDate,
        newSlotTime,
        reason
      );
      res.json({ data: appt, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }
}

export const appointmentController = new AppointmentController();
