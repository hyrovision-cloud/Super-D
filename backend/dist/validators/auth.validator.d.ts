import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        rememberMe: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        password: string;
        email: string;
        rememberMe?: boolean | undefined;
    }, {
        password: string;
        email: string;
        rememberMe?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        email: string;
        rememberMe?: boolean | undefined;
    };
}, {
    body: {
        password: string;
        email: string;
        rememberMe?: boolean | undefined;
    };
}>;
