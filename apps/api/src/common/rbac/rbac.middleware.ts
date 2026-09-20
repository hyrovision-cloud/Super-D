import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User must be authenticated before permission verification.');
    }

    const userPermissions = req.user.permissions || [];
    const isGlobalAdmin = req.user.roles.includes('Global Admin');
    const isOwner = req.user.roles.includes('Hospital Owner');

    // Super permissions
    if (isGlobalAdmin && permission !== 'owner.ai.view') {
      return next();
    }

    // Owner specific permission checks
    if (permission === 'owner.ai.view') {
      if (!isOwner || !userPermissions.includes('owner.ai.view')) {
        throw new ForbiddenError("Access restricted. The 'owner.ai.view' permission is required for Hospital Intelligence.");
      }
      return next();
    }

    const hasDirectPermission = userPermissions.includes(permission);
    const hasWildcard = userPermissions.some((p) => {
      if (p.endsWith('.*')) {
        const modulePrefix = p.slice(0, -2);
        return permission.startsWith(modulePrefix);
      }
      return false;
    });

    if (!hasDirectPermission && !hasWildcard) {
      throw new ForbiddenError(`Insufficient privileges. Missing required permission: '${permission}'.`);
    }

    next();
  };
}
