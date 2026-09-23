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
exports.LeaveRequestModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LeaveRequestSchema = new mongoose_1.Schema({
    requestNumber: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true, index: true },
    employeeName: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    branchId: { type: String, required: true, index: true },
    leaveType: {
        type: String,
        enum: ['CASUAL', 'SICK', 'EARNED', 'PERMISSION', 'MATERNITY', 'EMERGENCY'],
        required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    daysCount: { type: Number, required: true, min: 0.5 },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ['SUBMITTED', 'MANAGER_REVIEW', 'HR_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED'],
        default: 'SUBMITTED',
        index: true,
    },
    reviewStage: {
        type: String,
        enum: ['PENDING_MANAGER', 'PENDING_HR', 'APPROVED', 'REJECTED'],
        default: 'PENDING_MANAGER',
        index: true,
    },
    managerReview: {
        reviewedBy: { type: String },
        reviewedAt: { type: Date },
        decision: { type: String, enum: ['APPROVED', 'REJECTED'] },
        comments: { type: String },
    },
    hrReview: {
        reviewedBy: { type: String },
        reviewedAt: { type: Date },
        decision: { type: String, enum: ['APPROVED', 'REJECTED'] },
        comments: { type: String },
    },
}, { timestamps: true });
exports.LeaveRequestModel = mongoose_1.default.model('LeaveRequest', LeaveRequestSchema, 'leave_requests');
