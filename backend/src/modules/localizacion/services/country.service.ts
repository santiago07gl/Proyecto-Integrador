import { pool } from '../../../config/db';
import { HttpError } from '../../../utils/http-error';
import { COUNTRY_COLS, Country, CountryInput } from '../models/country.model';

export const countryService = {
  async getAll(): Promise<Country[]> {
    const r = await pool.query(`SELECT ${COUNTRY_COLS} FROM countries ORDER BY name`);
    return r.rows;
  },

  async getById(id: string): Promise<Country> {
    const r = await pool.query(`SELECT ${COUNTRY_COLS} FROM countries WHERE id=$1`, [id]);
    if (!r.rows[0]) throw new HttpError(404, 'País no encontrado');
    return r.rows[0];
  },

  async create(d: CountryInput): Promise<Country> {
    const r = await pool.query(
      `INSERT INTO countries (name,code) VALUES ($1,$2) RETURNING ${COUNTRY_COLS}`, [d.name, d.code]);
    return r.rows[0];
  },

  async update(id: string, d: CountryInput): Promise<Country> {
    const r = await pool.query(
      `UPDATE countries SET name=$1,code=$2 WHERE id=$3 RETURNING ${COUNTRY_COLS}`, [d.name, d.code, id]);
    if (!r.rows[0]) throw new HttpError(404, 'País no encontrado');
    return r.rows[0];
  },

  async remove(id: string): Promise<void> {
    const r = await pool.query('DELETE FROM countries WHERE id=$1', [id]);
    if (!r.rowCount) throw new HttpError(404, 'País no encontrado');
  },
};
