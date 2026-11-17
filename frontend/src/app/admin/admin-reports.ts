import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../core/api';
import { REPORT_TYPE_LABEL, ROLE_LABEL, Report, ReportType, STATUS_LABEL } from '../core/models';

interface ReportForm { id?: number; title: string; type: ReportType; date_from: string; date_to: string; notes: string; }

// Reportes: CRUD. Los datos se calculan en el servidor con información real de la base de datos.
@Component({
  selector: 'app-admin-reports',
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="page-head"><h1>Reportes</h1></div>
    <div class="split">
      <form class="card form" (ngSubmit)="save()">
        <h3>{{ m.id ? 'Editar reporte' : 'Nuevo reporte' }}</h3>
        <label>Título <input name="title" [(ngModel)]="m.title" required maxlength="150"></label>
        <label>Tipo
          <select name="type" [(ngModel)]="m.type">
            @for (t of types; track t.value) { <option [value]="t.value">{{ t.label }}</option> }
          </select>
        </label>
        <div class="row">
          <label>Desde <input type="date" name="date_from" [(ngModel)]="m.date_from" required></label>
          <label>Hasta <input type="date" name="date_to" [(ngModel)]="m.date_to" required></label>
        </div>
        <label>Notas <textarea name="notes" [(ngModel)]="m.notes" rows="2"></textarea></label>
        @if (error) { <p class="error">{{ error }}</p> }
        <div class="actions">
          @if (m.id) { <button type="button" class="btn ghost" (click)="reset()">Cancelar</button> }
          <button class="btn" type="submit">{{ m.id ? 'Guardar y recalcular' : 'Generar reporte' }}</button>
        </div>
      </form>

      <div>
        <div class="card table-wrap">
          <table>
            <thead><tr><th>Reporte</th><th>Período</th><th>Total</th><th></th></tr></thead>
            <tbody>
              @for (r of items(); track r.id) {
                <tr>
                  <td>{{ r.title }}<br><small class="muted">{{ typeLabel[r.type] }} · {{ r.created_at }}</small></td>
                  <td>{{ r.date_from }}<br><small class="muted">a {{ r.date_to }}</small></td>
                  <td>{{ r.data.total }}</td>
                  <td class="nowrap">
                    <button class="btn small ghost" (click)="view.set(r)">Ver</button>
                    <button class="btn small ghost" (click)="edit(r)">Editar</button>
                    <button class="btn small danger" (click)="remove(r)">Eliminar</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="4" class="center muted">Todavía no hay reportes.</td></tr>
              }
            </tbody>
          </table>
        </div>

        @if (view(); as r) {
          <div class="card" style="margin-top:1rem">
            <h3>{{ r.title }}</h3>
            <p class="muted">{{ typeLabel[r.type] }} · del {{ r.date_from }} al {{ r.date_to }}</p>
            @if (r.notes) { <p class="note">{{ r.notes }}</p> }
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>{{ r.type === 'revenue' ? 'Servicio' : r.type === 'users' ? 'Rol' : 'Estado' }}</th><th>Cantidad</th>
                    @if (r.type === 'revenue') { <th>Ingresos</th> }</tr>
                </thead>
                <tbody>
                  @for (x of r.data.rows; track x.label) {
                    <tr>
                      <td>{{ rowLabel(r, x.label) }}</td><td>{{ x.count }}</td>
                      @if (r.type === 'revenue') { <td>{{ x.revenue | currency: 'USD' }}</td> }
                    </tr>
                  } @empty { <tr><td colspan="3" class="center muted">Sin datos en este período.</td></tr> }
                  <tr>
                    <td><b>Total</b></td><td><b>{{ r.data.total }}</b></td>
                    @if (r.type === 'revenue') { <td><b>{{ r.data.revenue | currency: 'USD' }}</b></td> }
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminReports implements OnInit {
  private api = inject(ReportService);
  items = signal<Report[]>([]);
  view = signal<Report | null>(null);
  typeLabel = REPORT_TYPE_LABEL;
  types = (Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map(value => ({ value, label: REPORT_TYPE_LABEL[value] }));
  m: ReportForm = this.blank();
  error = '';

  private blank(): ReportForm {
    const today = new Date();
    const from = new Date(today.getTime() - 30 * 864e5);
    return {
      title: '', type: 'reservations', notes: '',
      date_from: from.toISOString().slice(0, 10), date_to: today.toISOString().slice(0, 10),
    };
  }

  ngOnInit() { this.load(); }
  load() { this.api.list().subscribe(v => this.items.set(v)); }
  edit(r: Report) {
    this.m = { id: r.id, title: r.title, type: r.type, date_from: r.date_from, date_to: r.date_to, notes: r.notes };
    this.error = '';
  }
  reset() { this.m = this.blank(); this.error = ''; }

  rowLabel(r: Report, label: string) {
    if (r.type === 'reservations') return (STATUS_LABEL as Record<string, string>)[label] ?? label;
    if (r.type === 'users') return (ROLE_LABEL as Record<string, string>)[label] ?? label;
    return label;
  }

  save() {
    const req = this.m.id ? this.api.update(this.m.id, this.m) : this.api.create(this.m);
    req.subscribe({
      next: saved => { this.reset(); this.load(); this.view.set(saved); },
      error: e => (this.error = e.error?.message || 'No se pudo guardar el reporte.'),
    });
  }

  remove(r: Report) {
    if (!confirm(`¿Eliminar el reporte "${r.title}"?`)) return;
    this.api.remove(r.id).subscribe({
      next: () => { if (this.view()?.id === r.id) this.view.set(null); this.load(); },
      error: e => alert(e.error?.message),
    });
  }
}
