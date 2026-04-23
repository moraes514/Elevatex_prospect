import { Router } from 'express';
import collectorRoutes from './modules/collector/collector.routes';
import leadRoutes from './modules/lead/lead.routes';

const router = Router();

router.use('/leads', leadRoutes);
router.use('/collector', collectorRoutes); // ou podemos colocar o /search aqui também

export default router;
