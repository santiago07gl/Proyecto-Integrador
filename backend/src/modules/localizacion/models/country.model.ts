import { str } from '../../../utils/validate';

export interface Country { id: number; name: string; code: string; }
export type CountryInput = Omit<Country, 'id'>;

export const COUNTRY_COLS = 'id,name,code';

export function parseCountry(b: any): CountryInput {
  return { name: str(b?.name, 'El nombre', 100), code: str(b?.code, 'El código', 3).toUpperCase() };
}
