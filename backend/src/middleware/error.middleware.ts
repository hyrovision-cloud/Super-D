import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  const requestId = req.id || req.headers['x-request-id'] as string;

  // 1. Handled Operational Errors
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.code}: ${err.message}`, { path: req.path, requestId });
    return sendError(res, err.code, err.message, err.details, err.statusCode, requestId);
  }

  // 2. Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    logger.warn(`[ValidationError] Schema mismatch on ${req.method} ${req.path}`, { fieldErrors });
    return sendError(res, 'VALIDATION_ERROR', 'Request validation failed.', fieldErrors, 400, requestId);
  }

  // 3. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    return sendError(
      res,
      'DUPLICATE_KEY',
      `A record with unique field(s) '${fields.join(', ')}' already exists.`,
      fields,
      409,
      requestId
    );
  }

  // 4. Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(
      res,
      'INVALID_ID',
      `Invalid resource identifier format '${err.value}'.`,
      undefined,
      400,
      requestId
    );
  }

  // 5. JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(
      res,
      'INVALID_TOKEN',
      err.name === 'TokenExpiredError' ? 'Session expired. Please log in again.' : 'Invalid token signature.',
      undefined,
      401,
      requestId
    );
  }

  // 6. Unhandled Internal Server Errors
  logger.error(`[UnhandledError] ${err.message}`, err);
  const message = env.isProduction ? 'Internal server error occurred.' : err.message || 'Unknown server error.';
  return sendError(res, 'INTERNAL_SERVER_ERROR', message, env.isProduction ? undefined : err.stack, 500, requestId);
}

export function notFoundHandler(req: Request, res: Response): Response {
  return sendError(
    res,
    'ROUTE_NOT_FOUND',
    `Endpoint ${req.method} ${req.originalUrl} not found on this server.`,
    undefined,
    404,
    req.id
  );
}
