import { Request, Response } from 'express';
import { isDatabaseConnected } from '../config/database';
import { env } from '../config/env';
import { sendSuccess } from '../utils/response';

export function getHealthStatus(_req: Request, res: Response): Response {
  const dbConnected = isDatabaseConnected();
  const uptimeSeconds = Math.floor(process.uptime());

  const status = {
    status: dbConnected ? 'healthy' : 'degraded',
    service: 'hospital-management-backend',
    version: '1.0.0',
    environment: env.NODE_ENV,
    database: {
      connected: dbConnected,
      type: 'MongoDB Atlas',
    },
    uptime: `${uptimeSeconds}s`,
    timestamp: new Date().toISOString(),
  };

  const statusCode = dbConnected ? 200 : 503;
  return sendSuccess(res, status, 'Health check completed.', statusCode);
}
