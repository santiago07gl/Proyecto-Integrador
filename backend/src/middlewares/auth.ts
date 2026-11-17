import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type Role = 'client' | 'admin' | 'agent';
export interface JwtUser { id: number; role: Role; name: string; }

declare global {
  namespace Express {
    interface Request { user: JwtUser; }
  }
}

const SECRET = process.env.JWT_SECRET || 'kroni-dev-secret';

export const sign = (u: JwtUser): string =>
  jwt.sign({ id: u.id, role: u.role, name: u.name }, SECRET, { expiresIn: '8h' });

// Exige un token JWT válido
export function auth(req: Request, res: Response, next: NextFunction): void {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) { res.status(401).json({ message: 'No autenticado' }); return; }
  try {
    req.user = jwt.verify(token, SECRET) as JwtUser;
    next();
  } catch {
    res.status(401).json({ message: 'Sesión inválida o vencida' });
  }
}

// Restringe el endpoint a ciertos roles
export const allow = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction): void => {
  if (roles.includes(req.user.role)) next();
  else res.status(403).json({ message: 'No tienes permisos para esta acción' });
};
