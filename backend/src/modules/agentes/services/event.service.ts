import { pool } from '../../../config/db';
import { JwtUser } from '../../../middlewares/auth';
import { HttpError } from '../../../utils/http-error';
import { EVENT_BASE, EventInput, EventItem, canSeeEvent } from '../models/event.model';

async function findById(id: string | number): Promise<EventItem | undefined> {
  const r = await pool.query<EventItem>(`${EVENT_BASE} WHERE e.id=$1`, [id]);
  return r.rows[0];
}

async function findVisible(id: string, user: JwtUser): Promise<EventItem> {
  const cur = await findById(id);
  if (!cur || !canSeeEvent(user, cur)) throw new HttpError(404, 'Evento no encontrado');
  return cur;
}

export const eventService = {
  async getAll(user: JwtUser): Promise<EventItem[]> {
    let where = '';
    let params: number[] = [];
    if (user.role === 'agent') { where = 'WHERE e.agent_id=$1'; params = [user.id]; }
    if (user.role === 'client') { where = "WHERE e.status='scheduled'"; }
    const r = await pool.query<EventItem>(`${EVENT_BASE} ${where} ORDER BY e.event_date DESC, e.event_time DESC`, params);
    return r.rows;
  },

  getById: (id: string, user: JwtUser) => findVisible(id, user),

  // El agente siempre queda como responsable; el admin puede asignar a otro agente
  async create(d: EventInput, user: JwtUser): Promise<EventItem> {
    const agentId = user.role === 'admin' ? d.agent_id ?? user.id : user.id;
    const r = await pool.query(
      `INSERT INTO events (title,description,city_id,event_date,event_time,capacity,status,agent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [d.title, d.description, d.city_id, d.event_date, d.event_time, d.capacity, d.status, agentId]);
    return (await findById(r.rows[0].id))!;
  },

  async update(id: string, d: EventInput, user: JwtUser): Promise<EventItem> {
    const cur = await findVisible(id, user);
    const agentId = user.role === 'admin' ? d.agent_id ?? cur.agent_id : cur.agent_id;
    await pool.query(
      `UPDATE events SET title=$1,description=$2,city_id=$3,event_date=$4,event_time=$5,capacity=$6,status=$7,agent_id=$8
       WHERE id=$9`,
      [d.title, d.description, d.city_id, d.event_date, d.event_time, d.capacity, d.status, agentId, id]);
    return (await findById(id))!;
  },

  async remove(id: string, user: JwtUser): Promise<void> {
    await findVisible(id, user);
    await pool.query('DELETE FROM events WHERE id=$1', [id]);
  },
};
