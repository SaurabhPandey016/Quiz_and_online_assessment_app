import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { getAllUsersAdmin, updateUserAdmin, deleteUserAdmin } from '../controllers/user.controller.js';
import { updateUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.route('/')
  .get(getAllUsersAdmin);

router.route('/:id')
  .patch(validate(updateUserSchema), updateUserAdmin)
  .delete(deleteUserAdmin);

export default router;
