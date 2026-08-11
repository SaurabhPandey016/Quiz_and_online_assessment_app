import { Router } from 'express';
import { register, login, logout, getMeProfile } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'
import { protect } from '../middleware/auth.middleware.js'; // Import protect guard

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMeProfile);

export default router;