import { Request, Response, NextFunction, CookieOptions } from 'express';
import { authService } from '../services/auth.service';
import { auditService } from '../services/audit/audit.service';
import { sendSuccess } from '../utils/response';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/AppError';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, rememberMe } = req.body;
      const result = await authService.login(email, password, !!rememberMe, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string,
      });

      // Production-grade secure HttpOnly cookie
      const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAMESITE,
        maxAge,
        path: '/',
        ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
      };

      res.cookie(env.COOKIE_NAME, result.token, cookieOptions);

      // Return safe user payload (also attach token for API clients/integration tests)
      sendSuccess(res, { ...result.user, token: result.token }, 'Login successful.');
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        await auditService.logEvent({
          actorId: req.user.userId,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: 'LOGOUT',
          module: 'AUTH',
          branchId: req.user.primaryBranchId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] as string,
          details: { email: req.user.email },
        });
      }

      const clearOptions: CookieOptions = {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAMESITE,
        path: '/',
        ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
      };

      res.clearCookie(env.COOKIE_NAME, clearOptions);
      sendSuccess(res, { loggedOut: true }, 'Successfully logged out.');
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError('Authentication session missing. Please log in.');
      }

      const freshUser = await authService.getMe(req.user.userId);
      sendSuccess(res, freshUser, 'Current session retrieved.');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
