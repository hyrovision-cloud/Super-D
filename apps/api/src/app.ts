import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { requestIdMiddleware } from './common/middleware/requestId.middleware';
import { errorHandler } from './common/middleware/error.middleware';

// Routes
import { healthRoutes } from './modules/health/health.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { branchRoutes } from './modules/branches/branch.routes';
import { roleRoutes } from './modules/roles/role.routes';
import { userRoutes } from './modules/users/user.routes';
import { patientRoutes } from './modules/patients/patient.routes';
import { appointmentRoutes } from './modules/appointments/appointment.routes';
import { employeeRoutes } from './modules/employees/employee.routes';
import { leaveRoutes } from './modules/leave/leave.routes';
import { complaintRoutes } from './modules/complaints/complaint.routes';
import { revenueRoutes } from './modules/revenue/revenue.routes';
import { notificationRoutes } from './modules/notifications/notification.routes';
import { ownerIntelligenceRoutes } from './modules/owner-intelligence/ownerIntelligence.routes';
import { auditRoutes } from './modules/audit/audit.routes';
import { knowledgeRoutes } from './modules/knowledge/knowledge.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(requestIdMiddleware);

// API Base Route
const apiRouter = express.Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/branches', branchRoutes);
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/patients', patientRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/employees', employeeRoutes);
apiRouter.use('/leave-requests', leaveRoutes);
apiRouter.use('/complaints', complaintRoutes);
apiRouter.use('/income-records', revenueRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/owner/intelligence', ownerIntelligenceRoutes);
apiRouter.use('/audit-logs', auditRoutes);
apiRouter.use('/knowledge', knowledgeRoutes);

app.use('/api/v1', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found on this server.`,
      requestId: req.id,
    },
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
