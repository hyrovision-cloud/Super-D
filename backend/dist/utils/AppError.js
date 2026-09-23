"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.ValidationError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    isOperational;
    details;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(entity, identifier) {
        super(identifier ? `${entity} with identifier '${identifier}' was not found.` : `${entity} not found.`, 404, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required. Please log in with valid credentials.') {
        super(message, 401, 'UNAUTHORIZED');
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Access denied. You do not have permission to access this resource or branch.') {
        super(message, 403, 'FORBIDDEN');
    }
}
exports.ForbiddenError = ForbiddenError;
class ValidationError extends AppError {
    constructor(message = 'Invalid request data provided.', details) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}
exports.ValidationError = ValidationError;
class ConflictError extends AppError {
    constructor(message = 'A record with these unique details already exists.') {
        super(message, 409, 'CONFLICT');
    }
}
exports.ConflictError = ConflictError;
