"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const isProd = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET || 'dev-fallback-secret-key-superd-hospital-2026';
if (isProd && (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('dev-fallback'))) {
    throw new Error('FATAL: A secure, cryptographically random JWT_SECRET must be set in production environment.');
}
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/superd_hospital_dev',
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
    FRONTEND_URL: (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, ''),
    AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:5001',
    isProduction: isProd,
    COOKIE_NAME: process.env.COOKIE_NAME || 'superd_auth_token',
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
    COOKIE_SECURE: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProd,
    COOKIE_SAMESITE: (process.env.COOKIE_SAMESITE || (isProd ? 'none' : 'lax')),
};
