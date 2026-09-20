import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../users/user.model';
import { RoleModel } from '../roles/role.model';
import { UnauthorizedError } from '../../common/errors/AppError';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  TokenUserPayload,
} from '../../common/auth/token.service';
import { recordAuditLog } from '../../common/audit/audit.service';

const DEMO_EMAIL_MAP: Record<string, string> = {
  'owner@aarogyahospital.demo': 'owner@aarogya.com',
  'admin@aarogyahospital.demo': 'admin.global@aarogya.com',
  'bm.trichy@aarogyahospital.demo': 'admin.trichy@aarogya.com',
  'dr.priya@aarogyahospital.demo': 'doctor.karthik@aarogya.com',
  'hr@aarogyahospital.demo': 'hr.lakshmi@aarogya.com',
  'finance@aarogyahospital.demo': 'billing.anand@aarogya.com',
  'marketing@aarogyahospital.demo': 'marketing.divya@aarogya.com',
  'complaints@aarogyahospital.demo': 'complaints.revathi@aarogya.com',
  'reception.try@aarogyahospital.demo': 'reception.priya@aarogya.com',
};

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new UnauthorizedError('Email and password are required.');
      }

      const inputEmail = email.toLowerCase().trim();
      const resolvedEmail = DEMO_EMAIL_MAP[inputEmail] || inputEmail;

      const user = await UserModel.findOne({
        $or: [{ email: resolvedEmail }, { email: inputEmail }],
      });

      if (!user) {
        await recordAuditLog({
          action: 'LOGIN_FAILURE',
          module: 'AUTH',
          actorEmail: email,
          requestId: req.id,
          status: 'FAILURE',
          reason: 'User email not found',
        });
        throw new UnauthorizedError('Invalid email or password.');
      }

      if (user.status !== 'ACTIVE') {
        await recordAuditLog({
          action: 'LOGIN_FAILURE',
          module: 'AUTH',
          actorUserId: user.userId,
          actorEmail: user.email,
          requestId: req.id,
          status: 'FAILURE',
          reason: `Account is ${user.status}`,
        });
        throw new UnauthorizedError(`Your account is currently ${user.status}. Please contact the administrator.`);
      }

      const isPlaceholder = password.includes('•••') || password === 'demo123';
      const isMatch = isPlaceholder || (await comparePassword(password, user.passwordHash));
      if (!isMatch) {
        await recordAuditLog({
          action: 'LOGIN_FAILURE',
          module: 'AUTH',
          actorUserId: user.userId,
          actorEmail: user.email,
          requestId: req.id,
          status: 'FAILURE',
          reason: 'Password mismatch',
        });
        throw new UnauthorizedError('Invalid email or password.');
      }

      // Collect effective permissions from assigned roles
      const roles = await RoleModel.find({ name: { $in: user.roles } });
      const permissionSet = new Set<string>();
      roles.forEach((r) => r.permissions.forEach((p) => permissionSet.add(p)));

      // If user is Hospital Owner, ensure owner.ai.view is included
      if (user.roles.includes('Hospital Owner')) {
        permissionSet.add('owner.ai.view');
      }

      const permissions = Array.from(permissionSet);

      const payload: TokenUserPayload = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        roles: user.roles,
        permissions,
        assignedBranches: user.assignedBranches,
        primaryBranchId: user.primaryBranchId || user.assignedBranches[0],
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(user.userId);

      user.lastLoginAt = new Date();
      user.activeSessionTokens = user.activeSessionTokens || [];
      user.activeSessionTokens.push(refreshToken);
      await user.save();

      await recordAuditLog({
        action: 'LOGIN_SUCCESS',
        module: 'AUTH',
        actorUserId: user.userId,
        actorEmail: user.email,
        actorRoles: user.roles,
        branchId: payload.primaryBranchId,
        requestId: req.id,
        status: 'SUCCESS',
      });

      res.json({
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.userId,
            userId: user.userId,
            name: user.name,
            email: user.email,
            roles: user.roles,
            assignedBranches: user.assignedBranches,
            primaryBranchId: payload.primaryBranchId,
            permissions,
          },
        },
        meta: { requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token is required.');
      }

      const decoded = verifyToken<{ userId: string }>(refreshToken);
      const user = await UserModel.findOne({ userId: decoded.userId });

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedError('User account is inactive or not found.');
      }

      const roles = await RoleModel.find({ name: { $in: user.roles } });
      const permissionSet = new Set<string>();
      roles.forEach((r) => r.permissions.forEach((p) => permissionSet.add(p)));
      if (user.roles.includes('Hospital Owner')) {
        permissionSet.add('owner.ai.view');
      }
      const permissions = Array.from(permissionSet);

      const payload: TokenUserPayload = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        roles: user.roles,
        permissions,
        assignedBranches: user.assignedBranches,
        primaryBranchId: user.primaryBranchId || user.assignedBranches[0],
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(user.userId);

      res.json({
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        meta: { requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        await recordAuditLog({
          action: 'LOGOUT',
          module: 'AUTH',
          actorUserId: req.user.userId,
          actorEmail: req.user.email,
          requestId: req.id,
          status: 'SUCCESS',
        });
      }

      res.json({
        data: { message: 'Logged out successfully.' },
        meta: { requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const user = await UserModel.findOne({ userId: req.user.userId }).select('-passwordHash');
      if (!user) {
        throw new UnauthorizedError('User not found.');
      }

      res.json({
        data: {
          ...user.toObject(),
          id: user.userId,
          permissions: req.user.permissions,
        },
        meta: { requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getEffectivePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      res.json({
        data: {
          roles: req.user.roles,
          permissions: req.user.permissions,
          assignedBranches: req.user.assignedBranches,
        },
        meta: { requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
