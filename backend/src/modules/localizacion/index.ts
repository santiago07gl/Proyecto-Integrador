import { Router } from 'express';
import cityRoutes from './routes/city.routes';
import countryRoutes from './routes/country.routes';
import departmentRoutes from './routes/department.routes';

// Módulo Localización: /api/countries · /api/departments · /api/cities
const router = Router();
router.use('/countries', countryRoutes);
router.use('/departments', departmentRoutes);
router.use('/cities', cityRoutes);

export default router;
