export interface UploadOptions {
    folder: 'patients' | 'discharges' | 'complaints' | 'marketing' | 'receipts';
    allowedMimeTypes?: string[];
    maxSizeBytes?: number;
}
export interface UploadResult {
    fileId: string;
    url: string;
    mimeType: string;
    sizeBytes: number;
    fileName: string;
    uploadedAt: Date;
}
export interface IFileStorageService {
    uploadFile(buffer: Buffer, originalName: string, mimeType: string, options: UploadOptions): Promise<UploadResult>;
    getDownloadUrl(fileId: string, expiresInSeconds?: number): Promise<string>;
    deleteFile(fileId: string): Promise<boolean>;
}
export declare class LocalMockFileStorage implements IFileStorageService {
    uploadFile(_buffer: Buffer, originalName: string, mimeType: string, options: UploadOptions): Promise<UploadResult>;
    getDownloadUrl(fileId: string): Promise<string>;
    deleteFile(_fileId: string): Promise<boolean>;
}
export declare const fileStorageService: IFileStorageService;
