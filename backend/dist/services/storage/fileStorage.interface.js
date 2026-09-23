"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileStorageService = exports.LocalMockFileStorage = void 0;
class LocalMockFileStorage {
    async uploadFile(_buffer, originalName, mimeType, options) {
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
    async getDownloadUrl(fileId) {
        return `https://storage.hospital-platform.local/download/${fileId}`;
    }
    async deleteFile(_fileId) {
        return true;
    }
}
exports.LocalMockFileStorage = LocalMockFileStorage;
exports.fileStorageService = new LocalMockFileStorage();
