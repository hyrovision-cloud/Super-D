import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.id || 'unknown_req';

  // Handle known AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        fieldErrors: err.fieldErrors || [],
        requestId,
      },
    });
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Request payload validation failed.',
        fieldErrors,
        requestId,
      },
    });
    return;
  }

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    res.status(409).json({
      error: {
        code: 'DUPLICATE_KEY_ERROR',
        message: `A record with this ${field} already exists in the system.`,
        fieldErrors: [{ field, message: 'Must be unique.' }],
        requestId,
      },
    });
    return;
  }

  // Handle unhandled exceptions
  console.error(`[Unhandled Error] [${requestId}] ${req.method} ${req.originalUrl}:`, err);

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred. Please contact hospital system administration.' 
        : err.message || 'Internal Server Error',
      fieldErrors: [],
      requestId,
    },
  });
}
