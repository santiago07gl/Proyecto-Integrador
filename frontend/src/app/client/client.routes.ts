import { Routes } from '@angular/router';
import { Shell } from '../shared/shell';
import { EventsPage } from '../shared/events-page';
import { ReservationForm } from '../shared/reservation-form';
import { ClientReservations } from './client-reservations';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'reservas' },
      { path: 'reservas', component: ClientReservations },
      { path: 'reservas/nueva', component: ReservationForm },
      { path: 'reservas/:id/editar', component: ReservationForm },
      { path: 'eventos', component: EventsPage },
    ],
  },
];
