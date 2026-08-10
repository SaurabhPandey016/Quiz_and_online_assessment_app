import { prisma } from '../config/prisma.js';

export const getAdminDashboardStats  = async (req, res, next) => {
    try {

        // Execute multiple mathematical count lookups simultaneously to prevent thread blocks
        const [ totalStudents, totalQuizzes, publishedQuizzes, draftQuizzes, totalQuestions, totalAttempts] = await Promise.all([
            prisma.user.count({where : {role : 'USER'}}), 
            prisma.quiz.count(),
            prisma.quiz.count({ where: { status: 'PUBLISHED' } }),
            prisma.quiz.count({ where: { status: 'DRAFT' } }),
            prisma.question.count(),
            prisma.attempt.count(),
        ]);

        // Aggregate assessment metrics across the historical records
        const testScoreAggregates = await prisma.attempt.aggregate({
            _avg: {
                percentage: true
            },
            _count: {
                id: true
            }
        });

        // Calculate passing and failing volume buckets
        const totalPassedAttempts = await prisma.attempt.count({ where: { status: 'COMPLETED' } });
        const totalFailedAttempts = await prisma.attempt.count({ where: { status: 'FAILED' } });

        // --- TIME-SERIES ANALYTICS QUERIES (FOR CHART.JS GRID VISUALIZATIONS) ---

        // 1. Student registration trends over time
        const registrationTrends = await prisma.$queryRaw`
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(id)::int as count
        FROM users
        WHERE role = 'USER'
        GROUP BY date
        ORDER BY date ASC
        LIMIT 14;
        `;

        // 2. Quiz attempt frequency trends over time
        const attemptTrends = await prisma.$queryRaw`
        SELECT TO_CHAR(started_at, 'YYYY-MM-DD') as date, COUNT(id)::int as count
        FROM attempts
        GROUP BY date
        ORDER BY date ASC
        LIMIT 14;
        `;

        // 3. Most Popular Quizzes (Top 5 evaluated content sets)
        const popularQuizzes = await prisma.$queryRaw`
        SELECT q.title, COUNT(a.id)::int as "attemptCount"
        FROM quizzes q
        JOIN attempts a ON q.id = a.quiz_id
        GROUP BY q.id, q.title
        ORDER BY "attemptCount" DESC
        LIMIT 5;
        `;

        res.status(200).json({
        status: 'success',
        data: {
            statistics: {
            totalStudents,
            totalQuizzes,
            publishedQuizzes,
            draftQuizzes,
            totalQuestions,
            totalAttempts,
            averageScore: parseFloat((testScoreAggregates._avg.percentage || 0).toFixed(2)),
            totalPassedAttempts,
            totalFailedAttempts
            },
            charts: {
            registrationTrends,
            attemptTrends,
            popularQuizzes
            }
        }
        });


    }  catch(error) {
        next(error)
    }
}