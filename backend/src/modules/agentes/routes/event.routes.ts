import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { eventController } from '../controllers/event.controller';

const router = Router();

router.use(auth);
router.get('/', eventController.getAll);                                        // GetAll (filtrado por rol)
router.get('/:id', eventController.getById);                                    // GetById
router.post('/', allow('agent', 'admin'), eventController.create);              // Create
router.put('/:id', allow('agent', 'admin'), eventController.update);            // Update
router.delete('/:id', allow('agent', 'admin'), eventController.remove);         // Delete

export default router;
