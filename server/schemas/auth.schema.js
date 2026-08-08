import { z } from "zod";

export const registerSchema = z.object({
    body : z.object({
        name : z.string().min(3, "Name must be at least 3 characters long"),
        email : z.string().email("Please provide a valid email address"), 
        password : z.string().min(6, "Password must be at least 6 characters long"),
        role : z.enum(["ADMIN", "USER"]).optional() // Fallback handled by DB Default
    })
});