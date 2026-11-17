import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CatalogService } from '../core/api';
import { Service } from '../core/models';

@Component({
  selector: 'app-admin-services',
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="page-head"><h1>Servicios</h1></div>
    <div class="split">
      <form class="card form" (ngSubmit)="save()">
        <h3>{{ m.id ? 'Editar servicio' : 'Nuevo servicio' }}</h3>
        <label>Nombre <input name="name" [(ngModel)]="m.name" required></label>
        <label>Descripción <textarea name="description" [(ngModel)]="m.description" rows="3"></textarea></label>
        <div class="row">
          <label>Precio (USD) <input type="number" name="price" [(ngModel)]="m.price" min="0" step="0.5"></label>
          <label>Duración (min) <input type="number" name="duration" [(ngModel)]="m.duration_min" min="5" step="5"></label>
        </div>
        <label class="check"><input type="checkbox" name="active" [(ngModel)]="m.active"> Disponible para reservar</label>
        @if (error) { <p class="error">{{ error }}</p> }
        <div class="actions">
          @if (m.id) { <button type="button" class="btn ghost" (click)="reset()">Cancelar</button> }
          <button class="btn" type="submit">{{ m.id ? 'Guardar cambios' : 'Agregar servicio' }}</button>
        </div>
      </form>

      <div class="card table-wrap">
        <table>
          <thead><tr><th>Servicio</th><th>Precio</th><th>Duración</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            @for (s of items(); track s.id) {
              <tr>
                <td>{{ s.name }}<br><small class="muted">{{ s.description }}</small></td>
                <td>{{ s.price | currency: 'USD' }}</td>
                <td>{{ s.duration_min }} min</td>
                <td><span class="badge" [class.confirmed]="s.active" [class.cancelled]="!s.active">{{ s.active ? 'Activo' : 'Inactivo' }}</span></td>
                <td class="nowrap">
                  <button class="btn small ghost" (click)="edit(s)">Editar</button>
                  <button class="btn small danger" (click)="remove(s)">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="center muted">No hay servicios.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminServices implements OnInit {
  private cs = inject(CatalogService);
  items = signal<Service[]>([]);
  m: Partial<Service> = this.blank();
  error = '';

  private blank(): Partial<Service> { return { name: '', description: '', price: 0, duration_min: 60, active: true }; }

  ngOnInit() { this.load(); }
  load() { this.cs.list().subscribe(s => this.items.set(s)); }
  edit(s: Service) { this.m = { ...s }; this.error = ''; }
  reset() { this.m = this.blank(); this.error = ''; }

  save() {
    const req = this.m.id ? this.cs.update(this.m.id, this.m) : this.cs.create(this.m);
    req.subscribe({
      next: () => { this.reset(); this.load(); },
      error: e => (this.error = e.error?.message || 'No se pudo guardar el servicio.'),
    });
  }
  remove(s: Service) {
    if (!confirm(`¿Eliminar "${s.name}"?`)) return;
    this.cs.remove(s.id).subscribe({ next: () => this.load(), error: e => alert(e.error?.message) });
  }
}
