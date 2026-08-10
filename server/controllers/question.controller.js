import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/custom.error.js";

export const createQuestionAndOptions = async (req, res, next) => {
  try {
    const { quizId, questionText, marks, explanation, difficulty, options } =
      req.validated.body;

    // business logic constrains: Ensure exactly one correct answer is present;
    const correctOptionsCount = options.filter(
      (opt) => opt.isCorrect === true,
    ).length;
    if (correctOptionsCount !== 1) {
      return next(
        new AppError(
          `Validation failure: A single-choice question layout must possess exactly 1 correct answer payload field definition. Detected: ${correctOptionsCount}`,
          400,
        ),
      );
    }

    // check if the target quiz exists before creating content
    const quizExists = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quizExists) {
      return next(
        new AppError(
          "The designated parent quiz entity container matching that UUID could not be resolved.",
          404,
        ),
      );
    }

    // Execute the database modifications inside an isolated ACID transaction block
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Insert the question node row
      const question = await tx.question.create({
        data: { quizId, questionText, marks, explanation, difficulty },
      });

      // 2. Prepare the nested option rows with the freshly generated parent question ID pointer
      const optionsPayload = options.map((opt) => ({
        questionId: question.id,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
      }));

      // 3. Perform bulk creation for the option rows simultaneously
      await tx.option.createMany({ data: optionsPayload });

      // 4. Retrieve the newly bundled dataset to return it cleanly as a view payload
      const completeQuestionBlock = await tx.question.findUnique({
        where: { id: question.id },
        include: { options: true },
      });

      return completeQuestionBlock;
    });

    res
      .status(201)
      .json({ status: "success", data: { question: transactionResult } });
  } catch (error) {
    next(error);
  }
};

export const getQuizQuestionsAdmin = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const questions = await prisma.question.findMany({
      where: { quizId },
      include: { options: true },
    });

    res
      .status(200)
      .json({
        status: "success",
        results: questions.length,
        data: { questions },
      });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestionAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // The schema configuration 'onDelete: Cascade' automatically wipes the connected options rows safely
    await prisma.question.delete({ where: { id } });

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};
