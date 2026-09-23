"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
const User_model_1 = require("../models/User.model");
const Role_model_1 = require("../models/Role.model");
async function authenticate(req, _res, next) {
    let token = req.cookies?.[env_1.env.COOKIE_NAME] || req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError_1.UnauthorizedError('Authentication session missing. Please log in.'));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        const user = await User_model_1.UserModel.findById(decoded.userId).lean();
        if (!user || user.status !== 'ACTIVE')
            throw new AppError_1.UnauthorizedError('Your account is not active.');
        const roleNames = user.roles?.length ? user.roles : [user.role];
        const roles = await Role_model_1.RoleModel.find({ name: { $in: roleNames } }).select('permissions').lean();
        req.user = {
            userId: String(user._id), name: user.name, email: user.email, role: user.role,
            roles: roleNames, primaryBranchId: user.primaryBranchId,
            assignedBranches: user.assignedBranches?.length ? user.assignedBranches : [user.primaryBranchId],
            permissions: [...new Set(roles.flatMap((role) => role.permissions))],
        };
        next();
    }
    catch (err) {
        if (err instanceof AppError_1.UnauthorizedError)
            return next(err);
        if (err.name === 'TokenExpiredError') {
            return next(new AppError_1.UnauthorizedError('Session expired. Please log in again.'));
        }
        return next(new AppError_1.UnauthorizedError('Invalid or expired authentication session. Please log in again.'));
    }
}
function optionalAuthenticate(req, _res, next) {
    let token = req.cookies?.[env_1.env.COOKIE_NAME] || req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            req.user = decoded;
        }
        catch {
        }
    }
    next();
}
