import { Router } from 'express';
import { auth } from '../../../middlewares/auth';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register); // Registro (público)
router.post('/login', authController.login);       // Inicio de sesión (público)
router.get('/me', auth, authController.me);         // Usuario actual

export default router;
