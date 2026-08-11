import { z } from 'zod'

export const createCategorySchema = z.object({
    body : z.object({
        name : z.string().min(2, "Category must be atleast 2 character long"), 
        description : z.string().optional()
    })
})

export const createQuizSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Quiz title must be atleast 3 characters long"),
        description : z.string().optional(),
        categoryId: z.string().uuid("Please select a valid category ID"), 
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]), 
        duration: z.number().int().positive("Duration must be positive number in minutes"), 
        passingScore: z.number().int().min(1).max(100, "Passing score must be between 1% to 100%"), 
        maxAttempts: z.number().int().positive("Max attempts must be atleast 1."), 
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional()
    })
});

export const updateQuizSchema = z.object({
    body: z.object({
        title: z.string().min(3).optional(),
        description: z.string().optional(),
        categoryId: z.string().uuid().optional(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
        duration: z.number().int().positive().optional(),
        passingScore: z.number().int().min(1).max(100).optional(),
        maxAttempts: z.number().int().positive().optional(),
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional()
    })
});

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, "Category must be atleast 2 character long").optional(),
        description: z.string().optional()
    })
});