import { Request, Response } from 'express';
import { parseEvent } from '../models/event.model';
import { eventService } from '../services/event.service';

export const eventController = {
  getAll: async (req: Request, res: Response) => { res.json(await eventService.getAll(req.user)); },
  getById: async (req: Request, res: Response) => { res.json(await eventService.getById(req.params.id as string, req.user)); },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await eventService.create(parseEvent(req.body), req.user));
  },
  update: async (req: Request, res: Response) => {
    res.json(await eventService.update(req.params.id as string, parseEvent(req.body), req.user));
  },
  remove: async (req: Request, res: Response) => {
    await eventService.remove(req.params.id as string, req.user);
    res.json({ message: 'Evento eliminado correctamente' });
  },
};
