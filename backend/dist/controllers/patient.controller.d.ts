import { Request, Response, NextFunction } from 'express';
export declare class PatientController {
    getAllPatients(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePatient(req: Request, res: Response, next: NextFunction): Promise<void>;
    addMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<void>;
    deletePatient(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPatientById(req: Request, res: Response, next: NextFunction): Promise<void>;
    registerPatient(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const patientController: PatientController;
