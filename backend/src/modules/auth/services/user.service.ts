import bcrypt from 'bcryptjs';
import { pool } from '../../../config/db';
import { HttpError } from '../../../utils/http-error';
import { USER_COLS, User, UserInput } from '../models/user.model';

export const userService = {
  async getAll(): Promise<User[]> {
    const r = await pool.query(`SELECT ${USER_COLS} FROM users ORDER BY id`);
    return r.rows;
  },

  async getById(id: string): Promise<User> {
    const r = await pool.query(`SELECT ${USER_COLS} FROM users WHERE id=$1`, [id]);
    if (!r.rows[0]) throw new HttpError(404, 'Usuario no encontrado');
    return r.rows[0];
  },

  async create(d: UserInput): Promise<User> {
    const r = await pool.query(
      `INSERT INTO users (name,email,password_hash,role) VALUES ($1,$2,$3,$4) RETURNING ${USER_COLS}`,
      [d.name, d.email, bcrypt.hashSync(d.password!, 10), d.role]);
    return r.rows[0];
  },

  async update(id: string, d: UserInput): Promise<User> {
    const hash = d.password ? bcrypt.hashSync(d.password, 10) : null;
    const r = await pool.query(
      `UPDATE users SET name=$1,email=$2,role=$3,password_hash=COALESCE($4,password_hash)
       WHERE id=$5 RETURNING ${USER_COLS}`,
      [d.name, d.email, d.role, hash, id]);
    if (!r.rows[0]) throw new HttpError(404, 'Usuario no encontrado');
    return r.rows[0];
  },

  async remove(id: string, requesterId: number): Promise<void> {
    if (Number(id) === requesterId) throw new HttpError(400, 'No puedes eliminar tu propio usuario');
    const r = await pool.query('DELETE FROM users WHERE id=$1', [id]);
    if (!r.rowCount) throw new HttpError(404, 'Usuario no encontrado');
  },
};
