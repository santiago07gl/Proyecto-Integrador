import { Request, Response } from 'express';
import { statsService } from '../services/stats.service';

export const statsController = {
  get: async (_req: Request, res: Response) => { res.json(await statsService.get()); },
};
