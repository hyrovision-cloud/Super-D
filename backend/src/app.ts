import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { getHealthStatus } from './controllers/health.controller';
import apiRouter from './routes';

const app = express();

// Secure HTTP Headers
app.use(helmet());

// Strict CORS: No wildcard '*' in production
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || !env.isProduction) {
        return callback(null, true);
      }
      const normalizedOrigin = origin.replace(/\/+$/, '');
      const isAllowed = allowedOrigins.some((o) => o.replace(/\/+$/, '') === normalizedOrigin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: Origin ${origin} not permitted.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Branch-Context', 'X-Request-Id'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));


// Assign unique Request-ID
app.use((req, res, next) => {
  req.id = (req.headers['x-request-id'] as string) || uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Root Health Check (Used for Render / Cloud monitoring)
app.get('/health', getHealthStatus);

// API v1 Routing with Rate Limiting
app.use('/api/v1', apiLimiter, apiRouter);

// 404 Route Catch-all
app.use(notFoundHandler);

// Centralized Error Handling
app.use(errorHandler);

export default app;
