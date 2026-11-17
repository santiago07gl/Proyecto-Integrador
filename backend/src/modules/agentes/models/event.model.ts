import { JwtUser } from '../../../middlewares/auth';
import { date, int, nullableInt, oneOf, optInt, optStr, str, time } from '../../../utils/validate';

export type EventStatus = 'scheduled' | 'completed' | 'cancelled';
export const EVENT_STATUSES: readonly EventStatus[] = ['scheduled', 'completed', 'cancelled'];

export interface EventItem {
  id: number; title: string; description: string;
  city_id: number | null; city_name: string | null;
  event_date: string; event_time: string; capacity: number; status: EventStatus;
  agent_id: number; agent_name: string;
}

export interface EventInput {
  title: string; description: string; city_id: number | null;
  event_date: string; event_time: string; capacity: number; status: EventStatus;
  agent_id?: number; // solo lo puede fijar el administrador
}

export const EVENT_BASE = `SELECT e.id,e.title,e.description,e.city_id,c.name AS city_name,
  to_char(e.event_date,'YYYY-MM-DD') AS event_date, to_char(e.event_time,'HH24:MI') AS event_time,
  e.capacity,e.status,e.agent_id,u.name AS agent_name
  FROM events e
  LEFT JOIN cities c ON c.id=e.city_id
  JOIN users u ON u.id=e.agent_id`;

export function parseEvent(b: any): EventInput {
  const out: EventInput = {
    title: str(b?.title, 'El título', 150),
    description: optStr(b?.description, 'La descripción') ?? '',
    city_id: nullableInt(b?.city_id, 'La ciudad') ?? null,
    event_date: date(b?.event_date, 'La fecha'),
    event_time: time(b?.event_time, 'La hora'),
    capacity: b?.capacity === undefined ? 50 : int(b.capacity, 'La capacidad', 1, 100000),
    status: b?.status === undefined || b.status === null ? 'scheduled' : oneOf(b.status, EVENT_STATUSES, 'El estado'),
  };
  const agentId = optInt(b?.agent_id, 'El agente');
  if (agentId !== undefined) out.agent_id = agentId;
  return out;
}

// Admin: todos · Agente: los suyos · Cliente: solo los programados (lectura)
export const canSeeEvent = (u: JwtUser, e: EventItem): boolean =>
  u.role === 'admin' ||
  (u.role === 'agent' && e.agent_id === u.id) ||
  (u.role === 'client' && e.status === 'scheduled');
