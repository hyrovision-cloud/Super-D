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

export function sendSuccess<T = any>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  meta?: Record<string, any>
): Response {
  const payload: StandardSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  details?: any,
  statusCode: number = 500,
  requestId?: string
): Response {
  const payload: StandardErrorResponse = {
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
