"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
function errorHandler(err, req, res, _next) {
    const requestId = req.id || req.headers['x-request-id'];
    if (err instanceof AppError_1.AppError) {
        logger_1.logger.warn(`[AppError] ${err.code}: ${err.message}`, { path: req.path, requestId });
        return (0, response_1.sendError)(res, err.code, err.message, err.details, err.statusCode, requestId);
    }
    if (err instanceof zod_1.ZodError) {
        const fieldErrors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        logger_1.logger.warn(`[ValidationError] Schema mismatch on ${req.method} ${req.path}`, { fieldErrors });
        return (0, response_1.sendError)(res, 'VALIDATION_ERROR', 'Request validation failed.', fieldErrors, 400, requestId);
    }
    if (err.code === 11000) {
        const fields = Object.keys(err.keyPattern || {});
        return (0, response_1.sendError)(res, 'DUPLICATE_KEY', `A record with unique field(s) '${fields.join(', ')}' already exists.`, fields, 409, requestId);
    }
    if (err.name === 'CastError') {
        return (0, response_1.sendError)(res, 'INVALID_ID', `Invalid resource identifier format '${err.value}'.`, undefined, 400, requestId);
    }
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return (0, response_1.sendError)(res, 'INVALID_TOKEN', err.name === 'TokenExpiredError' ? 'Session expired. Please log in again.' : 'Invalid token signature.', undefined, 401, requestId);
    }
    logger_1.logger.error(`[UnhandledError] ${err.message}`, err);
    const message = env_1.env.isProduction ? 'Internal server error occurred.' : err.message || 'Unknown server error.';
    return (0, response_1.sendError)(res, 'INTERNAL_SERVER_ERROR', message, env_1.env.isProduction ? undefined : err.stack, 500, requestId);
}
function notFoundHandler(req, res) {
    return (0, response_1.sendError)(res, 'ROUTE_NOT_FOUND', `Endpoint ${req.method} ${req.originalUrl} not found on this server.`, undefined, 404, req.id);
}
