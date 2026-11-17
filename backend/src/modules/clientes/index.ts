import { Router } from 'express';
import reservationRoutes from './routes/reservation.routes';

// Módulo Clientes: /api/reservations
const router = Router();
router.use('/reservations', reservationRoutes);

export default router;
