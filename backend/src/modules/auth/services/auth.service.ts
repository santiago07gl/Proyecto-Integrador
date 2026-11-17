import bcrypt from 'bcryptjs';
import { pool } from '../../../config/db';
import { sign } from '../../../middlewares/auth';
import { HttpError } from '../../../utils/http-error';
import { LoginInput, RegisterInput } from '../models/auth.model';
import { USER_COLS, User } from '../models/user.model';

const session = (u: any) => ({
  token: sign({ id: u.id, role: u.role, name: u.name }),
  user: { id: u.id, name: u.name, email: u.email, role: u.role } as User,
});

export const authService = {
  // El registro público siempre crea un cliente
  async register(d: RegisterInput) {
    const r = await pool.query(
      `INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,'client') RETURNING ${USER_COLS}`,
      [d.name, d.email, bcrypt.hashSync(d.password, 10)]);
    return session(r.rows[0]);
  },

  async login(d: LoginInput) {
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [d.email]);
    const u = r.rows[0];
    if (!u || !bcrypt.compareSync(d.password, u.password_hash)) {
      throw new HttpError(401, 'Correo o contraseña incorrectos');
    }
    return session(u);
  },

  async me(id: number): Promise<User> {
    const r = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id=$1`, [id]);
    if (!r.rows[0]) throw new HttpError(404, 'Usuario no encontrado');
    return r.rows[0];
  },
};
