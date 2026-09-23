import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
export declare function validate(schema: AnyZodObject): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
