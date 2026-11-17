import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { userController } from '../controllers/user.controller';

const router = Router();

// CRUD de usuarios: solo administrador
router.use(auth, allow('admin'));
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

export default router;
