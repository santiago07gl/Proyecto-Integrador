import { Request, Response } from 'express';
import { parseDepartment } from '../models/department.model';
import { departmentService } from '../services/department.service';

export const departmentController = {
  getAll: async (req: Request, res: Response) => {
    res.json(await departmentService.getAll(req.query.country_id as string | undefined));
  },
  getById: async (req: Request, res: Response) => { res.json(await departmentService.getById(req.params.id as string)); },
  create: async (req: Request, res: Response) => {
    res.status(201).json(await departmentService.create(parseDepartment(req.body)));
  },
  update: async (req: Request, res: Response) => {
    res.json(await departmentService.update(req.params.id as string, parseDepartment(req.body)));
  },
  remove: async (req: Request, res: Response) => {
    await departmentService.remove(req.params.id as string);
    res.json({ message: 'Departamento eliminado correctamente' });
  },
};
