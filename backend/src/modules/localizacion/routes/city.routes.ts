import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { cityController } from '../controllers/city.controller';

const router = Router();

// Consulta pública (datos de referencia); modificación solo admin
router.get('/', cityController.getAll);
router.get('/:id', cityController.getById);
router.post('/', auth, allow('admin'), cityController.create);
router.put('/:id', auth, allow('admin'), cityController.update);
router.delete('/:id', auth, allow('admin'), cityController.remove);

export default router;
