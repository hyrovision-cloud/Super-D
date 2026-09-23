import { Request } from 'express';
export declare function recordAudit(req: Request, action: string, module: string, recordId?: string, branchId?: string, details?: Record<string, unknown>): Promise<void>;
