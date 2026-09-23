/**
 * File Storage Service Abstraction
 * Supports AWS S3, Cloudinary, or Google Cloud Storage.
 * Prevents storing binary blobs/large documents directly in MongoDB.
 */

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

/**
 * Local development fallback storage implementation
 */
export class LocalMockFileStorage implements IFileStorageService {
  async uploadFile(_buffer: Buffer, originalName: string, mimeType: string, options: UploadOptions): Promise<UploadResult> {
    const fileId = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return {
      fileId,
      url: `https://storage.hospital-platform.local/${options.folder}/${fileId}-${originalName}`,
      mimeType,
      sizeBytes: _buffer.length,
      fileName: originalName,
      uploadedAt: new Date(),
    };
  }

  async getDownloadUrl(fileId: string): Promise<string> {
    return `https://storage.hospital-platform.local/download/${fileId}`;
  }

  async deleteFile(_fileId: string): Promise<boolean> {
    return true;
  }
}

export const fileStorageService: IFileStorageService = new LocalMockFileStorage();
