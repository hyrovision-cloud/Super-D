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
exports.AdvertisementModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AdvertisementSchema = new mongoose_1.Schema({
    campaignId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    platform: {
        type: String,
        enum: ['Google Ads', 'Meta Ads', 'YouTube', 'Instagram', 'Other'],
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['Running', 'Scheduled', 'Completed', 'Draft'],
        default: 'Draft',
        index: true,
    },
    branchId: { type: String, required: true, index: true },
    budget: { type: Number, required: true },
    spend: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    leadsCount: { type: Number, default: 0 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    adUrl: { type: String },
    responsiblePerson: { type: String, required: true },
}, { timestamps: true });
exports.AdvertisementModel = mongoose_1.default.model('Advertisement', AdvertisementSchema, 'advertisements');
