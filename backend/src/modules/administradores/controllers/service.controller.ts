import { Request, Response } from 'express';
import { parseService } from '../models/service.model';
import { serviceService } from '../services/service.service';

export const serviceController = {
  getAll: async (req: Request, res: Response) => { res.json(await serviceService.getAll(req.user)); },
  getById: async (req: Request, res: Response) => { res.json(await serviceService.getById(req.params.id as string, req.user)); },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await serviceService.create(parseService(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(await serviceService.update(req.params.id as string, parseService(req.body)));
  },
  remove: async (req: Request, res: Response) => {
    await serviceService.remove(req.params.id as string);
    res.json({ message: 'Servicio eliminado correctamente' });
  },
};
