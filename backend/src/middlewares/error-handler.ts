import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error';

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: 'Ruta no encontrada' });
}

// Respuesta de error uniforme: { message } con 400, 401, 403, 404, 409 o 500.
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) { res.status(err.status).json({ message: err.message }); return; }
  if (err?.type === 'entity.parse.failed') { res.status(400).json({ message: 'JSON inválido' }); return; }
  switch (err?.code) {
    case '23503':
      if (String(err.detail || '').includes('is not present')) {
        res.status(400).json({ message: 'Hace referencia a un registro que no existe' });
      } else {
        res.status(409).json({ message: 'No se puede eliminar: tiene registros relacionados' });
      }
      return;
    case '23505': res.status(409).json({ message: 'Ya existe un registro con esos datos' }); return;
    case '23514': res.status(400).json({ message: 'Los datos no cumplen las reglas del sistema' }); return;
    case '22P02':
    case '22007':
    case '22008':
    case '22003': res.status(400).json({ message: 'Datos con formato inválido' }); return;
  }
  console.error(err);
  res.status(500).json({ message: 'Error del servidor' });
}
