import { pool } from '../../../config/db';
import { HttpError } from '../../../utils/http-error';
import { CITY_BASE, City, CityInput } from '../models/city.model';

export const cityService = {
  // Filtro opcional: ?department_id=
  async getAll(departmentId?: string): Promise<City[]> {
    const r = departmentId
      ? await pool.query(`${CITY_BASE} WHERE ci.department_id=$1 ORDER BY ci.name`, [departmentId])
      : await pool.query(`${CITY_BASE} ORDER BY c.name, d.name, ci.name`);
    return r.rows;
  },

  async getById(id: string): Promise<City> {
    const r = await pool.query(`${CITY_BASE} WHERE ci.id=$1`, [id]);
    if (!r.rows[0]) throw new HttpError(404, 'Ciudad no encontrada');
    return r.rows[0];
  },

  async create(d: CityInput): Promise<City> {
    const r = await pool.query(
      'INSERT INTO cities (department_id,name) VALUES ($1,$2) RETURNING id', [d.department_id, d.name]);
    return this.getById(String(r.rows[0].id));
  },

  async update(id: string, d: CityInput): Promise<City> {
    const r = await pool.query(
      'UPDATE cities SET department_id=$1,name=$2 WHERE id=$3', [d.department_id, d.name, id]);
    if (!r.rowCount) throw new HttpError(404, 'Ciudad no encontrada');
    return this.getById(id);
  },

  async remove(id: string): Promise<void> {
    const r = await pool.query('DELETE FROM cities WHERE id=$1', [id]);
    if (!r.rowCount) throw new HttpError(404, 'Ciudad no encontrada');
  },
};
