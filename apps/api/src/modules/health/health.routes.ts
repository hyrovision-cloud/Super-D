import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { isUsingMemoryDatabase } from '../../config/database';

const router = Router();

router.get('/live', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

router.get('/ready', (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const isConnected = dbState === 1;

  if (!isConnected) {
    res.status(503).json({
      status: 'unready',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    status: 'ready',
    database: 'connected',
    isInMemoryDatabase: isUsingMemoryDatabase(),
    timestamp: new Date().toISOString(),
  });
});

export const healthRoutes = router;
