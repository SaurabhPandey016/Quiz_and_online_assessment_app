import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { getAllUsersAdmin, createUserAdmin, updateUserAdmin, deleteUserAdmin } from '../controllers/user.controller.js';
import { createUserAdminSchema, updateUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.route('/')
  .get(getAllUsersAdmin)
  .post(validate(createUserAdminSchema), createUserAdmin);

router.route('/:id')
  .patch(validate(updateUserSchema), updateUserAdmin)
  .delete(deleteUserAdmin);

export default router;
