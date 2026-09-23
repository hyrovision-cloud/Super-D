import { Request, Response, NextFunction } from 'express';
export declare class AuditService {
    logEvent(params: {
        actorId: string;
        actorName: string;
        actorRole: string;
        action: string;
        module: string;
        recordId?: string;
        branchId?: string;
        ipAddress?: string;
        userAgent?: string;
        details?: Record<string, any>;
    }): Promise<void>;
}
export declare const auditService: AuditService;
export declare function auditMiddleware(moduleName: string, actionName: string): (req: Request, res: Response, next: NextFunction) => void;
