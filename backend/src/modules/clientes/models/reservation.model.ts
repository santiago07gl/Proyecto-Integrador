import { JwtUser } from '../../../middlewares/auth';
import { HttpError } from '../../../utils/http-error';
import { date, int, nullableInt, oneOf, optInt, optStr, time } from '../../../utils/validate';

export type Status = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export const STATUSES: readonly Status[] = ['pending', 'confirmed', 'completed', 'cancelled'];

export interface Reservation {
  id: number; user_id: number; service_id: number; agent_id: number | null;
  date: string; time: string; guests: number; notes: string; status: Status;
  service_name: string; price: number; client_name: string; agent_name: string | null;
}

// Campos opcionales: en PUT solo se cambian los enviados; user_id, agent_id y status solo aplican al admin.
export interface ReservationInput {
  service_id?: number; date?: string; time?: string; guests?: number; notes?: string;
  user_id?: number; agent_id?: number | null; status?: Status;
}

export const RESERVATION_BASE = `SELECT r.id,r.user_id,r.service_id,r.agent_id,
  to_char(r.date,'YYYY-MM-DD') AS date, to_char(r.time,'HH24:MI') AS time,
  r.guests,r.notes,r.status,
  s.name AS service_name, s.price::float AS price,
  u.name AS client_name, a.name AS agent_name
  FROM reservations r
  JOIN services s ON s.id=r.service_id
  JOIN users u ON u.id=r.user_id
  LEFT JOIN users a ON a.id=r.agent_id`;

export function parseReservation(b: any, creating: boolean): ReservationInput {
  b = b ?? {};
  if (creating && (!b.service_id || !b.date || !b.time)) {
    throw new HttpError(400, 'Elige servicio, fecha y hora');
  }
  const out: ReservationInput = {};
  if (b.service_id !== undefined && b.service_id !== null) out.service_id = int(b.service_id, 'El servicio');
  if (b.date !== undefined) out.date = date(b.date, 'La fecha');
  if (b.time !== undefined) out.time = time(b.time, 'La hora');
  if (b.guests !== undefined) out.guests = int(b.guests, 'El número de personas', 1, 50);
  const notes = optStr(b.notes, 'Las notas');
  if (notes !== undefined) out.notes = notes;
  const userId = optInt(b.user_id, 'El cliente');
  if (userId !== undefined) out.user_id = userId;
  const agentId = nullableInt(b.agent_id, 'El agente');
  if (agentId !== undefined) out.agent_id = agentId;
  if (b.status !== undefined && b.status !== null) out.status = oneOf(b.status, STATUSES, 'El estado');
  return out;
}

export function parseStatusChange(b: any): { status: Status; agent_id?: number | null } {
  const out: { status: Status; agent_id?: number | null } = { status: oneOf(b?.status, STATUSES, 'El estado') };
  const agentId = nullableInt(b?.agent_id, 'El agente');
  if (agentId !== undefined) out.agent_id = agentId;
  return out;
}

export const canSee = (u: JwtUser, r: Reservation): boolean =>
  u.role === 'admin' ||
  (u.role === 'client' && r.user_id === u.id) ||
  (u.role === 'agent' && (r.agent_id === null || r.agent_id === u.id));
