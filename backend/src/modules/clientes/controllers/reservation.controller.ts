import { Request, Response } from 'express';
import { parseReservation, parseStatusChange } from '../models/reservation.model';
import { reservationService } from '../services/reservation.service';

export const reservationController = {
  getAll: async (req: Request, res: Response) => { res.json(await reservationService.getAll(req.user)); },
  getById: async (req: Request, res: Response) => {
    res.json(await reservationService.getById(req.params.id as string, req.user));
  },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await reservationService.create(parseReservation(req.body, true), req.user));
  },
  update: async (req: Request, res: Response) => {
    res.json(await reservationService.update(req.params.id as string, parseReservation(req.body, false), req.user));
  },
  setStatus: async (req: Request, res: Response) => {
    const { status, agent_id } = parseStatusChange(req.body);
    res.json(await reservationService.setStatus(req.params.id as string, status, agent_id, req.user));
  },
  remove: async (req: Request, res: Response) => {
    await reservationService.remove(req.params.id as string, req.user);
    res.json({ message: 'Reserva eliminada correctamente' });
  },
};
