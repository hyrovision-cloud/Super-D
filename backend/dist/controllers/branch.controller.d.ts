import { Request, Response, NextFunction } from 'express';
export declare class BranchController {
    getAllBranches(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBranchById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBranchComparison(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const branchController: BranchController;
