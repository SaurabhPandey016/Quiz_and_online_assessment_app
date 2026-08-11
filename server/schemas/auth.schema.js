import { z } from "zod";

export const registerSchema = z.object({
    body : z.object({
        name : z.string().min(3, "Name must be at least 3 characters long"),
        email : z.string().email("Please provide a valid email address"), 
        password : z.string().min(6, "Password must be at least 6 characters long"),
        role : z.enum(["ADMIN", "USER"]).optional() // Fallback handled by DB Default
    })
});

export const loginSchema = z.object({
    body : z.object({
        email: z.string().email("Please provide a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long")
    })
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Please provide a valid email address")
    })
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(16, "Reset token is required to reset your password"),
        password: z.string().min(6, "Password must be at least 6 characters long")
    })
});