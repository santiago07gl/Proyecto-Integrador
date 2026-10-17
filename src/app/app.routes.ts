import { Routes } from '@angular/router';
import { AdminPage } from './pages/admin/admin.page';
import { AgentPage } from './pages/agent/agent.page';
import { ClientPage } from './pages/client/client.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'client' },
  { path: 'client', title: 'Explorar espacios | Spotvia', component: ClientPage },
  { path: 'login', title: 'Iniciar sesión | Spotvia', component: LoginPage },
  { path: 'register', title: 'Crear cuenta | Spotvia', component: RegisterPage },
  { path: 'agent', title: 'Panel de agente | Spotvia', component: AgentPage },
  { path: 'admin', title: 'Administración | Spotvia', component: AdminPage },
  { path: '**', redirectTo: 'client' },
];
