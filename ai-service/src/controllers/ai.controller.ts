import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';

export class AiController {
  async handleQuery(req: Request, res: Response): Promise<void> {
    try {
      const { query, branchScope, dateFrom, dateTo } = req.body;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ success: false, error: 'Query parameter is required.' });
        return;
      }

      const result = await aiService.processExecutiveQuery({
        query,
        branchScope,
        dateFrom,
        dateTo,
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'AI service error.' });
    }
  }

  getHealth(_req: Request, res: Response): void {
    res.json({
      status: 'ok',
      service: 'hospital-ai-microservice',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  }
}

export const aiController = new AiController();
