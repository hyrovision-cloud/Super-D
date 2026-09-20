import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/AppError';
import { verifyToken, TokenUserPayload } from './token.service';

declare global {
  namespace Express {
    interface Request {
      user?: TokenUserPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication token is missing. Please provide a valid Bearer token.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken<TokenUserPayload>(token);
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Your session has expired. Please log in again.');
    }
    throw new UnauthorizedError('Invalid or corrupted authentication token.');
  }
}
