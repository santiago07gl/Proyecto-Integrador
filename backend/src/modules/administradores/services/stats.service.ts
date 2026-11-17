import { pool } from '../../../config/db';

// Resumen para el panel del administrador
export const statsService = {
  async get() {
    const r = await pool.query(`
      SELECT COUNT(*)::int total,
        COUNT(*) FILTER (WHERE r.status='pending')::int pending,
        COUNT(*) FILTER (WHERE r.status='confirmed')::int confirmed,
        COUNT(*) FILTER (WHERE r.status='completed')::int completed,
        COUNT(*) FILTER (WHERE r.status='cancelled')::int cancelled,
        COALESCE(SUM(s.price) FILTER (WHERE r.status IN ('confirmed','completed')),0)::float revenue
      FROM reservations r JOIN services s ON s.id=r.service_id`);
    const u = await pool.query('SELECT role, COUNT(*)::int n FROM users GROUP BY role');
    const sv = await pool.query('SELECT COUNT(*)::int n FROM services WHERE active');
    const users: Record<string, number> = { client: 0, agent: 0, admin: 0 };
    u.rows.forEach(x => (users[x.role] = x.n));
    const { revenue, ...reservations } = r.rows[0];
    return { reservations, revenue, users, services: sv.rows[0].n };
  },
};
