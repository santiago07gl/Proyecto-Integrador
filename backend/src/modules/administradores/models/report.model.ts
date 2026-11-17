import { HttpError } from '../../../utils/http-error';
import { date, oneOf, optStr, str } from '../../../utils/validate';

export type ReportType = 'reservations' | 'revenue' | 'users';
export const REPORT_TYPES: readonly ReportType[] = ['reservations', 'revenue', 'users'];

export interface ReportData {
  total: number;
  revenue: number;
  rows: { label: string; count: number; revenue: number }[];
}

export interface Report {
  id: number; title: string; type: ReportType; date_from: string; date_to: string;
  notes: string; data: ReportData; created_by: number | null; created_by_name: string | null; created_at: string;
}

export interface ReportInput { title: string; type: ReportType; date_from: string; date_to: string; notes: string; }

export const REPORT_BASE = `SELECT r.id,r.title,r.type,
  to_char(r.date_from,'YYYY-MM-DD') AS date_from, to_char(r.date_to,'YYYY-MM-DD') AS date_to,
  r.notes,r.data,r.created_by,u.name AS created_by_name,
  to_char(r.created_at,'YYYY-MM-DD HH24:MI') AS created_at
  FROM reports r LEFT JOIN users u ON u.id=r.created_by`;

export function parseReport(b: any): ReportInput {
  const out: ReportInput = {
    title: str(b?.title, 'El título', 150),
    type: oneOf(b?.type, REPORT_TYPES, 'El tipo de reporte'),
    date_from: date(b?.date_from, 'La fecha inicial'),
    date_to: date(b?.date_to, 'La fecha final'),
    notes: optStr(b?.notes, 'Las notas') ?? '',
  };
  if (out.date_from > out.date_to) throw new HttpError(400, 'La fecha inicial no puede ser posterior a la final');
  return out;
}
