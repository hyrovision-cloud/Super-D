"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = exports.AuditService = void 0;
exports.auditMiddleware = auditMiddleware;
const AuditLog_model_1 = require("../../models/AuditLog.model");
const logger_1 = require("../../utils/logger");
class AuditService {
    async logEvent(params) {
        try {
            await AuditLog_model_1.AuditLogModel.create({
                ...params,
                timestamp: new Date(),
            });
        }
        catch (err) {
            logger_1.logger.error(`[AuditService] Failed to record audit log: ${err.message}`, err);
        }
    }
}
exports.AuditService = AuditService;
exports.auditService = new AuditService();
function auditMiddleware(moduleName, actionName) {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function (body) {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                exports.auditService.logEvent({
                    actorId: req.user.userId,
                    actorName: req.user.name,
                    actorRole: req.user.role,
                    action: actionName,
                    module: moduleName,
                    branchId: req.query.branchId || req.body?.branchId || req.user.primaryBranchId,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                    details: { method: req.method, path: req.path },
                });
            }
            return originalSend.call(this, body);
        };
        next();
    };
}
