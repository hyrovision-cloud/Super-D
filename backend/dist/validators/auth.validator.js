"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Please enter a valid email address').toLowerCase().trim(),
        password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').max(128, 'Password must not exceed 128 characters'),
        rememberMe: zod_1.z.boolean().optional(),
    }),
});
