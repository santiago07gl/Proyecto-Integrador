import { int, str } from '../../../utils/validate';

export interface City {
  id: number; department_id: number; name: string;
  department_name: string; country_id: number; country_name: string;
}
export type CityInput = { department_id: number; name: string };

export const CITY_BASE = `SELECT ci.id,ci.department_id,ci.name,
  d.name AS department_name,d.country_id,c.name AS country_name
  FROM cities ci JOIN departments d ON d.id=ci.department_id JOIN countries c ON c.id=d.country_id`;

export function parseCity(b: any): CityInput {
  return { department_id: int(b?.department_id, 'El departamento'), name: str(b?.name, 'El nombre', 100) };
}
