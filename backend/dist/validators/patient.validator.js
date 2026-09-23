"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientSchema = exports.createPatientSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../config/constants");
exports.createPatientSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        age: zod_1.z.number().int().min(0).max(130),
        gender: zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']),
        phone: zod_1.z.string().min(10, 'Valid 10-digit phone number is required'),
        email: zod_1.z.string().email().optional(),
        bloodGroup: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        branchId: zod_1.z.enum(constants_1.BRANCH_IDS, {
            errorMap: () => ({ message: `Branch must be one of: ${constants_1.BRANCH_IDS.join(', ')}` }),
        }),
        emergencyContact: zod_1.z
            .object({
            name: zod_1.z.string(),
            relationship: zod_1.z.string(),
            phone: zod_1.z.string(),
        })
            .optional(),
    }),
});
exports.updatePatientSchema = zod_1.z.object({
    params: zod_1.z.object({
        patientId: zod_1.z.string().min(1, 'Patient identifier is required'),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        phone: zod_1.z.string().min(10).optional(),
        email: zod_1.z.string().email().optional(),
        status: zod_1.z.enum(['ACTIVE', 'ADMITTED', 'DISCHARGED', 'INACTIVE']).optional(),
    }),
});
