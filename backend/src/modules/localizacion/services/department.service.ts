import { pool } from '../../../config/db';
import { HttpError } from '../../../utils/http-error';
import { DEPARTMENT_BASE, Department, DepartmentInput } from '../models/department.model';

export const departmentService = {
  // Filtro opcional: ?country_id=
  async getAll(countryId?: string): Promise<Department[]> {
    const r = countryId
      ? await pool.query(`${DEPARTMENT_BASE} WHERE d.country_id=$1 ORDER BY d.name`, [countryId])
      : await pool.query(`${DEPARTMENT_BASE} ORDER BY c.name, d.name`);
    return r.rows;
  },

  async getById(id: string): Promise<Department> {
    const r = await pool.query(`${DEPARTMENT_BASE} WHERE d.id=$1`, [id]);
    if (!r.rows[0]) throw new HttpError(404, 'Departamento no encontrado');
    return r.rows[0];
  },

  async create(d: DepartmentInput): Promise<Department> {
    const r = await pool.query(
      'INSERT INTO departments (country_id,name) VALUES ($1,$2) RETURNING id', [d.country_id, d.name]);
    return this.getById(String(r.rows[0].id));
  },

  async update(id: string, d: DepartmentInput): Promise<Department> {
    const r = await pool.query(
      'UPDATE departments SET country_id=$1,name=$2 WHERE id=$3', [d.country_id, d.name, id]);
    if (!r.rowCount) throw new HttpError(404, 'Departamento no encontrado');
    return this.getById(id);
  },

  async remove(id: string): Promise<void> {
    const r = await pool.query('DELETE FROM departments WHERE id=$1', [id]);
    if (!r.rowCount) throw new HttpError(404, 'Departamento no encontrado');
  },
};
