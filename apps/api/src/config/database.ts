import mongoose from 'mongoose';
import { env } from './env';

let isMemoryServer = false;

export async function connectDatabase(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${env.MONGODB_URI}...`);
    // Try connecting with a short timeout to fail fast if no local mongo daemon is running
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to external MongoDB successfully: ${conn.connection.host}`);
    return conn;
  } catch (err: any) {
    console.warn(`[Database] Could not connect to external MongoDB (${err.message}).`);
    console.log(`[Database] Initializing in-memory MongoDB server for demo environment...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      isMemoryServer = true;

      const conn = await mongoose.connect(uri);
      console.log(`[Database] Connected to embedded in-memory MongoDB: ${uri}`);
      return conn;
    } catch (memErr: any) {
      console.error(`[Database] Failed to start in-memory MongoDB:`, memErr);
      throw memErr;
    }
  }
}

export function isUsingMemoryDatabase(): boolean {
  return isMemoryServer;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
