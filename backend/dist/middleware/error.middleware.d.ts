import { Request, Response, NextFunction } from 'express';
export declare function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): Response;
export declare function notFoundHandler(req: Request, res: Response): Response;
