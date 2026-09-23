"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSettingsModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AttendanceStatusSchema = new mongoose_1.Schema({ code: { type: String, required: true }, label: { type: String, required: true }, enabled: { type: Boolean, required: true } }, { _id: false });
const SystemSettingsSchema = new mongoose_1.Schema({
    key: { type: String, enum: ['application'], default: 'application', unique: true },
    emailAlerts: { type: Boolean, default: true }, smsAlerts: { type: Boolean, default: true }, soundAlerts: { type: Boolean, default: false },
    currency: { type: String, enum: ['INR'], default: 'INR' },
    dateFormat: { type: String, enum: ['DD-MM-YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD'], default: 'DD-MM-YYYY' },
    attendanceStatuses: { type: [AttendanceStatusSchema], default: () => [
            { code: 'PRESENT', label: 'Present', enabled: true }, { code: 'ABSENT', label: 'Absent', enabled: true }, { code: 'LATE', label: 'Late', enabled: true },
            { code: 'HALF_DAY', label: 'Half Day', enabled: true }, { code: 'ON_LEAVE', label: 'On Leave', enabled: true }, { code: 'WORK_FROM_HOME', label: 'Work From Home', enabled: true }, { code: 'HOLIDAY', label: 'Holiday', enabled: true },
        ] },
}, { timestamps: true });
exports.SystemSettingsModel = mongoose_1.default.model('SystemSettings', SystemSettingsSchema, 'system_settings');
