import { Request, Response } from 'express';
import { parseUser } from '../models/user.model';
import { userService } from '../services/user.service';

export const userController = {
  getAll: async (_req: Request, res: Response) => { res.json(await userService.getAll()); },
  getById: async (req: Request, res: Response) => { res.json(await userService.getById(req.params.id as string)); },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await userService.create(parseUser(req.body, true)));
  },
  update: async (req: Request, res: Response) => {
    res.json(await userService.update(req.params.id as string, parseUser(req.body, false)));
  },
  remove: async (req: Request, res: Response) => {
    await userService.remove(req.params.id as string, req.user.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  },
};
