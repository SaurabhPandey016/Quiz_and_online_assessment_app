import { prisma } from '../config/prisma.js';
import { AppError } from '../errors/custom.error.js';

// Category Administrative Crud Operations

export const createCategory = async (req, res, next) => {
    try {
        const { name , description } = req.validated.body;
        const category = await prisma.category.create({
            data : {name, description}
        });

        res.status(201).json({
            status: 'success',
            data: {category}
        });
    } catch(error) {
        next(error)
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            include: {_count: {select: {quizzes : true}}}
        });
        res.status(200).json({
            status: 'success', 
            results: categories.length, 
            data: {categories}
        })

    } catch(error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {   

        const {id} = req.params;
        await prisma.category.delete({where : {id}});
        res.status(204).json({
            status:'success',
            data: null
        });

    } catch(error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.validated.body;

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

// Quiz ADMINISTRATIVE CRUD OPERATORS

export const createQuiz = async (req, res, next) => {
    try {
        const quizData = req.validated.body;
        const quiz = await prisma.quiz.create({
            data: quizData
        });
        res.status(201).json({
            status: 'success', 
            data: {quiz}
        });
    } catch (error) {
        next(error);
    }
};

export const getAllQuizzesAdmin = async (req, res, next) => {
    try {
        const quizzes = await prisma.quiz.findMany({
            include: { category: { select: { name: true } }, _count: { select: { questions: true } } }
        });
        res.status(200).json({ status: 'success', results: quizzes.length, data: { quizzes } });
    } catch (error) {
        next(error);
    }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.validated.body;
    
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: updateData
    });
    
    res.status(200).json({ status: 'success', data: { quiz: updatedQuiz } });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.quiz.delete({ where: { id } });
    
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};