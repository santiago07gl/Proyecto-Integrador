import { pool } from '../../../config/db';
import { JwtUser } from '../../../middlewares/auth';
import { HttpError } from '../../../utils/http-error';
import { SERVICE_COLS, ServiceInput, ServiceItem } from '../models/service.model';

export const serviceService = {
  // Admin ve todos; el resto solo los activos
  async getAll(user: JwtUser): Promise<ServiceItem[]> {
    const where = user.role === 'admin' ? '' : 'WHERE active';
    const r = await pool.query(`SELECT ${SERVICE_COLS} FROM services ${where} ORDER BY name`);
    return r.rows;
  },

  async getById(id: string, user: JwtUser): Promise<ServiceItem> {
    const r = await pool.query(`SELECT ${SERVICE_COLS} FROM services WHERE id=$1`, [id]);
    const s = r.rows[0];
    if (!s || (!s.active && user.role !== 'admin')) throw new HttpError(404, 'Servicio no encontrado');
    return s;
  },

  async create(d: ServiceInput): Promise<ServiceItem> {
    const r = await pool.query(
      `INSERT INTO services (name,description,price,duration_min,active) VALUES ($1,$2,$3,$4,$5) RETURNING ${SERVICE_COLS}`,
      [d.name, d.description, d.price, d.duration_min, d.active]);
    return r.rows[0];
  },

  async update(id: string, d: ServiceInput): Promise<ServiceItem> {
    const r = await pool.query(
      `UPDATE services SET name=$1,description=$2,price=$3,duration_min=$4,active=$5 WHERE id=$6 RETURNING ${SERVICE_COLS}`,
      [d.name, d.description, d.price, d.duration_min, d.active, id]);
    if (!r.rows[0]) throw new HttpError(404, 'Servicio no encontrado');
    return r.rows[0];
  },

  // Si tiene reservas, la BD lo impide (409): hay que desactivarlo
  async remove(id: string): Promise<void> {
    const r = await pool.query('DELETE FROM services WHERE id=$1', [id]);
    if (!r.rowCount) throw new HttpError(404, 'Servicio no encontrado');
  },
};
