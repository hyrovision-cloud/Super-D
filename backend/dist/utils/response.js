"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message, statusCode = 200, meta) {
    const payload = {
        success: true,
        data,
        ...(message && { message }),
        ...(meta && { meta }),
    };
    return res.status(statusCode).json(payload);
}
function sendError(res, code, message, details, statusCode = 500, requestId) {
    const payload = {
        success: false,
        error: {
            code,
            message,
            ...(details !== undefined && { details }),
            ...(requestId && { requestId }),
        },
    };
    return res.status(statusCode).json(payload);
}
