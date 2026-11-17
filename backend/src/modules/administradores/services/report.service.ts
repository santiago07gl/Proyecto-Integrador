import { pool } from '../../../config/db';
import { JwtUser } from '../../../middlewares/auth';
import { HttpError } from '../../../utils/http-error';
import { REPORT_BASE, Report, ReportData, ReportInput, ReportType } from '../models/report.model';

// Calcula los datos del reporte con información real de la base de datos
export async function buildReportData(type: ReportType, from: string, to: string): Promise<ReportData> {
  let rows: ReportData['rows'];
  if (type === 'reservations') {
    const r = await pool.query(
      `SELECT status AS label, COUNT(*)::int AS count, 0::float AS revenue
       FROM reservations WHERE date BETWEEN $1 AND $2 GROUP BY status ORDER BY status`, [from, to]);
    rows = r.rows;
  } else if (type === 'revenue') {
    const r = await pool.query(
      `SELECT s.name AS label, COUNT(*)::int AS count, COALESCE(SUM(s.price),0)::float AS revenue
       FROM reservations r JOIN services s ON s.id=r.service_id
       WHERE r.date BETWEEN $1 AND $2 AND r.status IN ('confirmed','completed')
       GROUP BY s.name ORDER BY revenue DESC`, [from, to]);
    rows = r.rows;
  } else {
    const r = await pool.query(
      `SELECT role AS label, COUNT(*)::int AS count, 0::float AS revenue
       FROM users WHERE created_at::date BETWEEN $1 AND $2 GROUP BY role ORDER BY role`, [from, to]);
    rows = r.rows;
  }
  return {
    total: rows.reduce((a, x) => a + x.count, 0),
    revenue: rows.reduce((a, x) => a + x.revenue, 0),
    rows,
  };
}

async function findById(id: string | number): Promise<Report> {
  const r = await pool.query<Report>(`${REPORT_BASE} WHERE r.id=$1`, [id]);
  if (!r.rows[0]) throw new HttpError(404, 'Reporte no encontrado');
  return r.rows[0];
}

export const reportService = {
  async getAll(): Promise<Report[]> {
    const r = await pool.query<Report>(`${REPORT_BASE} ORDER BY r.created_at DESC, r.id DESC`);
    return r.rows;
  },

  getById: (id: string) => findById(id),

  async create(d: ReportInput, user: JwtUser): Promise<Report> {
    const data = await buildReportData(d.type, d.date_from, d.date_to);
    const r = await pool.query(
      `INSERT INTO reports (title,type,date_from,date_to,notes,data,created_by)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7) RETURNING id`,
      [d.title, d.type, d.date_from, d.date_to, d.notes, JSON.stringify(data), user.id]);
    return findById(r.rows[0].id);
  },

  // Al editar se recalculan los datos con los parámetros nuevos
  async update(id: string, d: ReportInput): Promise<Report> {
    const data = await buildReportData(d.type, d.date_from, d.date_to);
    const r = await pool.query(
      `UPDATE reports SET title=$1,type=$2,date_from=$3,date_to=$4,notes=$5,data=$6::jsonb WHERE id=$7`,
      [d.title, d.type, d.date_from, d.date_to, d.notes, JSON.stringify(data), id]);
    if (!r.rowCount) throw new HttpError(404, 'Reporte no encontrado');
    return findById(id);
  },

  async remove(id: string): Promise<void> {
    const r = await pool.query('DELETE FROM reports WHERE id=$1', [id]);
    if (!r.rowCount) throw new HttpError(404, 'Reporte no encontrado');
  },
};
