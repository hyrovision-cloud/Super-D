import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../common/auth/auth.middleware';

const router = Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.get('/effective-permissions', authenticate, authController.getEffectivePermissions);

export const authRoutes = router;
