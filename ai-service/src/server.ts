import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`[AI Microservice] Running on port ${env.PORT}`);
  console.log(`[AI Microservice] Health check: http://localhost:${env.PORT}/health`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
