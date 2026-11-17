import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CatalogService, ReservationService, UserService } from '../core/api';
import { AuthService } from '../core/auth.service';
import { Service, User } from '../core/models';

@Component({
  selector: 'app-reservation-form',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page-head">
      <h1>{{ id ? 'Editar reserva' : 'Nueva reserva' }}</h1>
    </div>
    <form class="card form" (ngSubmit)="save()">
      @if (isAdmin) {
        <label>Cliente
          <select name="user_id" [(ngModel)]="m.user_id" required>
            <option [ngValue]="null" disabled>Elige un cliente</option>
            @for (c of clients(); track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
          </select>
        </label>
      }
      <label>Servicio
        <select name="service_id" [(ngModel)]="m.service_id" required>
          <option [ngValue]="null" disabled>Elige un servicio</option>
          @for (s of services(); track s.id) {
            <option [ngValue]="s.id">{{ s.name }} · {{ s.duration_min }} min</option>
          }
        </select>
      </label>
      <div class="row">
        <label>Fecha
          <input type="date" name="date" [(ngModel)]="m.date" [min]="today" required>
        </label>
        <label>Hora
          <input type="time" name="time" [(ngModel)]="m.time" required>
        </label>
        <label>Personas
          <input type="number" name="guests" [(ngModel)]="m.guests" min="1" max="50" required>
        </label>
      </div>
      <label>Notas (opcional)
        <textarea name="notes" [(ngModel)]="m.notes" rows="3" placeholder="Alergias, ocasión especial, etc."></textarea>
      </label>
      @if (isAdmin) {
        <div class="row">
          <label>Agente
            <select name="agent_id" [(ngModel)]="m.agent_id">
              <option [ngValue]="null">Sin asignar</option>
              @for (a of agents(); track a.id) { <option [ngValue]="a.id">{{ a.name }}</option> }
            </select>
          </label>
          <label>Estado
            <select name="status" [(ngModel)]="m.status">
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </label>
        </div>
      }
      @if (error) { <p class="error">{{ error }}</p> }
      <div class="actions">
        <a class="btn ghost" [routerLink]="base + '/reservas'">Volver</a>
        <button class="btn" type="submit" [disabled]="saving">{{ id ? 'Guardar cambios' : 'Crear reserva' }}</button>
      </div>
    </form>
  `,
})
export class ReservationForm implements OnInit {
  private rs = inject(ReservationService);
  private cs = inject(CatalogService);
  private us = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  services = signal<Service[]>([]);
  clients = signal<User[]>([]);
  agents = signal<User[]>([]);
  id: number | null = null;
  error = '';
  saving = false;
  today = new Date().toISOString().slice(0, 10);
  m: any = { service_id: null, date: '', time: '10:00', guests: 1, notes: '', user_id: null, agent_id: null, status: 'pending' };

  get isAdmin() { return this.auth.user()?.role === 'admin'; }
  get base() { return this.isAdmin ? '/admin' : '/client'; }

  ngOnInit() {
    this.cs.list().subscribe(s => this.services.set(s));
    if (this.isAdmin) {
      this.us.list().subscribe(u => {
        this.clients.set(u.filter(x => x.role === 'client'));
        this.agents.set(u.filter(x => x.role === 'agent'));
      });
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = +id;
      this.rs.get(this.id).subscribe(r => (this.m = {
        service_id: r.service_id, date: r.date, time: r.time, guests: r.guests, notes: r.notes,
        user_id: r.user_id, agent_id: r.agent_id, status: r.status,
      }));
    }
  }

  save() {
    this.error = '';
    if (!this.m.service_id || !this.m.date || !this.m.time) { this.error = 'Elige servicio, fecha y hora.'; return; }
    this.saving = true;
    const req = this.id ? this.rs.update(this.id, this.m) : this.rs.create(this.m);
    req.subscribe({
      next: () => this.router.navigate([this.base, 'reservas']),
      error: e => { this.saving = false; this.error = e.error?.message || 'No se pudo guardar la reserva.'; },
    });
  }
}
