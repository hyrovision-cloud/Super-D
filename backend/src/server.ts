import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { seedAuthData } from './seed/seedAuth';
import { logger } from './utils/logger';

async function startServer() {
  try {
    // 1. Establish MongoDB connection (with error handling and graceful retry)
    try {
      await connectDatabase();
      await seedAuthData().catch((seedErr) => {
        logger.warn(`[Server] Auth seed deferred: ${seedErr.message}`);
      });
    } catch (dbErr: any) {
      logger.warn(`[Server] Continuing startup with database offline (${dbErr.message}). Health endpoint will report degraded.`);
    }

    // 2. Start HTTP listener
    const server = app.listen(env.PORT, () => {
      logger.info(`========================================================`);
      logger.info(` Super D Hospital Platform - Backend API Server Started `);
      logger.info(` Port:        ${env.PORT}                               `);
      logger.info(` Environment: ${env.NODE_ENV}                           `);
      logger.info(` Health:      http://localhost:${env.PORT}/health        `);
      logger.info(` Base API:    http://localhost:${env.PORT}/api/v1        `);
      logger.info(`========================================================`);
    });

    // 3. Graceful Process Termination Handlers
    const shutdown = async (signal: string) => {
      logger.info(`[Server] Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        logger.info('[Server] HTTP listener closed.');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown after 10s timeout
      setTimeout(() => {
        logger.error('[Server] Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error: any) {
    logger.error(`[Server] Failed to initialize backend server: ${error.message}`, error);
    process.exit(1);
  }
}

startServer();
