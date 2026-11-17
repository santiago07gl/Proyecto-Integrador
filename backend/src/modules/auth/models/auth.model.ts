import { HttpError } from '../../../utils/http-error';
import { email, str } from '../../../utils/validate';

export interface LoginInput { email: string; password: string; }
export interface RegisterInput { name: string; email: string; password: string; }

export function parseLogin(b: any): LoginInput {
  if (typeof b?.email !== 'string' || typeof b?.password !== 'string' || !b.email.trim() || !b.password) {
    throw new HttpError(400, 'Ingresa correo y contraseña');
  }
  return { email: b.email.trim().toLowerCase(), password: b.password };
}

export function parseRegister(b: any): RegisterInput {
  if (typeof b?.password !== 'string' || b.password.length < 6) {
    throw new HttpError(400, 'La contraseña debe tener al menos 6 caracteres');
  }
  return { name: str(b?.name, 'El nombre', 100), email: email(b?.email), password: b.password };
}
