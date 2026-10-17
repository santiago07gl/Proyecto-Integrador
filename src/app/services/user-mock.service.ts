import { Injectable } from '@angular/core';
import { SpotviaUser } from '../models/spotvia.models';

const USERS: SpotviaUser[] = [
  {
    id: 'client-1',
    name: 'Camila Méndez',
    email: 'camila.mendez@example.com',
    role: 'client',
    roleLabel: 'Cliente',
    initials: 'CM',
    city: 'Tuluá, Valle del Cauca',
  },
  {
    id: 'agent-1',
    name: 'Julián Albeiro Giraldo',
    email: 'julian.giraldo@example.com',
    role: 'agent',
    roleLabel: 'Agente de espacios',
    initials: 'JG',
    city: 'Tuluá, Valle del Cauca',
  },
  {
    id: 'agent-2',
    name: 'Santiago González Laverde',
    email: 'santiago.gonzalez@example.com',
    role: 'agent',
    roleLabel: 'Agente de espacios',
    initials: 'SG',
    city: 'Tuluá, Valle del Cauca',
  },
  {
    id: 'admin-1',
    name: 'Andrea Díaz',
    email: 'andrea.diaz@example.com',
    role: 'admin',
    roleLabel: 'Administradora',
    initials: 'AD',
    city: 'Tuluá, Valle del Cauca',
  },
];

@Injectable({ providedIn: 'root' })
export class UserMockService {
  getClient(): SpotviaUser {
    return USERS[0];
  }

  getAgent(): SpotviaUser {
    return USERS[1];
  }

  getAdmin(): SpotviaUser {
    return USERS[3];
  }
}