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
        status: z.enum(["DRAFT", "PUBLISHED", "ARCHIEVED"]).optional()
    })
});

export const updateQuizSchema = createQuizSchema.partial();