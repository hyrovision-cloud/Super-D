import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/User.model';
import { RoleModel } from '../models/Role.model';
import { AppError, UnauthorizedError } from '../utils/AppError';
import { env } from '../config/env';
import { AuthenticatedUserPayload } from '../types';
import { auditService } from './audit/audit.service';

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  permissions: string[];
  primaryBranchId: string;
  assignedBranches: string[];
  status: string;
}

export interface LoginResult {
  token: string;
  user: SafeUser;
}

export class AuthService {
  /**
   * Authenticate user with email, password, and optional rememberMe flag.
   */
  async login(
    email: string,
    passwordPlain: string,
    rememberMe: boolean = false,
    meta?: { ipAddress?: string; userAgent?: string }
  ): Promise<LoginResult> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      await auditService.logEvent({
        actorId: 'anonymous',
        actorName: 'Unknown User',
        actorRole: 'ANONYMOUS',
        action: 'LOGIN_FAILURE',
        module: 'AUTH',
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
        details: { email: normalizedEmail, reason: 'USER_NOT_FOUND' },
      });
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Account status check
    if (user.status === 'DISABLED' || user.status === 'SUSPENDED') {
      await auditService.logEvent({
        actorId: user._id.toString(),
        actorName: user.name,
        actorRole: user.role,
        action: 'LOGIN_FAILURE',
        module: 'AUTH',
        branchId: user.primaryBranchId,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
        details: { email: normalizedEmail, reason: `ACCOUNT_${user.status}` },
      });
      throw new AppError(
        'Your account has been suspended or disabled. Please contact administrator.',
        403,
        'ACCOUNT_DISABLED'
      );
    }

    if (user.status === 'INACTIVE' || user.status === 'PENDING') {
      await auditService.logEvent({
        actorId: user._id.toString(),
        actorName: user.name,
        actorRole: user.role,
        action: 'LOGIN_FAILURE',
        module: 'AUTH',
        branchId: user.primaryBranchId,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
        details: { email: normalizedEmail, reason: `ACCOUNT_${user.status}` },
      });
      throw new AppError(
        'Your account is inactive. Please complete account activation.',
        403,
        'ACCOUNT_INACTIVE'
      );
    }

    // Password verification
    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      await auditService.logEvent({
        actorId: user._id.toString(),
        actorName: user.name,
        actorRole: user.role,
        action: 'LOGIN_FAILURE',
        module: 'AUTH',
        branchId: user.primaryBranchId,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
        details: { email: normalizedEmail, reason: 'INVALID_PASSWORD' },
      });
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Resolve permissions from all assigned roles
    const userRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role];
    const roleDocs = await RoleModel.find({ name: { $in: userRoles } });
    const permissionSet = new Set<string>();
    roleDocs.forEach((r) => {
      (r.permissions || []).forEach((p) => permissionSet.add(p));
    });
    const permissions = Array.from(permissionSet);

    const assignedBranches =
      user.assignedBranches && user.assignedBranches.length > 0
        ? user.assignedBranches
        : [user.primaryBranchId];

    const payload: AuthenticatedUserPayload = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      roles: userRoles,
      primaryBranchId: user.primaryBranchId,
      assignedBranches,
      permissions,
    };

    const expiresIn = rememberMe ? '7d' : (env.JWT_EXPIRES_IN as any);
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn });

    user.lastLoginAt = new Date();
    await user.save();

    await auditService.logEvent({
      actorId: user._id.toString(),
      actorName: user.name,
      actorRole: user.role,
      action: 'LOGIN_SUCCESS',
      module: 'AUTH',
      branchId: user.primaryBranchId,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
      details: { email: normalizedEmail, rememberMe },
    });

    const safeUser: SafeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      roles: userRoles,
      permissions,
      primaryBranchId: user.primaryBranchId,
      assignedBranches,
      status: user.status,
    };

    return { token, user: safeUser };
  }

  /**
   * Retrieve fresh user data and permissions for the current session.
   */
  async getMe(userId: string): Promise<SafeUser> {
    const user = await UserModel.findById(userId);
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Session invalid or user account is no longer active.');
    }

    const userRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role];
    const roleDocs = await RoleModel.find({ name: { $in: userRoles } });
    const permissionSet = new Set<string>();
    roleDocs.forEach((r) => {
      (r.permissions || []).forEach((p) => permissionSet.add(p));
    });
    const permissions = Array.from(permissionSet);

    const assignedBranches =
      user.assignedBranches && user.assignedBranches.length > 0
        ? user.assignedBranches
        : [user.primaryBranchId];

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      roles: userRoles,
      permissions,
      primaryBranchId: user.primaryBranchId,
      assignedBranches,
      status: user.status,
    };
  }
}

export const authService = new AuthService();
