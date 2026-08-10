import { z } from 'zod';

export const startQuizSchema = z.object({
    body: z.object({
        quizId: z.string().uuid("Please provide a valid parent Quiz UUID")
    })
});