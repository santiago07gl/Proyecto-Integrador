import { int, str } from '../../../utils/validate';

export interface Department { id: number; country_id: number; name: string; country_name: string; }
export type DepartmentInput = { country_id: number; name: string };

export const DEPARTMENT_BASE = `SELECT d.id,d.country_id,d.name,c.name AS country_name
  FROM departments d JOIN countries c ON c.id=d.country_id`;

export function parseDepartment(b: any): DepartmentInput {
  return { country_id: int(b?.country_id, 'El país'), name: str(b?.name, 'El nombre', 100) };
}
