import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { departmentController } from '../controllers/department.controller';

const router = Router();

// Consulta pública (datos de referencia); modificación solo admin
router.get('/', departmentController.getAll);
router.get('/:id', departmentController.getById);
router.post('/', auth, allow('admin'), departmentController.create);
router.put('/:id', auth, allow('admin'), departmentController.update);
router.delete('/:id', auth, allow('admin'), departmentController.remove);

export default router;
