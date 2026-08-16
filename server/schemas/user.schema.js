import { z } from 'zod';

export const createUserAdminSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['ADMIN', 'USER']).default('USER'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long').optional(),
    role: z.enum(['ADMIN', 'USER']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});
