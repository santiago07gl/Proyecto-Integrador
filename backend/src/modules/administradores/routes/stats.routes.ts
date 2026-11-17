import { Router } from 'express';
import { allow, auth } from '../../../middlewares/auth';
import { statsController } from '../controllers/stats.controller';

const router = Router();

router.get('/', auth, allow('admin'), statsController.get);

export default router;
