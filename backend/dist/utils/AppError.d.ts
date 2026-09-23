export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    readonly details?: any;
    constructor(message: string, statusCode?: number, code?: string, details?: any);
}
export declare class NotFoundError extends AppError {
    constructor(entity: string, identifier?: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
