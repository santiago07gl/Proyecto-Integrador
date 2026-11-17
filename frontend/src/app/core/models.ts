export type Role = 'client' | 'admin' | 'agent';
export type Status = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface User { id: number; name: string; email: string; role: Role; password?: string; }

export interface Service {
  id: number; name: string; description: string;
  price: number; duration_min: number; active: boolean;
}

export interface Reservation {
  id: number; user_id: number; service_id: number; agent_id: number | null;
  date: string; time: string; guests: number; notes: string; status: Status;
  service_name: string; price: number; client_name: string; agent_name: string | null;
}

export interface Stats {
  reservations: { total: number; pending: number; confirmed: number; completed: number; cancelled: number };
  revenue: number;
  users: { client: number; agent: number; admin: number };
  services: number;
}

export interface Country { id: number; name: string; code: string; }
export interface Department { id: number; country_id: number; name: string; country_name?: string; }
export interface City {
  id: number; department_id: number; name: string;
  department_name?: string; country_id?: number; country_name?: string;
}

export type EventStatus = 'scheduled' | 'completed' | 'cancelled';
export interface EventItem {
  id: number; title: string; description: string;
  city_id: number | null; city_name: string | null;
  event_date: string; event_time: string; capacity: number; status: EventStatus;
  agent_id: number; agent_name: string;
}

export type ReportType = 'reservations' | 'revenue' | 'users';
export interface ReportData { total: number; revenue: number; rows: { label: string; count: number; revenue: number }[]; }
export interface Report {
  id: number; title: string; type: ReportType; date_from: string; date_to: string;
  notes: string; data: ReportData; created_by: number | null; created_by_name: string | null; created_at: string;
}

export const STATUS_LABEL: Record<Status, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada', cancelled: 'Cancelada',
};
export const ROLE_LABEL: Record<Role, string> = { client: 'Cliente', admin: 'Administrador', agent: 'Agente' };

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  scheduled: 'Programado', completed: 'Realizado', cancelled: 'Cancelado',
};
export const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  reservations: 'Reservas por estado', revenue: 'Ingresos por servicio', users: 'Usuarios nuevos por rol',
};
