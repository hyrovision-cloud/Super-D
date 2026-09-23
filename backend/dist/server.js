"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const seedAuth_1 = require("./seed/seedAuth");
const logger_1 = require("./utils/logger");
async function startServer() {
    try {
        try {
            await (0, database_1.connectDatabase)();
            await (0, seedAuth_1.seedAuthData)().catch((seedErr) => {
                logger_1.logger.warn(`[Server] Auth seed deferred: ${seedErr.message}`);
            });
        }
        catch (dbErr) {
            logger_1.logger.warn(`[Server] Continuing startup with database offline (${dbErr.message}). Health endpoint will report degraded.`);
        }
        const server = app_1.default.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`========================================================`);
            logger_1.logger.info(` Super D Hospital Platform - Backend API Server Started `);
            logger_1.logger.info(` Port:        ${env_1.env.PORT}                               `);
            logger_1.logger.info(` Environment: ${env_1.env.NODE_ENV}                           `);
            logger_1.logger.info(` Health:      http://localhost:${env_1.env.PORT}/health        `);
            logger_1.logger.info(` Base API:    http://localhost:${env_1.env.PORT}/api/v1        `);
            logger_1.logger.info(`========================================================`);
        });
        const shutdown = async (signal) => {
            logger_1.logger.info(`[Server] Received ${signal}. Initiating graceful shutdown...`);
            server.close(async () => {
                logger_1.logger.info('[Server] HTTP listener closed.');
                await (0, database_1.disconnectDatabase)();
                process.exit(0);
            });
            setTimeout(() => {
                logger_1.logger.error('[Server] Forced shutdown due to timeout.');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error(`[Server] Failed to initialize backend server: ${error.message}`, error);
        process.exit(1);
    }
}
startServer();
