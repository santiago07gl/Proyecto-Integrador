import { bool, int, num, optStr, str } from '../../../utils/validate';

export interface ServiceItem {
  id: number; name: string; description: string; price: number; duration_min: number; active: boolean;
}
export type ServiceInput = Omit<ServiceItem, 'id'>;

export const SERVICE_COLS = 'id,name,description,price::float AS price,duration_min,active';

export function parseService(b: any): ServiceInput {
  return {
    name: str(b?.name, 'El nombre', 120),
    description: optStr(b?.description, 'La descripción') ?? '',
    price: b?.price === undefined ? 0 : num(b.price, 'El precio'),
    duration_min: b?.duration_min === undefined ? 60 : int(b.duration_min, 'La duración', 5, 1440),
    active: b?.active === undefined ? true : bool(b.active, 'El estado'),
  };
}
