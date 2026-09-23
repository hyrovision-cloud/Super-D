import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/AppError';

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError('User session not authenticated.');
    }

    const hasPerm = user.permissions && user.permissions.includes(permission);
    if (!hasPerm) {
      throw new ForbiddenError(
        'You do not have permission to perform this action.'
      );
    }

    next();
  };
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError('User session not authenticated.');
    }

    const hasRole = user.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      throw new ForbiddenError(
        `Access restricted to roles: [${allowedRoles.join(', ')}].`
      );
    }

    next();
  };
}
