"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.isDatabaseConnected = isDatabaseConnected;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let isConnected = false;
async function connectDatabase() {
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default.connection.on('connected', () => {
        isConnected = true;
        logger_1.logger.info(`[MongoDB] Successfully connected to database: ${mongoose_1.default.connection.name}`);
    });
    mongoose_1.default.connection.on('error', (err) => {
        isConnected = false;
        logger_1.logger.error(`[MongoDB] Database connection error: ${err.message}`);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        isConnected = false;
        logger_1.logger.warn('[MongoDB] Database disconnected.');
    });
    try {
        logger_1.logger.info(`[MongoDB] Initializing database connection in ${env_1.env.NODE_ENV} mode...`);
        const connection = await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            autoIndex: !env_1.env.isProduction,
        });
        isConnected = true;
        return connection;
    }
    catch (error) {
        isConnected = false;
        logger_1.logger.error(`[MongoDB] Fatal connection failure: ${error.message}`);
        if (env_1.env.isProduction) {
            process.exit(1);
        }
        throw error;
    }
}
function isDatabaseConnected() {
    return isConnected && mongoose_1.default.connection.readyState === 1;
}
async function disconnectDatabase() {
    if (isConnected) {
        await mongoose_1.default.disconnect();
        logger_1.logger.info('[MongoDB] Connection closed successfully.');
    }
}
