import { pool } from '../../../config/db';
import { JwtUser } from '../../../middlewares/auth';
import { HttpError } from '../../../utils/http-error';
import {
  RESERVATION_BASE, Reservation, ReservationInput, Status, canSee,
} from '../models/reservation.model';

const notFound = () => new HttpError(404, 'Reserva no encontrada');

async function findById(id: string | number): Promise<Reservation | undefined> {
  const r = await pool.query<Reservation>(`${RESERVATION_BASE} WHERE r.id=$1`, [id]);
  return r.rows[0];
}

async function findVisible(id: string, user: JwtUser): Promise<Reservation> {
  const cur = await findById(id);
  if (!cur || !canSee(user, cur)) throw notFound();
  return cur;
}

export const reservationService = {
  // Cliente: las suyas · Agente: las suyas y las sin asignar · Admin: todas
  async getAll(user: JwtUser): Promise<Reservation[]> {
    let where = '';
    let params: number[] = [];
    if (user.role === 'client') { where = 'WHERE r.user_id=$1'; params = [user.id]; }
    if (user.role === 'agent') { where = 'WHERE r.agent_id=$1 OR r.agent_id IS NULL'; params = [user.id]; }
    const r = await pool.query<Reservation>(`${RESERVATION_BASE} ${where} ORDER BY r.date DESC, r.time DESC`, params);
    return r.rows;
  },

  getById: (id: string, user: JwtUser) => findVisible(id, user),

  async create(d: ReservationInput, user: JwtUser): Promise<Reservation> {
    const admin = user.role === 'admin';
    const ins = await pool.query(
      `INSERT INTO reservations (user_id,service_id,agent_id,date,time,guests,notes,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [admin && d.user_id ? d.user_id : user.id, d.service_id,
       admin ? d.agent_id ?? null : null, d.date, d.time, d.guests ?? 1, d.notes ?? '',
       admin && d.status ? d.status : 'pending']);
    return (await findById(ins.rows[0].id))!;
  },

  // Cliente: solo las suyas y pendientes · Admin: todo
  async update(id: string, d: ReservationInput, user: JwtUser): Promise<Reservation> {
    const cur = await findVisible(id, user);
    const admin = user.role === 'admin';
    if (!admin && cur.status !== 'pending') throw new HttpError(400, 'Solo puedes editar reservas pendientes');
    const v = {
      service_id: d.service_id ?? cur.service_id, date: d.date ?? cur.date, time: d.time ?? cur.time,
      guests: d.guests ?? cur.guests, notes: d.notes ?? cur.notes,
      user_id: admin ? d.user_id ?? cur.user_id : cur.user_id,
      agent_id: admin ? (d.agent_id === undefined ? cur.agent_id : d.agent_id) : cur.agent_id,
      status: admin && d.status ? d.status : cur.status,
    };
    await pool.query(
      `UPDATE reservations SET service_id=$1,date=$2,time=$3,guests=$4,notes=$5,user_id=$6,agent_id=$7,status=$8 WHERE id=$9`,
      [v.service_id, v.date, v.time, v.guests, v.notes, v.user_id, v.agent_id, v.status, id]);
    return (await findById(id))!;
  },

  // Cliente: cancelar · Agente: atender (queda asignado) · Admin: todo
  async setStatus(id: string, status: Status, agentId: number | null | undefined, user: JwtUser): Promise<Reservation> {
    const cur = await findVisible(id, user);
    if (user.role === 'client' && (status !== 'cancelled' || !['pending', 'confirmed'].includes(cur.status))) {
      throw new HttpError(403, 'Solo puedes cancelar reservas activas');
    }
    if (user.role === 'agent' && status === 'pending') {
      throw new HttpError(403, 'Un agente no puede dejar la reserva en pendiente');
    }
    let agent = cur.agent_id;
    if (user.role === 'agent') agent = user.id;
    if (user.role === 'admin' && agentId !== undefined) agent = agentId;
    await pool.query('UPDATE reservations SET status=$1, agent_id=$2 WHERE id=$3', [status, agent, id]);
    return (await findById(id))!;
  },

  // Cliente: pendientes o canceladas propias · Admin: cualquiera
  async remove(id: string, user: JwtUser): Promise<void> {
    const cur = await findVisible(id, user);
    if (user.role === 'client' && !['pending', 'cancelled'].includes(cur.status)) {
      throw new HttpError(400, 'Solo puedes eliminar reservas pendientes o canceladas');
    }
    await pool.query('DELETE FROM reservations WHERE id=$1', [id]);
  },
};
