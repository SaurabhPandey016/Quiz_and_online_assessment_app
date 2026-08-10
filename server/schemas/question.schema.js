import { z } from 'zod'

export const createOptionSchema = z.object({
    optionText: z.string().min(1, "Option text cannot be left empty"), 
    isCorrect: z.boolean("isCorrect parameter must explicitly evaluate to a true or false boolean value.")
});

export const createQuestionSchema = z.object({
    body: z.object({
        quizId: z.string().uuid("Please provide a valid parent Quiz UUID"), 
        questionText: z.string().min(5, "Question text must be at least 5 characters long"), 
        marks: z.number().int().nonnegative().default(1), 
        explanation: z.string().optional(), 
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"), 
        // Require an exact array of options alongside the question payload
        options: z.array(createOptionSchema)
        .min(2, "A question must have at least 2 distinct option choices")
        .max(6, "A question can hold a maximum of 6 structural option choices")
    })
});

