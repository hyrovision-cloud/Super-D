import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { seedDatabase } from './seed/seedRunner';

async function bootstrap() {
  try {
    console.log(`====================================================`);
    console.log(`  Aarogya Hospital Management & Administration API  `);
    console.log(`  Environment: ${env.NODE_ENV} | Port: ${env.PORT}   `);
    console.log(`====================================================`);

    // 1. Connect to Database (with in-memory fallback)
    await connectDatabase();

    // 2. Seed Database with reconciled datasets
    await seedDatabase(env.FORCE_SEED);

    // 3. Start Listening
    const server = app.listen(env.PORT, () => {
      console.log(`[Server] Live and listening at http://localhost:${env.PORT}`);
      console.log(`[Server] Base API route: http://localhost:${env.PORT}/api/v1`);
      console.log(`[Server] Health check: http://localhost:${env.PORT}/api/v1/health/ready`);
    });

    const gracefulShutdown = () => {
      console.log('[Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] Closed remaining connections. Exiting.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (err) {
    console.error('[Server] Fatal bootstrap error:', err);
    process.exit(1);
  }
}

bootstrap();
