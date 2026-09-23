import { connectDatabase, disconnectDatabase } from '../config/database';
import { seedAuthData } from './seedAuth';
import { seedRealData, verifyRealData } from './seedRealData';
import { logger } from '../utils/logger';

async function run() {
  try {
    await connectDatabase();
    await seedAuthData();
    const counts = process.argv.includes('--verify-only') ? await verifyRealData() : await seedRealData();
    logger.info(`[Seed] Verified counts: ${JSON.stringify(counts)}`);
    logger.info('[RunSeed] Seeding completed successfully.');
    await disconnectDatabase();
    process.exit(0);
  } catch (err: any) {
    logger.error(`[RunSeed] Seeding failed: ${err.message}`, err);
    process.exit(1);
  }
}

run();
