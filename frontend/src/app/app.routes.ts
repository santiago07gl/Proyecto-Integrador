import { Routes } from '@angular/router';
import { roleGuard } from './core/guards';
import { HomePage } from './public/home';
import { LoginPage, RegisterPage } from './public/auth-pages';

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  {
    path: 'client',
    canActivate: [roleGuard('client')],
    loadChildren: () => import('./client/client.routes').then(m => m.CLIENT_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [roleGuard('admin')],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'agent',
    canActivate: [roleGuard('agent')],
    loadChildren: () => import('./agent/agent.routes').then(m => m.AGENT_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
