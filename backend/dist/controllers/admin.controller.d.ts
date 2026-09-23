import { NextFunction, Request, Response } from 'express';
export declare const adminController: {
    listUsers(_req: Request, res: Response, next: NextFunction): Promise<void>;
    createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    listRoles(_req: Request, res: Response, next: NextFunction): Promise<void>;
    updateRole(req: Request, res: Response, next: NextFunction): Promise<void>;
};
