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
exports.MedicalRecordModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MedicalRecordSchema = new mongoose_1.Schema({
    recordNumber: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    uhid: { type: String, required: true, index: true },
    branchId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true, index: true },
    doctorName: { type: String, required: true },
    date: { type: Date, default: Date.now, index: true },
    diagnosis: { type: String, required: true },
    clinicalNotes: { type: String, default: '' },
    prescriptions: [
        {
            medicineName: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true },
        },
    ],
    vitals: {
        bp: { type: String },
        pulse: { type: Number },
        temperature: { type: Number },
        spo2: { type: Number },
    },
    attachments: [{ type: String }],
}, { timestamps: true });
exports.MedicalRecordModel = mongoose_1.default.model('MedicalRecord', MedicalRecordSchema, 'medical_records');
