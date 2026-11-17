import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityService, CountryService, DepartmentService, EventService, UserService } from '../core/api';
import { AuthService } from '../core/auth.service';
import { City, Country, Department, EVENT_STATUS_LABEL, EventItem, EventStatus, User } from '../core/models';

interface EventForm {
  id?: number; title: string; description: string;
  country_id: number | null; department_id: number | null; city_id: number | null;
  event_date: string; event_time: string; capacity: number; status: EventStatus; agent_id: number | null;
}

// Eventos: el agente gestiona los suyos, el admin todos y el cliente solo los consulta.
@Component({
  selector: 'app-events-page',
  imports: [FormsModule],
  template: `
    <div class="page-head"><h1>Eventos</h1></div>
    <div [class.split]="canEdit">
      @if (canEdit) {
        <form class="card form" (ngSubmit)="save()">
          <h3>{{ m.id ? 'Editar evento' : 'Nuevo evento' }}</h3>
          <label>Título <input name="title" [(ngModel)]="m.title" required maxlength="150"></label>
          <label>Descripción <textarea name="description" [(ngModel)]="m.description" rows="2"></textarea></label>
          <label>País
            <select name="country_id" [(ngModel)]="m.country_id" (ngModelChange)="m.department_id = null; m.city_id = null">
              <option [ngValue]="null">Sin país</option>
              @for (c of countries(); track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
            </select>
          </label>
          <label>Departamento
            <select name="department_id" [(ngModel)]="m.department_id" (ngModelChange)="m.city_id = null" [disabled]="!m.country_id">
              <option [ngValue]="null">Sin departamento</option>
              @for (d of deptsOfCountry(); track d.id) { <option [ngValue]="d.id">{{ d.name }}</option> }
            </select>
          </label>
          <label>Ciudad
            <select name="city_id" [(ngModel)]="m.city_id" [disabled]="!m.department_id">
              <option [ngValue]="null">Sin ciudad</option>
              @for (c of citiesOfDept(); track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
            </select>
          </label>
          <div class="row">
            <label>Fecha <input type="date" name="event_date" [(ngModel)]="m.event_date" required></label>
            <label>Hora <input type="time" name="event_time" [(ngModel)]="m.event_time" required></label>
          </div>
          <div class="row">
            <label>Capacidad <input type="number" name="capacity" [(ngModel)]="m.capacity" min="1" required></label>
            <label>Estado
              <select name="status" [(ngModel)]="m.status">
                <option value="scheduled">Programado</option>
                <option value="completed">Realizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </label>
          </div>
          @if (isAdmin) {
            <label>Agente responsable
              <select name="agent_id" [(ngModel)]="m.agent_id">
                @for (a of agents(); track a.id) { <option [ngValue]="a.id">{{ a.name }}</option> }
              </select>
            </label>
          }
          @if (error) { <p class="error">{{ error }}</p> }
          <div class="actions">
            @if (m.id) { <button type="button" class="btn ghost" (click)="reset()">Cancelar</button> }
            <button class="btn" type="submit">{{ m.id ? 'Guardar cambios' : 'Crear evento' }}</button>
          </div>
        </form>
      }

      <div class="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Evento</th><th>Fecha</th><th>Lugar</th><th>Cupo</th>
              @if (isAdmin) { <th>Agente</th> }
              <th>Estado</th>
              @if (canEdit) { <th></th> }
            </tr>
          </thead>
          <tbody>
            @for (e of items(); track e.id) {
              <tr>
                <td>{{ e.title }}<br><small class="muted">{{ e.description }}</small></td>
                <td>{{ e.event_date }}<br><small class="muted">{{ e.event_time }}</small></td>
                <td>{{ e.city_name || '—' }}</td>
                <td>{{ e.capacity }}</td>
                @if (isAdmin) { <td>{{ e.agent_name }}</td> }
                <td><span class="badge" [class.confirmed]="e.status === 'scheduled'" [class.completed]="e.status === 'completed'" [class.cancelled]="e.status === 'cancelled'">{{ labels[e.status] }}</span></td>
                @if (canEdit) {
                  <td class="nowrap">
                    <button class="btn small ghost" (click)="edit(e)">Editar</button>
                    <button class="btn small danger" (click)="remove(e)">Eliminar</button>
                  </td>
                }
              </tr>
            } @empty {
              <tr><td [attr.colspan]="7" class="center muted">No hay eventos.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class EventsPage implements OnInit {
  private es = inject(EventService);
  private countriesApi = inject(CountryService);
  private deptsApi = inject(DepartmentService);
  private citiesApi = inject(CityService);
  private us = inject(UserService);
  private auth = inject(AuthService);

  labels = EVENT_STATUS_LABEL;
  items = signal<EventItem[]>([]);
  countries = signal<Country[]>([]);
  departments = signal<Department[]>([]);
  cities = signal<City[]>([]);
  agents = signal<User[]>([]);
  m: EventForm = this.blank();
  error = '';

  get isAdmin() { return this.auth.user()?.role === 'admin'; }
  get canEdit() { return this.auth.user()?.role !== 'client'; }

  private blank(): EventForm {
    return {
      title: '', description: '', country_id: null, department_id: null, city_id: null,
      event_date: '', event_time: '18:00', capacity: 50, status: 'scheduled', agent_id: this.auth?.user()?.id ?? null,
    };
  }

  deptsOfCountry() { return this.departments().filter(d => d.country_id === this.m.country_id); }
  citiesOfDept() { return this.cities().filter(c => c.department_id === this.m.department_id); }

  ngOnInit() {
    this.load();
    if (!this.canEdit) return;
    this.countriesApi.list().subscribe(v => this.countries.set(v));
    this.deptsApi.list().subscribe(v => this.departments.set(v));
    this.citiesApi.list().subscribe(v => this.cities.set(v));
    if (this.isAdmin) this.us.list().subscribe(u => this.agents.set(u.filter(x => x.role === 'agent' || x.role === 'admin')));
  }

  load() { this.es.list().subscribe(v => this.items.set(v)); }

  edit(e: EventItem) {
    const city = this.cities().find(c => c.id === e.city_id);
    this.m = {
      id: e.id, title: e.title, description: e.description,
      country_id: city?.country_id ?? null, department_id: city?.department_id ?? null, city_id: e.city_id,
      event_date: e.event_date, event_time: e.event_time, capacity: e.capacity, status: e.status, agent_id: e.agent_id,
    };
    this.error = '';
  }
  reset() { this.m = this.blank(); this.error = ''; }

  save() {
    const body: any = {
      title: this.m.title, description: this.m.description, city_id: this.m.city_id,
      event_date: this.m.event_date, event_time: this.m.event_time, capacity: this.m.capacity, status: this.m.status,
    };
    if (this.isAdmin && this.m.agent_id) body.agent_id = this.m.agent_id;
    const req = this.m.id ? this.es.update(this.m.id, body) : this.es.create(body);
    req.subscribe({
      next: () => { this.reset(); this.load(); },
      error: e => (this.error = e.error?.message || 'No se pudo guardar el evento.'),
    });
  }

  remove(e: EventItem) {
    if (!confirm(`¿Eliminar el evento "${e.title}"?`)) return;
    this.es.remove(e.id).subscribe({ next: () => this.load(), error: x => alert(x.error?.message) });
  }
}
