"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const audit_service_1 = require("../services/audit/audit.service");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
class AuthController {
    async login(req, res, next) {
        try {
            const { email, password, rememberMe } = req.body;
            const result = await auth_service_1.authService.login(email, password, !!rememberMe, {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            });
            const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
            const cookieOptions = {
                httpOnly: true,
                secure: env_1.env.COOKIE_SECURE,
                sameSite: env_1.env.COOKIE_SAMESITE,
                maxAge,
                path: '/',
                ...(env_1.env.COOKIE_DOMAIN ? { domain: env_1.env.COOKIE_DOMAIN } : {}),
            };
            res.cookie(env_1.env.COOKIE_NAME, result.token, cookieOptions);
            (0, response_1.sendSuccess)(res, { ...result.user, token: result.token }, 'Login successful.');
        }
        catch (err) {
            next(err);
        }
    }
    async logout(req, res, next) {
        try {
            if (req.user) {
                await audit_service_1.auditService.logEvent({
                    actorId: req.user.userId,
                    actorName: req.user.name,
                    actorRole: req.user.role,
                    action: 'LOGOUT',
                    module: 'AUTH',
                    branchId: req.user.primaryBranchId,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                    details: { email: req.user.email },
                });
            }
            const clearOptions = {
                httpOnly: true,
                secure: env_1.env.COOKIE_SECURE,
                sameSite: env_1.env.COOKIE_SAMESITE,
                path: '/',
                ...(env_1.env.COOKIE_DOMAIN ? { domain: env_1.env.COOKIE_DOMAIN } : {}),
            };
            res.clearCookie(env_1.env.COOKIE_NAME, clearOptions);
            (0, response_1.sendSuccess)(res, { loggedOut: true }, 'Successfully logged out.');
        }
        catch (err) {
            next(err);
        }
    }
    async getMe(req, res, next) {
        try {
            if (!req.user || !req.user.userId) {
                throw new AppError_1.UnauthorizedError('Authentication session missing. Please log in.');
            }
            const freshUser = await auth_service_1.authService.getMe(req.user.userId);
            (0, response_1.sendSuccess)(res, freshUser, 'Current session retrieved.');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
