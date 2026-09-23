import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../validators/auth.validator';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', optionalAuthenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export const authRoutes = router;
