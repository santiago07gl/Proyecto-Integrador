import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../core/api';
import { Reservation } from '../core/models';
import { Badge } from '../shared/badge';

@Component({
  selector: 'app-client-reservations',
  imports: [RouterLink, Badge],
  template: `
    <div class="page-head">
      <h1>Mis reservas</h1>
      <a class="btn" routerLink="/client/reservas/nueva">Nueva reserva</a>
    </div>
    @if (items().length === 0) {
      <div class="card empty">
        <p>Aún no tienes reservas.</p>
        <a class="btn" routerLink="/client/reservas/nueva">Crear mi primera reserva</a>
      </div>
    }
    <div class="grid">
      @for (r of items(); track r.id) {
        <article class="card res">
          <div class="res-top">
            <h3>{{ r.service_name }}</h3>
            <app-badge [status]="r.status" />
          </div>
          <p class="when">{{ r.date }} a las {{ r.time }}</p>
          <p class="muted">{{ r.guests }} {{ r.guests === 1 ? 'persona' : 'personas' }}
            @if (r.agent_name) { · Atiende {{ r.agent_name }} }</p>
          @if (r.notes) { <p class="note">{{ r.notes }}</p> }
          <div class="actions left">
            @if (r.status === 'pending') {
              <a class="btn small ghost" [routerLink]="['/client/reservas', r.id, 'editar']">Editar</a>
            }
            @if (r.status === 'pending' || r.status === 'confirmed') {
              <button class="btn small ghost" (click)="cancel(r)">Cancelar</button>
            }
            @if (r.status === 'pending' || r.status === 'cancelled') {
              <button class="btn small danger" (click)="remove(r)">Eliminar</button>
            }
          </div>
        </article>
      }
    </div>
  `,
})
export class ClientReservations implements OnInit {
  private rs = inject(ReservationService);
  items = signal<Reservation[]>([]);

  ngOnInit() { this.load(); }
  load() { this.rs.list().subscribe(r => this.items.set(r)); }

  cancel(r: Reservation) {
    if (confirm('¿Cancelar esta reserva?')) this.rs.setStatus(r.id, 'cancelled').subscribe(() => this.load());
  }
  remove(r: Reservation) {
    if (confirm('¿Eliminar esta reserva?')) this.rs.remove(r.id).subscribe(() => this.load());
  }
}
