import { Routes } from '@angular/router';
import { AdminPage } from './pages/admin/admin.page';
import { AgentPage } from './pages/agent/agent.page';
import { AgentEventsPage } from './pages/agent-events/agent-events.page';
import { AgentReservationsPage } from './pages/agent-reservations/agent-reservations.page';
import { ClientPage } from './pages/client/client.page';
import { ClientReservationsPage } from './pages/client-reservations/client-reservations.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'client' },
  { path: 'client', title: 'Explorar espacios | Spotvia', component: ClientPage },
  { path: 'client/reservations', title: 'Mis reservas | Spotvia', component: ClientReservationsPage },
  { path: 'login', title: 'Iniciar sesión | Spotvia', component: LoginPage },
  { path: 'register', title: 'Crear cuenta | Spotvia', component: RegisterPage },
  { path: 'agent', title: 'Panel de agente | Spotvia', component: AgentPage },
  { path: 'agent/events', title: 'Mis eventos | Spotvia', component: AgentEventsPage },
  { path: 'agent/reservations', title: 'Reservas del agente | Spotvia', component: AgentReservationsPage },
  { path: 'admin', title: 'Administración | Spotvia', component: AdminPage },
  { path: '**', redirectTo: 'client' },
];
