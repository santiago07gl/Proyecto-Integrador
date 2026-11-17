import { Router } from 'express';
import eventRoutes from './routes/event.routes';

// Módulo Agentes: /api/events
const router = Router();
router.use('/events', eventRoutes);

export default router;
