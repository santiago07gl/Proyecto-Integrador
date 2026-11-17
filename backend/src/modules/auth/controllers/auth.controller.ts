import { Request, Response } from 'express';
import { parseLogin, parseRegister } from '../models/auth.model';
import { authService } from '../services/auth.service';

export const authController = {
  register: async (req: Request, res: Response) => {
    res.status(201).json(await authService.register(parseRegister(req.body)));
  },
  login: async (req: Request, res: Response) => {
    res.json(await authService.login(parseLogin(req.body)));
  },
  me: async (req: Request, res: Response) => {
    res.json(await authService.me(req.user.id));
  },
};
