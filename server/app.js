import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {prisma} from "./config/prisma.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./errors/custom.error.js";
import authRoutes from './routes/auth.routes.js'
import quizRoutes from "./routes/quiz.routes.js";
import questionRoutes from "./routes/question.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import studentRoutes from "./routes/student.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import gradingRoutes from "./routes/grading.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
  'https://pulsequiz-ten.vercel.app',
  'https://*.vercel.app',
].filter(Boolean);

console.log('✅ CORS Allowed Origins:', allowedOrigins);

app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new AppError(`Origin ${origin} is not allowed by CORS.`, 403));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());
app.use((req, res, next) => {
  if (!req.body) req.body = {};
  next();
});

const PORT = process.env.PORT || 10000;

console.log(`
🚀 PulseQuiz Server Configuration:
📍 Port: ${PORT}
🌍 Frontend: ${process.env.FRONTEND_URL || 'not set'}
🔐 JWT: ${process.env.JWT_SECRET ? '✅' : '❌'}
`);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: `PulseQuiz API is running on port ${PORT}`,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
    });
});


// Mount the authentication routing pipelines
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', quizRoutes);
app.use('/api/v1/admin/questions', questionRoutes);
app.use('/api/v1/admin/analytics', analyticsRoutes);
app.use('/api/v1/admin/users', userRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/student/attempts', sessionRoutes);
app.use('/api/v1/student/grading', gradingRoutes); // Mount grading engine processing pipeline

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