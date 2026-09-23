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
exports.ComplaintModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ComplaintSchema = new mongoose_1.Schema({
    ticketNumber: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['MEDICAL_CARE', 'STAFF_BEHAVIOR', 'FACILITY', 'BILLING', 'WAIT_TIME', 'CLEANLINESS'],
        required: true,
        index: true,
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'MEDIUM',
        index: true,
    },
    status: {
        type: String,
        enum: ['NEW', 'ASSIGNED', 'INVESTIGATING', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED', 'ESCALATED'],
        default: 'NEW',
        index: true,
    },
    branchId: { type: String, required: true, index: true },
    patientId: { type: String },
    patientName: { type: String },
    uhid: { type: String },
    assignedTo: { type: String },
    assignedToName: { type: String },
    notes: [
        {
            noteId: { type: String, required: true },
            authorName: { type: String, required: true },
            authorRole: { type: String, required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            isInternal: { type: Boolean, default: true },
        },
    ],
    slaHours: { type: Number, default: 24 },
    slaDeadline: { type: Date, required: true, index: true },
    isOverdue: { type: Boolean, default: false, index: true },
    resolution: { type: String },
    resolvedAt: { type: Date },
}, { timestamps: true });
exports.ComplaintModel = mongoose_1.default.model('Complaint', ComplaintSchema, 'complaints');
