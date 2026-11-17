import { Request, Response } from 'express';
import { parseReport } from '../models/report.model';
import { reportService } from '../services/report.service';

export const reportController = {
  getAll: async (_req: Request, res: Response) => { res.json(await reportService.getAll()); },
  getById: async (req: Request, res: Response) => { res.json(await reportService.getById(req.params.id as string)); },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await reportService.create(parseReport(req.body), req.user));
  },
  update: async (req: Request, res: Response) => {
    res.json(await reportService.update(req.params.id as string, parseReport(req.body)));
  },
  remove: async (req: Request, res: Response) => {
    await reportService.remove(req.params.id as string);
    res.json({ message: 'Reporte eliminado correctamente' });
  },
};
