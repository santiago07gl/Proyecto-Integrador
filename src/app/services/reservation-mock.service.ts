import { Injectable } from '@angular/core';
import { SpotviaReservation } from '../models/spotvia.models';

const RESERVATIONS: SpotviaReservation[] = [
  {
    id: 'SP-2841',
    eventId: 'event-1',
    eventTitle: 'Cancha La 40',
    category: 'Fútbol 7',
    date: 'Sábado 17 de octubre',
    time: '17:00',
    durationHours: 2,
    clientId: 'client-1',
    clientName: 'Camila Méndez',
    clientEmail: 'camila.mendez@example.com',
    agentId: 'agent-1',
    status: 'confirmed',
    total: 170000,
  },
  {
    id: 'SP-2840',
    eventId: 'event-2',
    eventTitle: 'Punto Cero Pádel',
    category: 'Pádel',
    date: 'Domingo 18 de octubre',
    time: '09:00',
    durationHours: 1,
    clientId: 'client-1',
    clientName: 'Camila Méndez',
    clientEmail: 'camila.mendez@example.com',
    agentId: 'agent-1',
    status: 'pending',
    total: 62000,
  },
  {
    id: 'SP-2839',
    eventId: 'event-4',
    eventTitle: 'Cancha El Jardín',
    category: 'Fútbol 5',
    date: 'Viernes 23 de octubre',
    time: '18:30',
    durationHours: 1,
    clientId: 'client-2',
    clientName: 'Juan Camilo Granada',
    clientEmail: 'juan.granada@example.com',
    agentId: 'agent-1',
    status: 'pending',
    total: 75000,
  },
  {
    id: 'SP-2838',
    eventId: 'event-3',
    eventTitle: 'Parque Deportivo Tuluá',
    category: 'Al aire libre',
    date: 'Sábado 17 de octubre',
    time: '08:00',
    durationHours: 2,
    clientId: 'client-3',
    clientName: 'Ángel David Marín Bedoya',
    clientEmail: 'angel.marin@example.com',
    agentId: 'agent-2',
    status: 'confirmed',
    total: 80000,
  },
  {
    id: 'SP-2837',
    eventId: 'event-1',
    eventTitle: 'Cancha La 40',
    category: 'Fútbol 7',
    date: 'Jueves 15 de octubre',
    time: '19:00',
    durationHours: 1,
    clientId: 'client-4',
    clientName: 'Valeria Ruiz',
    clientEmail: 'valeria.ruiz@example.com',
    agentId: 'agent-1',
    status: 'cancelled',
    total: 85000,
  },
  {
    id: 'SP-2836',
    eventId: 'event-4',
    eventTitle: 'Cancha El Jardín',
    category: 'Fútbol 5',
    date: 'Miércoles 14 de octubre',
    time: '20:00',
    durationHours: 1,
    clientId: 'client-5',
    clientName: 'Mateo Cruz',
    clientEmail: 'mateo.cruz@example.com',
    agentId: 'agent-1',
    status: 'confirmed',
    total: 75000,
  },
];

@Injectable({ providedIn: 'root' })
export class ReservationMockService {
  getClientReservations(clientId: string): SpotviaReservation[] {
    return RESERVATIONS.filter((reservation) => reservation.clientId === clientId);
  }

  getAgentReservations(agentId: string): SpotviaReservation[] {
    return RESERVATIONS.filter((reservation) => reservation.agentId === agentId);
  }

  getAllReservations(): SpotviaReservation[] {
    return RESERVATIONS;
  }
}