import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authenticate } from '../../common/auth/auth.middleware';

const router = Router();

router.get('/', authenticate, notificationController.getUserNotifications);
router.post('/:notificationId/read', authenticate, notificationController.markAsRead);
router.post('/read-all', authenticate, notificationController.markAllAsRead);

export const notificationRoutes = router;
