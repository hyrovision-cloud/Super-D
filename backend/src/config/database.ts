import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let isConnected = false;

export async function connectDatabase(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);

  // Monitor connection events
  mongoose.connection.on('connected', () => {
    isConnected = true;
    logger.info(`[MongoDB] Successfully connected to database: ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    logger.error(`[MongoDB] Database connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('[MongoDB] Database disconnected.');
  });

  try {
    logger.info(`[MongoDB] Initializing database connection in ${env.NODE_ENV} mode...`);

    const connection = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: !env.isProduction,
    });

    isConnected = true;
    return connection;
  } catch (error: any) {
    isConnected = false;
    logger.error(`[MongoDB] Fatal connection failure: ${error.message}`);
    // Graceful startup failure - do NOT boot with corrupted or fake state
    if (env.isProduction) {
      process.exit(1);
    }
    throw error;
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    logger.info('[MongoDB] Connection closed successfully.');
  }
}
