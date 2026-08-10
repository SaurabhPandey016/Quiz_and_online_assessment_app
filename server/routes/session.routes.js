import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { initializeQuizAttempt, getStudentAttemptHistory } from '../controllers/session.controller.js';
import { startQuizSchema } from '../schemas/session.schema.js';

const router = Router();

// Shield all endpoints underneath active authentication checks
router.use(protect);

router.post('/start', validate(startQuizSchema), initializeQuizAttempt);
router.get('/history', getStudentAttemptHistory);

export default router;
