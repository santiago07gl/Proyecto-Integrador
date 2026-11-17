import { Router } from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

// Módulo Auth: /api/auth (login, registro, me) · /api/users (CRUD, admin)
const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
