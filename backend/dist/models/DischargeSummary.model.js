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
exports.DischargeSummaryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DischargeSummarySchema = new mongoose_1.Schema({
    dischargeNumber: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    uhid: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    branchId: { type: String, required: true, index: true },
    admissionDate: { type: String, required: true },
    admissionTime: { type: String, required: true },
    dischargeDate: { type: String, required: true, index: true },
    dischargeTime: { type: String, required: true },
    primaryConsultantId: { type: String, required: true, index: true },
    primaryConsultantName: { type: String, required: true },
    department: { type: String, required: true },
    finalDiagnosis: { type: String, required: true },
    clinicalSummary: { type: String, required: true },
    treatmentGiven: { type: String, required: true },
    dischargeCondition: {
        type: String,
        enum: ['STABLE', 'IMPROVED', 'CRITICAL', 'AGAINST_MEDICAL_ADVICE'],
        default: 'STABLE',
    },
    dischargeMedications: [
        {
            medicineName: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true },
            instructions: { type: String },
        },
    ],
    followUpAdvice: { type: String },
    status: {
        type: String,
        enum: ['DRAFT', 'PENDING_APPROVAL', 'FINALIZED'],
        default: 'DRAFT',
        index: true,
    },
    approvedBy: { type: String },
    approvedAt: { type: Date },
}, { timestamps: true });
exports.DischargeSummaryModel = mongoose_1.default.model('DischargeSummary', DischargeSummarySchema, 'discharge_summaries');
