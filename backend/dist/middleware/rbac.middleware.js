"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
exports.requireRole = requireRole;
const AppError_1 = require("../utils/AppError");
function requirePermission(permission) {
    return (req, _res, next) => {
        const user = req.user;
        if (!user) {
            throw new AppError_1.UnauthorizedError('User session not authenticated.');
        }
        const hasPerm = user.permissions && user.permissions.includes(permission);
        if (!hasPerm) {
            throw new AppError_1.ForbiddenError('You do not have permission to perform this action.');
        }
        next();
    };
}
function requireRole(...allowedRoles) {
    return (req, _res, next) => {
        const user = req.user;
        if (!user) {
            throw new AppError_1.UnauthorizedError('User session not authenticated.');
        }
        const hasRole = user.roles.some((r) => allowedRoles.includes(r));
        if (!hasRole) {
            throw new AppError_1.ForbiddenError(`Access restricted to roles: [${allowedRoles.join(', ')}].`);
        }
        next();
    };
}
