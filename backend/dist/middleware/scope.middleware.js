"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceScope = enforceScope;
const AppError_1 = require("../utils/AppError");
function enforceScope(defaultScope = 'OWN_BRANCH') {
    return (req, _res, next) => {
        const user = req.user;
        if (!user) {
            return next();
        }
        const hasOrgScope = user.permissions.includes('organization.view');
        const requestedBranch = (req.query.branchId ||
            req.headers['x-branch-context'] ||
            req.body?.branchId);
        if (hasOrgScope) {
            req.effectiveScope = 'ORGANIZATION';
            if (requestedBranch && requestedBranch !== 'all') {
                req.scopeFilter = { branchId: requestedBranch };
            }
            else {
                req.scopeFilter = {};
            }
            return next();
        }
        const allowedBranches = user.assignedBranches || [user.primaryBranchId];
        if (requestedBranch && requestedBranch !== 'all' && !allowedBranches.includes(requestedBranch)) {
            throw new AppError_1.ForbiddenError(`Cross-branch access violation. You do not have authorization to access records for branch '${requestedBranch}'.`);
        }
        if (defaultScope === 'ASSIGNED_RECORDS') {
            req.effectiveScope = 'ASSIGNED_RECORDS';
            req.scopeFilter = {
                branchId: { $in: allowedBranches },
                $or: [{ doctorId: user.userId }, { assignedTo: user.userId }],
            };
        }
        else if (defaultScope === 'OWN_RECORDS') {
            req.effectiveScope = 'OWN_RECORDS';
            req.scopeFilter = {
                $or: [{ createdBy: user.userId }, { employeeId: user.userId }, { userId: user.userId }],
            };
        }
        else {
            req.effectiveScope = 'OWN_BRANCH';
            if (requestedBranch && requestedBranch !== 'all') {
                req.scopeFilter = { branchId: requestedBranch };
            }
            else {
                req.scopeFilter = { branchId: { $in: allowedBranches } };
            }
        }
        next();
    };
}
