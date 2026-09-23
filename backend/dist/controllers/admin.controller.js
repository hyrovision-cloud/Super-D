"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../config/constants");
const Role_model_1 = require("../models/Role.model");
const User_model_1 = require("../models/User.model");
const AppError_1 = require("../utils/AppError");
const response_1 = require("../utils/response");
const safeUser = (user) => {
    const row = user.toObject ? user.toObject() : user;
    const { passwordHash: _passwordHash, ...safe } = row;
    return safe;
};
function validateBranches(branches) {
    if (!branches.length || branches.some((id) => !constants_1.BRANCH_IDS.includes(id)))
        throw new AppError_1.ValidationError('One or more branch assignments are invalid.');
}
exports.adminController = {
    async listUsers(_req, res, next) {
        try {
            (0, response_1.sendSuccess)(res, (await User_model_1.UserModel.find().sort({ name: 1 })).map(safeUser));
        }
        catch (e) {
            next(e);
        }
    },
    async createUser(req, res, next) {
        try {
            if (!req.user.permissions.includes('role.assign'))
                throw new AppError_1.ForbiddenError('You do not have permission to assign roles.');
            const role = await Role_model_1.RoleModel.findOne({ name: req.body.role });
            if (!role)
                throw new AppError_1.ValidationError('Assigned role does not exist.');
            const assignedBranches = req.body.assignedBranches || [req.body.primaryBranchId];
            validateBranches(assignedBranches);
            const user = await User_model_1.UserModel.create({ ...req.body, roles: [req.body.role], assignedBranches, passwordHash: await bcryptjs_1.default.hash(req.body.password, 10) });
            (0, response_1.sendSuccess)(res, safeUser(user), 'User created.', 201);
        }
        catch (e) {
            next(e);
        }
    },
    async updateUser(req, res, next) {
        try {
            const user = await User_model_1.UserModel.findById(req.params.id);
            if (!user)
                throw new AppError_1.NotFoundError('User', req.params.id);
            const roleChanged = req.body.role && req.body.role !== user.role;
            if (roleChanged && !req.user.permissions.includes('role.assign'))
                throw new AppError_1.ForbiddenError('You do not have permission to assign roles.');
            if (roleChanged && !(await Role_model_1.RoleModel.exists({ name: req.body.role })))
                throw new AppError_1.ValidationError('Assigned role does not exist.');
            if (req.body.assignedBranches)
                validateBranches(req.body.assignedBranches);
            if (req.body.primaryBranchId)
                validateBranches([req.body.primaryBranchId]);
            const allowed = ['name', 'phone', 'department', 'status', 'role', 'primaryBranchId', 'assignedBranches'];
            for (const key of allowed)
                if (req.body[key] !== undefined)
                    user[key] = req.body[key];
            if (roleChanged)
                user.roles = [req.body.role];
            await user.save();
            (0, response_1.sendSuccess)(res, safeUser(user), 'User updated.');
        }
        catch (e) {
            next(e);
        }
    },
    async listRoles(_req, res, next) {
        try {
            (0, response_1.sendSuccess)(res, await Role_model_1.RoleModel.find().sort({ name: 1 }).lean());
        }
        catch (e) {
            next(e);
        }
    },
    async updateRole(req, res, next) {
        try {
            const role = await Role_model_1.RoleModel.findById(req.params.id);
            if (!role)
                throw new AppError_1.NotFoundError('Role', req.params.id);
            if (req.body.permissions)
                role.permissions = [...new Set(req.body.permissions.map(String))];
            if (req.body.description !== undefined)
                role.description = req.body.description;
            await role.save();
            (0, response_1.sendSuccess)(res, role, 'Role permissions updated.');
        }
        catch (e) {
            next(e);
        }
    },
};
