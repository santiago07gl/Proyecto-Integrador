import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ROLE_LABEL, Role } from '../core/models';

const LINKS: Record<Role, { path: string; label: string }[]> = {
  client: [
    { path: '/client/reservas', label: 'Mis reservas' },
    { path: '/client/reservas/nueva', label: 'Nueva reserva' },
    { path: '/client/eventos', label: 'Eventos' },
  ],
  agent: [
    { path: '/agent/reservas', label: 'Reservas' },
    { path: '/agent/eventos', label: 'Eventos' },
  ],
  admin: [
    { path: '/admin/panel', label: 'Panel' },
    { path: '/admin/reservas', label: 'Reservas' },
    { path: '/admin/servicios', label: 'Servicios' },
    { path: '/admin/eventos', label: 'Eventos' },
    { path: '/admin/usuarios', label: 'Usuarios' },
    { path: '/admin/localizacion', label: 'Localización' },
    { path: '/admin/reportes', label: 'Reportes' },
  ],
};

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/">Kroni</a>
      <nav>
        @for (l of links(); track l.path) {
          <a [routerLink]="l.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">{{ l.label }}</a>
        }
      </nav>
      <div class="user">
        <span>{{ auth.user()?.name }} <small class="role">{{ roleLabel() }}</small></span>
        <button class="btn small ghost" (click)="auth.logout()">Salir</button>
      </div>
    </header>
    <main class="container"><router-outlet /></main>
  `,
})
export class Shell {
  auth = inject(AuthService);
  links = computed(() => LINKS[this.auth.user()?.role ?? 'client']);
  roleLabel = computed(() => ROLE_LABEL[this.auth.user()?.role ?? 'client']);
}
