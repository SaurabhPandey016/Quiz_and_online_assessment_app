import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { submitQuizAttempt } from '../controllers/grading.controller.js';
import { submitQuizSchema } from '../schemas/grading.schema.js';

const router = Router();

router.use(protect);

// Use '/' because we will explicitly define 'submit' when mounting it inside app.js
router.route('/submit').post(validate(submitQuizSchema), submitQuizAttempt);

export default router;
