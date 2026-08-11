import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import {
  discoverQuizzes,
  getQuizDetailsForStudent,
  getStudentCategories,
  getStudentLeaderboard,
} from '../controllers/student.controller.js';
import { quizDiscoverySchema } from '../schemas/discovery.schema.js';

const router = Router();

router.use(protect);

router.get('/quizzes', validate(quizDiscoverySchema), discoverQuizzes);
router.get('/quizzes/:id', getQuizDetailsForStudent);
router.get('/categories', getStudentCategories);
router.get('/leaderboard', getStudentLeaderboard);

export default router;
