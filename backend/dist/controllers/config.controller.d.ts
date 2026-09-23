import { NextFunction, Request, Response } from 'express';
export declare const configController: {
    getApplication(_req: Request, res: Response, next: NextFunction): Promise<void>;
    updateApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
};
