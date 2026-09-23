import { Request, Response, NextFunction } from 'express';
export declare function enforceScope(defaultScope?: 'ORGANIZATION' | 'OWN_BRANCH' | 'ASSIGNED_RECORDS' | 'OWN_RECORDS'): (req: Request, _res: Response, next: NextFunction) => void;
