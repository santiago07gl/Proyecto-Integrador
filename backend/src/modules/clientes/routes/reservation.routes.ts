import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { reservationController } from '../controllers/reservation.controller';

const router = Router();

router.use(auth);
router.get('/', reservationController.getAll);                                   // GetAll (filtrado por rol)
router.get('/:id', reservationController.getById);                               // GetById
router.post('/', allow('client', 'admin'), reservationController.create);        // Create
router.put('/:id', allow('client', 'admin'), reservationController.update);      // Update
router.patch('/:id/status', reservationController.setStatus);                    // Cambio de estado (todos los roles)
router.delete('/:id', allow('client', 'admin'), reservationController.remove);   // Delete

export default router;
