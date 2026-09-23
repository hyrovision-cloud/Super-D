"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../models/User.model");
const Role_model_1 = require("../models/Role.model");
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const audit_service_1 = require("./audit/audit.service");
class AuthService {
    async login(email, passwordPlain, rememberMe = false, meta) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User_model_1.UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            await audit_service_1.auditService.logEvent({
                actorId: 'anonymous',
                actorName: 'Unknown User',
                actorRole: 'ANONYMOUS',
                action: 'LOGIN_FAILURE',
                module: 'AUTH',
                ipAddress: meta?.ipAddress,
                userAgent: meta?.userAgent,
                details: { email: normalizedEmail, reason: 'USER_NOT_FOUND' },
            });
            throw new AppError_1.AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
        }
        if (user.status === 'DISABLED' || user.status === 'SUSPENDED') {
            await audit_service_1.auditService.logEvent({
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
            throw new AppError_1.AppError('Your account has been suspended or disabled. Please contact administrator.', 403, 'ACCOUNT_DISABLED');
        }
        if (user.status === 'INACTIVE' || user.status === 'PENDING') {
            await audit_service_1.auditService.logEvent({
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
            throw new AppError_1.AppError('Your account is inactive. Please complete account activation.', 403, 'ACCOUNT_INACTIVE');
        }
        const isValid = await bcryptjs_1.default.compare(passwordPlain, user.passwordHash);
        if (!isValid) {
            await audit_service_1.auditService.logEvent({
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
            throw new AppError_1.AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
        }
        const userRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role];
        const roleDocs = await Role_model_1.RoleModel.find({ name: { $in: userRoles } });
        const permissionSet = new Set();
        roleDocs.forEach((r) => {
            (r.permissions || []).forEach((p) => permissionSet.add(p));
        });
        const permissions = Array.from(permissionSet);
        const assignedBranches = user.assignedBranches && user.assignedBranches.length > 0
            ? user.assignedBranches
            : [user.primaryBranchId];
        const payload = {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            roles: userRoles,
            primaryBranchId: user.primaryBranchId,
            assignedBranches,
            permissions,
        };
        const expiresIn = rememberMe ? '7d' : env_1.env.JWT_EXPIRES_IN;
        const token = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn });
        user.lastLoginAt = new Date();
        await user.save();
        await audit_service_1.auditService.logEvent({
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
        const safeUser = {
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
    async getMe(userId) {
        const user = await User_model_1.UserModel.findById(userId);
        if (!user || user.status !== 'ACTIVE') {
            throw new AppError_1.UnauthorizedError('Session invalid or user account is no longer active.');
        }
        const userRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role];
        const roleDocs = await Role_model_1.RoleModel.find({ name: { $in: userRoles } });
        const permissionSet = new Set();
        roleDocs.forEach((r) => {
            (r.permissions || []).forEach((p) => permissionSet.add(p));
        });
        const permissions = Array.from(permissionSet);
        const assignedBranches = user.assignedBranches && user.assignedBranches.length > 0
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
exports.AuthService = AuthService;
exports.authService = new AuthService();
