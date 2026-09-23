import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/AppError';
import { AuthenticatedUserPayload } from '../types';
import { UserModel } from '../models/User.model';
import { RoleModel } from '../models/Role.model';

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  // 1. Try to extract token from HttpOnly cookie first
  let token: string | undefined = (req as any).cookies?.[env.COOKIE_NAME] || (req as any).cookies?.token;

  // 2. Fall back to Authorization Bearer header (for automated testing / CLI / mobile API clients)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('Authentication session missing. Please log in.'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUserPayload;
    const user = await UserModel.findById(decoded.userId).lean();
    if (!user || user.status !== 'ACTIVE') throw new UnauthorizedError('Your account is not active.');
    const roleNames = user.roles?.length ? user.roles : [user.role];
    const roles = await RoleModel.find({ name: { $in: roleNames } }).select('permissions').lean();
    req.user = {
      userId: String(user._id), name: user.name, email: user.email, role: user.role,
      roles: roleNames, primaryBranchId: user.primaryBranchId,
      assignedBranches: user.assignedBranches?.length ? user.assignedBranches : [user.primaryBranchId],
      permissions: [...new Set(roles.flatMap((role) => role.permissions))],
    };
    next();
  } catch (err: any) {
    if (err instanceof UnauthorizedError) return next(err);
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Session expired. Please log in again.'));
    }
    return next(new UnauthorizedError('Invalid or expired authentication session. Please log in again.'));
  }
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  let token: string | undefined = (req as any).cookies?.[env.COOKIE_NAME] || (req as any).cookies?.token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUserPayload;
      req.user = decoded;
    } catch {
      // Ignored for optional authentication
    }
  }

  next();
}
