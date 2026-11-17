import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { serviceController } from '../controllers/service.controller';

const router = Router();

router.use(auth);
router.get('/', serviceController.getAll);                               // GetAll (todos los roles)
router.get('/:id', serviceController.getById);                           // GetById
router.post('/', allow('admin'), serviceController.create);              // Create
router.put('/:id', allow('admin'), serviceController.update);            // Update
router.delete('/:id', allow('admin'), serviceController.remove);         // Delete

export default router;
