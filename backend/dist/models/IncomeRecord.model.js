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
exports.IncomeRecordModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const IncomeRecordSchema = new mongoose_1.Schema({
    receiptNumber: { type: String, required: true, unique: true, index: true },
    transactionDate: { type: Date, default: Date.now, index: true },
    category: {
        type: String,
        enum: [
            'OP Consultation',
            'Medical / Pharmacy',
            'Lab & Diagnostics',
            'Day Care',
            'Dressing & Procedures',
            'Surgical KIT & Consumables',
            'Other Collections (Inpatient)',
        ],
        required: true,
        index: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'UPI', 'Card', 'Net Banking', 'TPA Insurance'],
        required: true,
    },
    branchId: { type: String, required: true, index: true },
    patientId: { type: String, index: true },
    patientName: { type: String },
    uhid: { type: String, index: true },
    recordedBy: { type: String, required: true },
    recordedByName: { type: String, required: true },
    status: {
        type: String,
        enum: ['ACTIVE', 'ADJUSTED', 'CANCELLED'],
        default: 'ACTIVE',
        index: true,
    },
    adjustmentReason: { type: String },
    adjustmentRefId: { type: String },
    notes: { type: String },
}, { timestamps: true });
exports.IncomeRecordModel = mongoose_1.default.model('IncomeRecord', IncomeRecordSchema, 'income_records');
