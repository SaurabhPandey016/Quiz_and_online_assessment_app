import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {prisma} from "./config/prisma.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./errors/custom.error.js";
dotenv.config();

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`Server is Healthy and running with no errors on port : ${PORT}`);
});

// temporary test for database connection
app.get("/api/test", async (req, res) => {

    try {   
        const dbCheck = await prisma.$queryRaw`SELECT NOW();`;
        res.status(200).json({
            status: "success",
            message: "Database connection is successful",
            data: dbCheck, 
            timestamp : dbCheck[0].now, 
        });

    } catch (error) {
        console.error("Error occurred while checking database connection:", error);
        res.status(500).json({ error : error.message });
        next(error);
    }

});

// Catch-all route trigger for non-existent endpoint strings
// // The name "splat" tells Express 5 to capture all trailing character blocks safely
app.all('/*splat', (req, res, next) => {
  next(new AppError(`Cannot resolve the endpoint URL ${req.originalUrl} on this server.`, 404));
});

// Centralized Error Handling Interceptor Middleware (CRITICAL: Must remain last)
app.use(errorHandler);


app.listen(PORT , () => {
    console.log(`Server is running on port : ${PORT}`);
});

export default app;