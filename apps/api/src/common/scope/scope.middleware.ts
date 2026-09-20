import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/AppError';

declare global {
  namespace Express {
    interface Request {
      scopeFilter?: Record<string, any>;
      effectiveScope?: string;
    }
  }
}

export function enforceScope(defaultScope: 'ORGANIZATION' | 'OWN_BRANCH' | 'ASSIGNED_RECORDS' | 'OWN_RECORDS' = 'OWN_BRANCH') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      return next();
    }

    const isOwner = user.roles.includes('Hospital Owner');
    const isGlobalAdmin = user.roles.includes('Global Admin');
    const hasOrgScope = isOwner || isGlobalAdmin || defaultScope === 'ORGANIZATION';

    // Requested branch from header, query, or body
    const requestedBranch = (req.query.branchId as string) || 
                            (req.headers['x-branch-context'] as string) || 
                            req.body?.branchId;

    if (hasOrgScope) {
      req.effectiveScope = 'ORGANIZATION';
      if (requestedBranch && requestedBranch !== 'all' && requestedBranch !== 'All Branches') {
        req.scopeFilter = { branchId: requestedBranch };
      } else {
        req.scopeFilter = {};
      }
      return next();
    }

    // Non-org scope: must have assigned branches
    const allowedBranches = user.assignedBranches || [];

    if (requestedBranch && requestedBranch !== 'all' && !allowedBranches.includes(requestedBranch)) {
      throw new ForbiddenError(
        `Cross-branch access violation. You do not have authorization to view or modify records for branch '${requestedBranch}'.`
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
