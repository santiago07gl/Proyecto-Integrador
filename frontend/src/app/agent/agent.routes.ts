import { Routes } from '@angular/router';
import { Shell } from '../shared/shell';
import { EventsPage } from '../shared/events-page';
import { AgentReservations } from './agent-reservations';

export const AGENT_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'reservas' },
      { path: 'reservas', component: AgentReservations },
      { path: 'eventos', component: EventsPage },
    ],
  },
];
