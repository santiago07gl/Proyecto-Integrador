import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { reportController } from '../controllers/report.controller';

const router = Router();

// CRUD de reportes: solo administrador
router.use(auth, allow('admin'));
router.get('/', reportController.getAll);
router.get('/:id', reportController.getById);
router.post('/', reportController.create);
router.put('/:id', reportController.update);
router.delete('/:id', reportController.remove);

export default router;
