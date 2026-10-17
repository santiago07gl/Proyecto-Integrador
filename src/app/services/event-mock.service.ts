import { Injectable } from '@angular/core';
import { SpotviaEvent } from '../models/spotvia.models';

const EVENTS: SpotviaEvent[] = [
  {
    id: 'event-1',
    title: 'Cancha La 40',
    category: 'Fútbol 7',
    venue: 'Cancha La 40',
    address: 'Carrera 40 # 27-18',
    city: 'Tuluá, Valle del Cauca',
    date: 'Sábado 17 de octubre',
    startTime: '17:00',
    durationHours: 1,
    pricePerHour: 85000,
    availableSlots: 4,
    status: 'active',
    ownerId: 'agent-1',
    ownerName: 'Julián Albeiro Giraldo',
    rating: 4.9,
    imageClass: 'photo-one',
  },
  {
    id: 'event-2',
    title: 'Punto Cero Pádel',
    category: 'Pádel',
    venue: 'Club Punto Cero',
    address: 'Calle 25 # 32-10',
    city: 'Tuluá, Valle del Cauca',
    date: 'Domingo 18 de octubre',
    startTime: '09:00',
    durationHours: 1,
    pricePerHour: 62000,
    availableSlots: 3,
    status: 'active',
    ownerId: 'agent-1',
    ownerName: 'Julián Albeiro Giraldo',
    rating: 4.8,
    imageClass: 'photo-two',
  },
  {
    id: 'event-3',
    title: 'Parque Deportivo Tuluá',
    category: 'Al aire libre',
    venue: 'Parque Deportivo Tuluá',
    address: 'Avenida Principal, zona norte',
    city: 'Tuluá, Valle del Cauca',
    date: 'Sábado 17 de octubre',
    startTime: '08:00',
    durationHours: 2,
    pricePerHour: 40000,
    availableSlots: 7,
    status: 'active',
    ownerId: 'agent-2',
    ownerName: 'Santiago González Laverde',
    rating: 4.7,
    imageClass: 'photo-three',
  },
  {
    id: 'event-4',
    title: 'Cancha El Jardín',
    category: 'Fútbol 5',
    venue: 'Cancha El Jardín',
    address: 'Barrio El Jardín, manzana 8',
    city: 'Tuluá, Valle del Cauca',
    date: 'Viernes 23 de octubre',
    startTime: '18:30',
    durationHours: 1,
    pricePerHour: 75000,
    availableSlots: 2,
    status: 'active',
    ownerId: 'agent-1',
    ownerName: 'Julián Albeiro Giraldo',
    rating: 4.6,
    imageClass: 'photo-one',
  },
  {
    id: 'event-5',
    title: 'Encuentro recreativo de básquet',
    category: 'Básquet',
    venue: 'Coliseo Municipal',
    address: 'Centro deportivo municipal',
    city: 'Tuluá, Valle del Cauca',
    date: 'Domingo 25 de octubre',
    startTime: '10:00',
    durationHours: 2,
    pricePerHour: 30000,
    availableSlots: 10,
    status: 'review',
    ownerId: 'agent-2',
    ownerName: 'Santiago González Laverde',
    rating: 4.5,
    imageClass: 'photo-three',
  },
];

@Injectable({ providedIn: 'root' })
export class EventMockService {
  getClientEvents(): SpotviaEvent[] {
    return EVENTS.filter((event) => event.status === 'active');
  }

  getAgentEvents(agentId: string): SpotviaEvent[] {
    return EVENTS.filter((event) => event.ownerId === agentId);
  }

  getAllEvents(): SpotviaEvent[] {
    return EVENTS;
  }
}