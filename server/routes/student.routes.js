import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { discoverQuizzes, getQuizDetailsForStudent } from '../controllers/student.controller.js';
import { quizDiscoverySchema } from '../schemas/discovery.schema.js';

const router = Router();

// Wrap discovery parameters securely under user authorization shields
router.use(protect);

router.get('/quizzes', validate(quizDiscoverySchema), discoverQuizzes);
router.get('/quizzes/:id', getQuizDetailsForStudent);

export default router;
