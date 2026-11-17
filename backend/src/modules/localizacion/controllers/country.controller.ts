import { Request, Response } from 'express';
import { parseCountry } from '../models/country.model';
import { countryService } from '../services/country.service';

export const countryController = {
  getAll: async (_req: Request, res: Response) => { res.json(await countryService.getAll()); },
  getById: async (req: Request, res: Response) => { res.json(await countryService.getById(req.params.id as string)); },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await countryService.create(parseCountry(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(await countryService.update(req.params.id as string, parseCountry(req.body)));
  },
  remove: async (req: Request, res: Response) => {
    await countryService.remove(req.params.id as string);
    res.json({ message: 'País eliminado correctamente' });
  },
};
