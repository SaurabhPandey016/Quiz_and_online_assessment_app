import { z } from 'zod';

export const quizDiscoverySchema = z.object({
    query: z.object({
        search: z.string().optional(),
        categoryId: z.string().uuid("Invalid category matching structure format").optional(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
        minDuration: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive()).optional(),
        maxDuration: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive()).optional(),
        page: z.string().default("1").transform(val => parseInt(val, 10)).pipe(z.number().positive()),
        limit: z.string().default("10").transform(val => parseInt(val, 10)).pipe(z.number().positive())
    })
});
