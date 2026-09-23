"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = getHealthStatus;
const database_1 = require("../config/database");
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
function getHealthStatus(_req, res) {
    const dbConnected = (0, database_1.isDatabaseConnected)();
    const uptimeSeconds = Math.floor(process.uptime());
    const status = {
        status: dbConnected ? 'healthy' : 'degraded',
        service: 'hospital-management-backend',
        version: '1.0.0',
        environment: env_1.env.NODE_ENV,
        database: {
            connected: dbConnected,
            type: 'MongoDB Atlas',
        },
        uptime: `${uptimeSeconds}s`,
        timestamp: new Date().toISOString(),
    };
    const statusCode = dbConnected ? 200 : 503;
    return (0, response_1.sendSuccess)(res, status, 'Health check completed.', statusCode);
}
