import { Routes } from '@angular/router';
import { Shell } from '../shared/shell';
import { ReservationForm } from '../shared/reservation-form';
import { EventsPage } from '../shared/events-page';
import { AdminDashboard } from './admin-dashboard';
import { AdminLocations } from './admin-locations';
import { AdminReports } from './admin-reports';
import { AdminReservations } from './admin-reservations';
import { AdminServices } from './admin-services';
import { AdminUsers } from './admin-users';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'panel' },
      { path: 'panel', component: AdminDashboard },
      { path: 'reservas', component: AdminReservations },
      { path: 'reservas/nueva', component: ReservationForm },
      { path: 'reservas/:id/editar', component: ReservationForm },
      { path: 'eventos', component: EventsPage },
      { path: 'servicios', component: AdminServices },
      { path: 'usuarios', component: AdminUsers },
      { path: 'localizacion', component: AdminLocations },
      { path: 'reportes', component: AdminReports },
    ],
  },
];
