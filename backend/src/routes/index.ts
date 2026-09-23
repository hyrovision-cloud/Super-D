import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { authRoutes } from './auth.routes';
import { branchRoutes } from './branch.routes';
import { patientRoutes } from './patient.routes';
import { sendSuccess } from '../utils/response';
import { advertisementRoutes, appointmentRoutes, attendanceRoutes, complaintRoutes, dashboardRoutes, doctorRoutes, employeeRoutes, expenseRoutes, leadRoutes, leaveRoutes, notificationRoutes, revenueRoutes } from './operations.routes';
import { roleRoutes, userRoutes } from './admin.routes';
import { configRoutes } from './config.routes';

const apiRouter = Router();

// Mounted Functional Routes
apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/branches', branchRoutes);
apiRouter.use('/patients', patientRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/employees', employeeRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/leave-requests', leaveRoutes);
apiRouter.use('/complaints', complaintRoutes);
apiRouter.use('/revenue', revenueRoutes);
apiRouter.use('/expenses', expenseRoutes);
apiRouter.use('/advertisements', advertisementRoutes);
apiRouter.use('/leads', leadRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/config', configRoutes);

export default apiRouter;
