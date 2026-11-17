import { Router } from 'express';
import reportRoutes from './routes/report.routes';
import serviceRoutes from './routes/service.routes';
import statsRoutes from './routes/stats.routes';

// Módulo Administradores: /api/reports · /api/services · /api/stats
const router = Router();
router.use('/reports', reportRoutes);
router.use('/services', serviceRoutes);
router.use('/stats', statsRoutes);

export default router;
