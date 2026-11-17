import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { countryController } from '../controllers/country.controller';

const router = Router();

// Consulta pública (datos de referencia); modificación solo admin
router.get('/', countryController.getAll);
router.get('/:id', countryController.getById);
router.post('/', auth, allow('admin'), countryController.create);
router.put('/:id', auth, allow('admin'), countryController.update);
router.delete('/:id', auth, allow('admin'), countryController.remove);

export default router;
