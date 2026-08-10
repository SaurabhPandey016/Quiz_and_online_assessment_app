import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { getAdminDashboardStats } from '../controllers/analytics.controller.js';

const router = Router();

// Secure data routes exclusively for platform managers
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/dashboard', getAdminDashboardStats);

export default router;
