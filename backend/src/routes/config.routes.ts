import { Router } from 'express';
import { configController } from '../controllers/config.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

export const configRoutes = Router();
configRoutes.use(authenticate);
configRoutes.get('/application', requirePermission('config.view'), configController.getApplication);
configRoutes.patch('/application', requirePermission('config.update'), configController.updateApplication);
