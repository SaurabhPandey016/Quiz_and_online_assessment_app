import { prisma } from '../config/prisma.js';

export const discoverQuizzes = async (req, res, next) => {
  try {
    const { search, categoryId, difficulty, minDuration, maxDuration, page, limit } = req.validated.query;

    const skip = (page - 1) * limit;

    const whereConditions = {
      status: 'PUBLISHED',
      ...(categoryId && { categoryId }),
      ...(difficulty && { difficulty }),
      ...((minDuration || maxDuration) && {
        duration: {
          ...(minDuration && { gte: minDuration }),
          ...(maxDuration && { lte: maxDuration })
        }
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [quizzes, totalCount] = await Promise.all([
      prisma.quiz.findMany({
        where: whereConditions,
        include: {
          category: { select: { name: true } },
          _count: { select: { questions: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quiz.count({ where: whereConditions })
    ]);

    res.status(200).json({
      status: 'success',
      meta: {
        totalResults: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        resultsPerPage: limit
      },
      data: { quizzes }
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizDetailsForStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findFirst({
      where: { id, status: 'PUBLISHED' },
      include: {
        category: { select: { name: true } },
        questions: {
          include: {
            options: {
              select: {
                id: true,
                questionId: true,
                optionText: true
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ status: 'fail', message: 'Quiz could not be found or is not currently open for evaluations.' });
    }

    res.status(200).json({ status: 'success', data: { quiz } });
  } catch (error) {
    next(error);
  }
};

export const getStudentCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { quizzes: true } } },
      orderBy: { name: 'asc' }
    });

    res.status(200).json({ status: 'success', results: categories.length, data: { categories } });
  } catch (error) {
    next(error);
  }
};

export const getStudentLeaderboard = async (req, res, next) => {
  try {
    const rawResults = await prisma.$queryRaw`
      SELECT u.id AS "userId",
             u.name,
             COUNT(a.id)::int AS "completedQuizzes",
             AVG(a.percentage)::numeric(5,2) AS "averageScore",
             MAX(a.percentage)::numeric(5,2) AS "highestScore"
      FROM attempts a
      JOIN users u ON a.user_id = u.id
      WHERE a.status = 'COMPLETED'
      GROUP BY u.id, u.name
      ORDER BY "averageScore" DESC, "completedQuizzes" DESC
      LIMIT 10;
    `;

    const leaderboard = rawResults.map((row) => ({
      userId: row.userId,
      name: row.name,
      completedQuizzes: Number(row.completedQuizzes),
      averageScore: Number(row.averageScore),
      highestScore: Number(row.highestScore),
    }));

    res.status(200).json({ status: 'success', results: leaderboard.length, data: { leaderboard } });
  } catch (error) {
    next(error);
  }
};
