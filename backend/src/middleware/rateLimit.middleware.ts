import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 'RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again after 15 minutes.', undefined, 429);
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login attempts per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 'AUTH_RATE_LIMIT', 'Too many authentication attempts. Please try again later.', undefined, 429);
  },
});
