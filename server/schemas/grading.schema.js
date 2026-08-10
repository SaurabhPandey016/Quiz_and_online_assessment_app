import { z } from 'zod';

export const userResponseSchema = z.object({
  questionId: z.string().uuid("Invalid question matching payload structural mapping format"),
  selectedOptionId: z.string().uuid("Invalid selected option matching payload structural mapping format")
});

export const submitQuizSchema = z.object({
    body: z.object({
        attemptId: z.string().uuid("Please provide a valid active Attempt UUID"),
        responses: z.array(userResponseSchema) // Client passes a clean mapping array of their choices
    })
});
