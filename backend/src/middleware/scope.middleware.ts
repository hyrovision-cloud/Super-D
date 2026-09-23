import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/AppError';
import { BranchId } from '../config/constants';

export function enforceScope(
  defaultScope: 'ORGANIZATION' | 'OWN_BRANCH' | 'ASSIGNED_RECORDS' | 'OWN_RECORDS' = 'OWN_BRANCH'
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      return next();
    }

    // Organization scope is an explicit database permission, not a role-name bypass.
    const hasOrgScope = user.permissions.includes('organization.view');

    const requestedBranch = (
      (req.query.branchId as string) ||
      (req.headers['x-branch-context'] as string) ||
      req.body?.branchId
    ) as BranchId | 'all' | undefined;

    if (hasOrgScope) {
      req.effectiveScope = 'ORGANIZATION';
      if (requestedBranch && requestedBranch !== 'all') {
        req.scopeFilter = { branchId: requestedBranch };
      } else {
        req.scopeFilter = {};
      }
      return next();
    }

    const allowedBranches = user.assignedBranches || [user.primaryBranchId];

    if (requestedBranch && requestedBranch !== 'all' && !allowedBranches.includes(requestedBranch)) {
      throw new ForbiddenError(
        `Cross-branch access violation. You do not have authorization to access records for branch '${requestedBranch}'.`
      );
    }

    if (defaultScope === 'ASSIGNED_RECORDS') {
      req.effectiveScope = 'ASSIGNED_RECORDS';
      req.scopeFilter = {
        branchId: { $in: allowedBranches },
        $or: [{ doctorId: user.userId }, { assignedTo: user.userId }],
      };
    } else if (defaultScope === 'OWN_RECORDS') {
      req.effectiveScope = 'OWN_RECORDS';
      req.scopeFilter = {
        $or: [{ createdBy: user.userId }, { employeeId: user.userId }, { userId: user.userId }],
      };
    } else {
      req.effectiveScope = 'OWN_BRANCH';
      if (requestedBranch && requestedBranch !== 'all') {
        req.scopeFilter = { branchId: requestedBranch };
      } else {
        req.scopeFilter = { branchId: { $in: allowedBranches } };
      }
    }

    next();
  };
}
