import { Role } from '../../../middlewares/auth';
import { HttpError } from '../../../utils/http-error';
import { email, oneOf, str } from '../../../utils/validate';

export const ROLES: readonly Role[] = ['client', 'admin', 'agent'];

export interface User { id: number; name: string; email: string; role: Role; }
export interface UserInput { name: string; email: string; role: Role; password?: string; }

export const USER_COLS = 'id,name,email,role';

// Crear: contraseña obligatoria. Editar: contraseña opcional.
export function parseUser(b: any, passwordRequired: boolean): UserInput {
  const out: UserInput = {
    name: str(b?.name, 'El nombre', 100),
    email: email(b?.email),
    role: oneOf(b?.role, ROLES, 'El rol'),
  };
  if (passwordRequired || (b?.password !== undefined && b.password !== '' && b.password !== null)) {
    if (typeof b?.password !== 'string' || b.password.length < 6) {
      throw new HttpError(400, 'La contraseña debe tener al menos 6 caracteres');
    }
    out.password = b.password;
  }
  return out;
}
