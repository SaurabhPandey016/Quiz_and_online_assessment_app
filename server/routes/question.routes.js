import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createQuestionAndOptions, getQuizQuestionsAdmin, deleteQuestionAdmin } from '../controllers/question.controller.js';
import { createQuestionSchema } from '../schemas/question.schema.js';

const router = Router();

// Secure all endpoints under active token session requirements
router.use(protect);
router.use(restrictTo('ADMIN'));

router.route('/')
  .post(validate(createQuestionSchema), createQuestionAndOptions);

router.route('/quiz/:quizId')
  .get(getQuizQuestionsAdmin);

router.route('/:id')
  .delete(deleteQuestionAdmin);

export default router;
