import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ReservationService } from '../core/api';
import { AuthService } from '../core/auth.service';
import { Reservation, Status } from '../core/models';
import { Badge } from '../shared/badge';

type Filter = 'libres' | 'mias';

@Component({
  selector: 'app-agent-reservations',
  imports: [Badge],
  template: `
    <div class="page-head">
      <h1>Reservas</h1>
      <div class="tabs">
        <button [class.on]="filter() === 'libres'" (click)="filter.set('libres')">Por atender ({{ count('libres') }})</button>
        <button [class.on]="filter() === 'mias'" (click)="filter.set('mias')">Mis reservas ({{ count('mias') }})</button>
      </div>
    </div>
    @if (visible().length === 0) {
      <div class="card empty"><p>No hay reservas en esta lista.</p></div>
    }
    <div class="grid">
      @for (r of visible(); track r.id) {
        <article class="card res">
          <div class="res-top">
            <h3>{{ r.service_name }}</h3>
            <app-badge [status]="r.status" />
          </div>
          <p class="when">{{ r.date }} a las {{ r.time }}</p>
          <p class="muted">{{ r.client_name }} · {{ r.guests }} {{ r.guests === 1 ? 'persona' : 'personas' }}</p>
          @if (r.notes) { <p class="note">{{ r.notes }}</p> }
          <div class="actions left">
            @if (r.status === 'pending') {
              <button class="btn small" (click)="set(r, 'confirmed')">Confirmar</button>
            }
            @if (r.status === 'confirmed') {
              <button class="btn small" (click)="set(r, 'completed')">Marcar completada</button>
            }
            @if (r.status === 'pending' || r.status === 'confirmed') {
              <button class="btn small ghost" (click)="set(r, 'cancelled')">Cancelar</button>
            }
          </div>
        </article>
      }
    </div>
  `,
})
export class AgentReservations implements OnInit {
  private rs = inject(ReservationService);
  private auth = inject(AuthService);
  items = signal<Reservation[]>([]);
  filter = signal<Filter>('libres');
  visible = computed(() => this.items().filter(r => this.match(r, this.filter())));

  ngOnInit() { this.load(); }
  load() { this.rs.list().subscribe(r => this.items.set(r)); }

  private match(r: Reservation, f: Filter) {
    return f === 'libres' ? r.agent_id === null && r.status === 'pending' : r.agent_id === this.auth.user()?.id;
  }
  count(f: Filter) { return this.items().filter(r => this.match(r, f)).length; }

  set(r: Reservation, status: Status) {
    this.rs.setStatus(r.id, status).subscribe({ next: () => this.load(), error: e => alert(e.error?.message) });
  }
}
