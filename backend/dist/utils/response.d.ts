import { Response } from 'express';
export interface StandardSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
    meta?: {
        total?: number;
        page?: number;
        pageSize?: number;
        requestId?: string;
        [key: string]: any;
    };
}
export interface StandardErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
        requestId?: string;
    };
}
export declare function sendSuccess<T = any>(res: Response, data: T, message?: string, statusCode?: number, meta?: Record<string, any>): Response;
export declare function sendError(res: Response, code: string, message: string, details?: any, statusCode?: number, requestId?: string): Response;
