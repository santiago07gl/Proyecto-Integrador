import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsService } from '../core/api';
import { Stats } from '../core/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="page-head"><h1>Panel</h1></div>
    @if (s(); as s) {
      <div class="stats">
        <div class="card stat"><span>{{ s.reservations.total }}</span><p>Reservas en total</p></div>
        <div class="card stat"><span>{{ s.reservations.pending }}</span><p>Pendientes</p></div>
        <div class="card stat"><span>{{ s.reservations.confirmed }}</span><p>Confirmadas</p></div>
        <div class="card stat"><span>{{ s.revenue | currency: 'USD' : 'symbol' : '1.0-0' }}</span><p>Ingresos estimados</p></div>
      </div>
      <div class="grid two">
        <div class="card">
          <h3>Equipo y clientes</h3>
          <ul class="plain">
            <li>Clientes: <b>{{ s.users.client }}</b></li>
            <li>Agentes: <b>{{ s.users.agent }}</b></li>
            <li>Administradores: <b>{{ s.users.admin }}</b></li>
            <li>Servicios activos: <b>{{ s.services }}</b></li>
          </ul>
        </div>
        <div class="card">
          <h3>Accesos rápidos</h3>
          <div class="actions left wrap">
            <a class="btn small" routerLink="/admin/reservas/nueva">Nueva reserva</a>
            <a class="btn small ghost" routerLink="/admin/servicios">Servicios</a>
            <a class="btn small ghost" routerLink="/admin/usuarios">Usuarios</a>
            <a class="btn small ghost" routerLink="/admin/reportes">Reportes</a>
            <a class="btn small ghost" routerLink="/admin/localizacion">Localización</a>
          </div>
          <p class="muted">Completadas: {{ s.reservations.completed }} · Canceladas: {{ s.reservations.cancelled }}</p>
        </div>
      </div>
    }
  `,
})
export class AdminDashboard implements OnInit {
  private api = inject(StatsService);
  s = signal<Stats | null>(null);
  ngOnInit() { this.api.get().subscribe(v => this.s.set(v)); }
}
