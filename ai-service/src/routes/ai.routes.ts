import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';

const router = Router();

router.post('/query', (req, res) => aiController.handleQuery(req, res));
router.get('/health', (req, res) => aiController.getHealth(req, res));

export const aiRoutes = router;
