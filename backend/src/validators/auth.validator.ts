import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(128, 'Password must not exceed 128 characters'),
    rememberMe: z.boolean().optional(),
  }),
});

