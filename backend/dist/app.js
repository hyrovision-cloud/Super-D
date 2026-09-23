"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const uuid_1 = require("uuid");
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const health_controller_1 = require("./controllers/health.controller");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const allowedOrigins = [
    env_1.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5173',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || !env_1.env.isProduction) {
            return callback(null, true);
        }
        const normalizedOrigin = origin.replace(/\/+$/, '');
        const isAllowed = allowedOrigins.some((o) => o.replace(/\/+$/, '') === normalizedOrigin);
        if (isAllowed) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS error: Origin ${origin} not permitted.`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Branch-Context', 'X-Request-Id'],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || (0, uuid_1.v4)();
    res.setHeader('X-Request-Id', req.id);
    next();
});
app.get('/health', health_controller_1.getHealthStatus);
app.use('/api/v1', rateLimit_middleware_1.apiLimiter, routes_1.default);
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
