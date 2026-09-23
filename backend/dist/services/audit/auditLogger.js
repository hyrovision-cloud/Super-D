"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAudit = recordAudit;
const AuditLog_model_1 = require("../../models/AuditLog.model");
async function recordAudit(req, action, module, recordId, branchId, details) {
    const user = req.user;
    if (!user)
        return;
    await AuditLog_model_1.AuditLogModel.create({
        actorId: user.userId,
        actorName: user.name,
        actorRole: user.roles[0] || 'Unknown',
        action,
        module,
        recordId,
        branchId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        details,
    });
}
