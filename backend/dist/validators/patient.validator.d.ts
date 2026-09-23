import { z } from 'zod';
export declare const createPatientSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        age: z.ZodNumber;
        gender: z.ZodEnum<["MALE", "FEMALE", "OTHER"]>;
        phone: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        bloodGroup: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        branchId: z.ZodEnum<["branch-trichy", "branch-chennai", "branch-madurai", "branch-pudukkottai"]>;
        emergencyContact: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            relationship: z.ZodString;
            phone: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            phone: string;
            relationship: string;
        }, {
            name: string;
            phone: string;
            relationship: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
        branchId: "branch-trichy" | "branch-chennai" | "branch-madurai" | "branch-pudukkottai";
        age: number;
        gender: "MALE" | "FEMALE" | "OTHER";
        email?: string | undefined;
        address?: string | undefined;
        bloodGroup?: string | undefined;
        emergencyContact?: {
            name: string;
            phone: string;
            relationship: string;
        } | undefined;
    }, {
        name: string;
        phone: string;
        branchId: "branch-trichy" | "branch-chennai" | "branch-madurai" | "branch-pudukkottai";
        age: number;
        gender: "MALE" | "FEMALE" | "OTHER";
        email?: string | undefined;
        address?: string | undefined;
        bloodGroup?: string | undefined;
        emergencyContact?: {
            name: string;
            phone: string;
            relationship: string;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        phone: string;
        branchId: "branch-trichy" | "branch-chennai" | "branch-madurai" | "branch-pudukkottai";
        age: number;
        gender: "MALE" | "FEMALE" | "OTHER";
        email?: string | undefined;
        address?: string | undefined;
        bloodGroup?: string | undefined;
        emergencyContact?: {
            name: string;
            phone: string;
            relationship: string;
        } | undefined;
    };
}, {
    body: {
        name: string;
        phone: string;
        branchId: "branch-trichy" | "branch-chennai" | "branch-madurai" | "branch-pudukkottai";
        age: number;
        gender: "MALE" | "FEMALE" | "OTHER";
        email?: string | undefined;
        address?: string | undefined;
        bloodGroup?: string | undefined;
        emergencyContact?: {
            name: string;
            phone: string;
            relationship: string;
        } | undefined;
    };
}>;
export declare const updatePatientSchema: z.ZodObject<{
    params: z.ZodObject<{
        patientId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        patientId: string;
    }, {
        patientId: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["ACTIVE", "ADMITTED", "DISCHARGED", "INACTIVE"]>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        status?: "ACTIVE" | "INACTIVE" | "ADMITTED" | "DISCHARGED" | undefined;
    }, {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        status?: "ACTIVE" | "INACTIVE" | "ADMITTED" | "DISCHARGED" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        status?: "ACTIVE" | "INACTIVE" | "ADMITTED" | "DISCHARGED" | undefined;
    };
    params: {
        patientId: string;
    };
}, {
    body: {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        status?: "ACTIVE" | "INACTIVE" | "ADMITTED" | "DISCHARGED" | undefined;
    };
    params: {
        patientId: string;
    };
}>;
