import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long').optional(),
    role: z.enum(['ADMIN', 'USER']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});
