import { Router, Request, Response, NextFunction } from 'express';
import { knowledgeService } from './knowledge.service';
import { authenticate } from '../../common/auth/auth.middleware';

const router = Router();

router.get(
  '/search',
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.q as string) || '';
      const roles = req.user?.roles || [];
      const branches = req.user?.assignedBranches || [];

      const chunks = await knowledgeService.searchKnowledge(query, roles, branches);

      res.json({
        data: chunks,
        meta: { totalItems: chunks.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }
);

export const knowledgeRoutes = router;
