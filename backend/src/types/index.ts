import { Request } from 'express';
import { BranchId, RoleName } from '../config/constants';

export interface AuthenticatedUserPayload {
  userId: string;
  name: string;
  email: string;
  role: RoleName;
  roles: RoleName[];
  primaryBranchId: BranchId;
  assignedBranches: BranchId[];
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
      scopeFilter?: Record<string, any>;
      effectiveScope?: 'ORGANIZATION' | 'OWN_BRANCH' | 'ASSIGNED_RECORDS' | 'OWN_RECORDS';
      id?: string;
    }
  }
}
