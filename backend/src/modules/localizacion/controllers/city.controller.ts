import { Request, Response } from 'express';
import { parseCity } from '../models/city.model';
import { cityService } from '../services/city.service';

export const cityController = {
  getAll: async (req: Request, res: Response) => {
    res.json(await cityService.getAll(req.query.department_id as string | undefined));
  },
  getById: async (req: Request, res: Response) => { res.json(await cityService.getById(req.params.id as string)); },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await cityService.create(parseCity(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(await cityService.update(req.params.id as string, parseCity(req.body)));
  },
  remove: async (req: Request, res: Response) => {
    await cityService.remove(req.params.id as string);
    res.json({ message: 'Ciudad eliminada correctamente' });
  },
};
