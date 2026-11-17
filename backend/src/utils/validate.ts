import { HttpError } from './http-error';

const bad = (m: string) => new HttpError(400, m);

export function str(v: unknown, label: string, max = 255): string {
  if (typeof v !== 'string' || !v.trim()) throw bad(`${label} es obligatorio`);
  if (v.trim().length > max) throw bad(`${label} no puede superar ${max} caracteres`);
  return v.trim();
}

export function optStr(v: unknown, label: string, max = 2000): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'string') throw bad(`${label} no es válido`);
  if (v.trim().length > max) throw bad(`${label} no puede superar ${max} caracteres`);
  return v.trim();
}

export function int(v: unknown, label: string, min = 1, max = 2_000_000_000): number {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) throw bad(`${label} no es válido`);
  return n;
}

// undefined/null/'' => undefined (no enviado)
export function optInt(v: unknown, label: string, min = 1, max = 2_000_000_000): number | undefined {
  return v === undefined || v === null || v === '' ? undefined : int(v, label, min, max);
}

// undefined => no enviado; null/'' => null; otro => entero
export function nullableInt(v: unknown, label: string): number | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  return int(v, label);
}

export function num(v: unknown, label: string, min = 0): number {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isFinite(n) || n < min) throw bad(`${label} no es válido`);
  return n;
}

export function bool(v: unknown, label: string): boolean {
  if (typeof v !== 'boolean') throw bad(`${label} no es válido`);
  return v;
}

export function date(v: unknown, label: string): string {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) {
    throw bad(`${label} debe tener formato AAAA-MM-DD`);
  }
  return v;
}

export function time(v: unknown, label: string): string {
  if (typeof v !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v)) {
    throw bad(`${label} debe tener formato HH:MM`);
  }
  return v.slice(0, 5);
}

export function oneOf<T extends string>(v: unknown, list: readonly T[], label: string): T {
  if (typeof v !== 'string' || !list.includes(v as T)) throw bad(`${label} no es válido`);
  return v as T;
}

export function email(v: unknown): string {
  const e = str(v, 'El correo', 150).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw bad('El correo no es válido');
  return e;
}
