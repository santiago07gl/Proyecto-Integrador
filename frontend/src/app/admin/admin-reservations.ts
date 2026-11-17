import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReservationService, UserService } from '../core/api';
import { Reservation, Status, User } from '../core/models';

@Component({
  selector: 'app-admin-reservations',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page-head">
      <h1>Reservas</h1>
      <a class="btn" routerLink="/admin/reservas/nueva">Nueva reserva</a>
    </div>
    <div class="card table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Cliente</th><th>Servicio</th><th>Fecha</th><th>Agente</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          @for (r of items(); track r.id) {
            <tr>
              <td>{{ r.id }}</td>
              <td>{{ r.client_name }}</td>
              <td>{{ r.service_name }}<br><small class="muted">{{ r.guests }} pers.</small></td>
              <td>{{ r.date }}<br><small class="muted">{{ r.time }}</small></td>
              <td>
                <select [ngModel]="r.agent_id" (ngModelChange)="changeAgent(r, $event)">
                  <option [ngValue]="null">Sin asignar</option>
                  @for (a of agents(); track a.id) { <option [ngValue]="a.id">{{ a.name }}</option> }
                </select>
              </td>
              <td>
                <select [ngModel]="r.status" (ngModelChange)="changeStatus(r, $event)">
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </td>
              <td class="nowrap">
                <a class="btn small ghost" [routerLink]="['/admin/reservas', r.id, 'editar']">Editar</a>
                <button class="btn small danger" (click)="remove(r)">Eliminar</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="center muted">Todavía no hay reservas.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class AdminReservations implements OnInit {
  private rs = inject(ReservationService);
  private us = inject(UserService);
  items = signal<Reservation[]>([]);
  agents = signal<User[]>([]);

  ngOnInit() {
    this.load();
    this.us.list().subscribe(u => this.agents.set(u.filter(x => x.role === 'agent')));
  }
  load() { this.rs.list().subscribe(r => this.items.set(r)); }

  changeStatus(r: Reservation, status: Status) {
    this.rs.setStatus(r.id, status, r.agent_id).subscribe(() => this.load());
  }
  changeAgent(r: Reservation, agentId: number | null) {
    this.rs.setStatus(r.id, r.status, agentId).subscribe(() => this.load());
  }
  remove(r: Reservation) {
    if (confirm(`¿Eliminar la reserva #${r.id}?`)) this.rs.remove(r.id).subscribe(() => this.load());
  }
}
