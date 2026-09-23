import { Request, Response, NextFunction } from 'express';
export declare function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void>;
export declare function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void;
