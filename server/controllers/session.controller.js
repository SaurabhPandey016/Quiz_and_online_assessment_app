import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/custom.error.js";

export const initializeQuizAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.validated.body;
    const userId = req.user.id; // Extracted safely out of our active JWT session cookie

    // 1. Verify the parent quiz exists and is open for evaluations
    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, status: "PUBLISHED" },
      include: { _count: { select: { questions: true } } },
    });

    if (!quiz) {
      return next(
        new AppError(
          "The requested quiz does not exist or is currently unpublished.",
          404,
        ),
      );
    }

    if (quiz._count.questions === 0) {
      return next(
        new AppError(
          "This quiz is under construction and does not contain any questions yet.",
          400,
        ),
      );
    }

    // 2. Guard Check: Resume active session if one is already 'IN_PROGRESS'
    const activeAttempt = await prisma.attempt.findFirst({
      where: { quizId, userId, status: "IN_PROGRESS" },
    });

    if (activeAttempt) {
      return res.status(200).json({
        status: "success",
        message: "Resuming your active quiz session in progress.",
        data: { attempt: activeAttempt },
      });
    }

    // 3. Guard Check: Enforce maximum allowed quiz attempt limitations
    const pastAttemptsCount = await prisma.attempt.count({
      where: { quizId, userId, status: { in: ["COMPLETED", "FAILED"] } },
    });

    if (pastAttemptsCount >= quiz.maxAttempts) {
      return next(
        new AppError(
          `Access Denied: You have already exhausted the maximum allowed limit of ${quiz.maxAttempts} attempts for this assessment.`,
          403,
        ),
      );
    }

    // 4. State Management: Instantiate a fresh assessment attempt record row
    const newAttempt = await prisma.attempt.create({
      data: {
        quizId,
        userId,
        timeTaken: 0,
        status: "IN_PROGRESS",
        startedAt: new Date(),
        score: 0,
        percentage: 0.0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        unanswered: 0,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Quiz assessment session initialized successfully.",
      data: { attempt: newAttempt },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentAttemptHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const history = await prisma.attempt.findMany({
      where: { userId },
      include: {
        quiz: {
          select: { title: true, difficulty: true, passingScore: true },
        },
      },
      orderBy: { startedAt: "desc" },
    });

    res
      .status(200)
      .json({ status: "success", results: history.length, data: { history } });
  } catch (error) {
    next(error);
  }
};
