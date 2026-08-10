import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/custom.error.js";

export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { attemptId, responses } = req.validated.body;
    const userId = req.user.id;

    // 1. Look up the designated attempt record along with its matching parent quiz configuration matrix
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: { include: { questions: { include: { options: true } } } },
      },
    });

    if (!attempt || attempt.userId !== userId) {
      return next(
        new AppError(
          "The designated assessment attempt container could not be found.",
          404,
        ),
      );
    }

    if (attempt.status !== "IN_PROGRESS") {
      return next(
        new AppError(
          "Access Blocked: This evaluation session has already been scored and locked.",
          400,
        ),
      );
    }

    const quiz = attempt.quiz;
    const now = new Date();

    // 2. Enforce Server-Side Timer Safety Limits
    // Calculate the difference between 'now' and the start time in seconds
    const actualSecondsElapsed = Math.floor(
      (now.getTime() - attempt.startedAt.getTime()) / 1000,
    );
    const allowedSecondsMax = quiz.duration * 60;

    let isOvertime = false;
    let timeTakenRecorded = actualSecondsElapsed;

    // If the student exceeds the time limit (plus a 5-second network buffer window), enforce a cutoff
    if (actualSecondsElapsed > allowedSecondsMax + 5) {
      isOvertime = true;
      timeTakenRecorded = allowedSecondsMax; // Force-clamp recorded runtime parameters to the limit
    }

    // 3. Algorithmic Processing Phase: Evaluate Choices Securely
    let score = 0;
    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    let unansweredCount = 0;

    const totalQuestionsCount = quiz.questions.length;

    // Convert client array to a fast-lookup map table container
    const responsesMap = new Map(
      responses.map((r) => [r.questionId, r.selectedOptionId]),
    );

    // List to hold compiled batch inserts for the individual choice rows
    const answersToInsert = [];

    for (const question of quiz.questions) {
      const selectedOptionId = responsesMap.get(question.id);

      if (!selectedOptionId) {
        // If the question is missing from the payload, flag it as unanswered
        unansweredCount++;
        continue;
      }

      // Find the option within the question block that is marked true by the database
      const trueOption = question.options.find((opt) => opt.isCorrect === true);
      const isCorrectChoice = trueOption
        ? trueOption.id === selectedOptionId
        : false;

      if (isCorrectChoice) {
        score += question.marks;
        correctAnswersCount++;
      } else {
        incorrectAnswersCount++;
      }

      answersToInsert.push({
        attemptId: attempt.id,
        questionId: question.id,
        selectedOptionId,
        isCorrect: isCorrectChoice,
      });
    }

    // Final mathematical evaluations
    const maxPossibleScore = quiz.questions.reduce(
      (sum, q) => sum + q.marks,
      0,
    );
    const percentageScore =
      maxPossibleScore > 0
        ? parseFloat(((score / maxPossibleScore) * 100).toFixed(2))
        : 0;

    // Evaluate criteria passing bounds
    const passStatus =
      percentageScore >= quiz.passingScore ? "COMPLETED" : "FAILED";

    // 4. Database Transaction Phase: Write entries atomically via ACID controls
    const executionSummary = await prisma.$transaction(async (tx) => {
      // Step A: Save individual answer records for review logs
      if (answersToInsert.length > 0) {
        await tx.answer.createMany({ data: answersToInsert });
      }

      // Step B: Update and lock the parent attempt row layout parameters
      const updatedAttempt = await tx.attempt.update({
        where: { id: attempt.id },
        data: {
          score,
          percentage: percentageScore,
          correctAnswers: correctAnswersCount,
          incorrectAnswers: incorrectAnswersCount,
          unanswered: unansweredCount,
          timeTaken: timeTakenRecorded,
          status: passStatus,
          completedAt: now,
        },
      });

      return updatedAttempt;
    });

    res.status(200).json({
      status: "success",
      message: isOvertime
        ? "The evaluation timer expired. The system has automatically processed and saved your attempt metrics."
        : "Assessment submitted and graded successfully.",
      data: { result: executionSummary },
    });
  } catch (error) {
    next(error);
  }
};
