import { prisma } from '../config/prisma.js';

export const discoverQuizzes = async (req, res, next) => {
  try {
    const { search, categoryId, difficulty, minDuration, maxDuration, page, limit } = req.validated.query;

    // Calculate database skip parameter offsets
    const skip = (page - 1) * limit;

    // Build the dynamic Prisma filter matching matrix structure
    const whereConditions = {
        status: 'PUBLISHED', // Critical: Security constraint isolation checkpoint boundary guard
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

    // Run parallel pagination checks and lookups simultaneously to save execution time
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
                // CRUCIAL: 'isCorrect' is explicitly omitted here so users cannot find answers in the UI!
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
