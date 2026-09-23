import { z } from 'zod';
import { BRANCH_IDS } from '../config/constants';

export const createPatientSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    age: z.number().int().min(0).max(130),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    phone: z.string().min(10, 'Valid 10-digit phone number is required'),
    email: z.string().email().optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
    branchId: z.enum(BRANCH_IDS, {
      errorMap: () => ({ message: `Branch must be one of: ${BRANCH_IDS.join(', ')}` }),
    }),
    emergencyContact: z
      .object({
        name: z.string(),
        relationship: z.string(),
        phone: z.string(),
      })
      .optional(),
  }),
});

export const updatePatientSchema = z.object({
  params: z.object({
    patientId: z.string().min(1, 'Patient identifier is required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    status: z.enum(['ACTIVE', 'ADMITTED', 'DISCHARGED', 'INACTIVE']).optional(),
  }),
});
