import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { 
  createCategory, getAllCategories, deleteCategory,
  createQuiz, getAllQuizzesAdmin, updateQuiz, deleteQuiz 
} from '../controllers/quiz.controller.js';
import { createCategorySchema, createQuizSchema, updateQuizSchema } from '../schemas/admin.schema.js';

const router = Router();

// Secure all endpoints inside this router block under active JWT validation
router.use(protect);

// --- CATEGORY ROUTES ---
router.route('/categories')
  .post(restrictTo('ADMIN'), validate(createCategorySchema), createCategory)
  .get(getAllCategories); // Both Admin & Student roles can view categories

router.delete('/categories/:id', restrictTo('ADMIN'), deleteCategory);

// --- QUIZ ADMINISTRATIVE ROUTES ---
router.route('/quizzes')
  .post(restrictTo('ADMIN'), validate(createQuizSchema), createQuiz)
  .get(restrictTo('ADMIN'), getAllQuizzesAdmin); // Special full-view for Admin dashboard

router.route('/quizzes/:id')
  .patch(restrictTo('ADMIN'), validate(updateQuizSchema), updateQuiz)
  .delete(restrictTo('ADMIN'), deleteQuiz);

export default router;