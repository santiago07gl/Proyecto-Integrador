import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityService, CountryService, DepartmentService } from '../core/api';
import { City, Country, Department } from '../core/models';

type Tab = 'countries' | 'departments' | 'cities';

// Localización: CRUD de países, departamentos y ciudades.
@Component({
  selector: 'app-admin-locations',
  imports: [FormsModule],
  template: `
    <div class="page-head">
      <h1>Localización</h1>
      <div class="tabs">
        <button [class.on]="tab() === 'countries'" (click)="go('countries')">Países ({{ countries().length }})</button>
        <button [class.on]="tab() === 'departments'" (click)="go('departments')">Departamentos ({{ departments().length }})</button>
        <button [class.on]="tab() === 'cities'" (click)="go('cities')">Ciudades ({{ cities().length }})</button>
      </div>
    </div>

    @if (tab() === 'countries') {
      <div class="split">
        <form class="card form" (ngSubmit)="saveCountry()">
          <h3>{{ c.id ? 'Editar país' : 'Nuevo país' }}</h3>
          <label>Nombre <input name="name" [(ngModel)]="c.name" required maxlength="100"></label>
          <label>Código (ej. COL) <input name="code" [(ngModel)]="c.code" required maxlength="3"></label>
          @if (error) { <p class="error">{{ error }}</p> }
          <div class="actions">
            @if (c.id) { <button type="button" class="btn ghost" (click)="reset()">Cancelar</button> }
            <button class="btn" type="submit">{{ c.id ? 'Guardar cambios' : 'Agregar país' }}</button>
          </div>
        </form>
        <div class="card table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>Código</th><th></th></tr></thead>
            <tbody>
              @for (x of countries(); track x.id) {
                <tr>
                  <td>{{ x.name }}</td><td>{{ x.code }}</td>
                  <td class="nowrap">
                    <button class="btn small ghost" (click)="editCountry(x)">Editar</button>
                    <button class="btn small danger" (click)="removeCountry(x)">Eliminar</button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="3" class="center muted">No hay países.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    }

    @if (tab() === 'departments') {
      <div class="split">
        <form class="card form" (ngSubmit)="saveDepartment()">
          <h3>{{ d.id ? 'Editar departamento' : 'Nuevo departamento' }}</h3>
          <label>País
            <select name="country_id" [(ngModel)]="d.country_id" required>
              <option [ngValue]="undefined" disabled>Elige un país</option>
              @for (x of countries(); track x.id) { <option [ngValue]="x.id">{{ x.name }}</option> }
            </select>
          </label>
          <label>Nombre <input name="name" [(ngModel)]="d.name" required maxlength="100"></label>
          @if (error) { <p class="error">{{ error }}</p> }
          <div class="actions">
            @if (d.id) { <button type="button" class="btn ghost" (click)="reset()">Cancelar</button> }
            <button class="btn" type="submit">{{ d.id ? 'Guardar cambios' : 'Agregar departamento' }}</button>
          </div>
        </form>
        <div class="card table-wrap">
          <table>
            <thead><tr><th>Departamento</th><th>País</th><th></th></tr></thead>
            <tbody>
              @for (x of departments(); track x.id) {
                <tr>
                  <td>{{ x.name }}</td><td>{{ x.country_name }}</td>
                  <td class="nowrap">
                    <button class="btn small ghost" (click)="editDepartment(x)">Editar</button>
                    <button class="btn small danger" (click)="removeDepartment(x)">Eliminar</button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="3" class="center muted">No hay departamentos.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    }

    @if (tab() === 'cities') {
      <div class="split">
        <form class="card form" (ngSubmit)="saveCity()">
          <h3>{{ ci.id ? 'Editar ciudad' : 'Nueva ciudad' }}</h3>
          <label>Departamento
            <select name="department_id" [(ngModel)]="ci.department_id" required>
              <option [ngValue]="undefined" disabled>Elige un departamento</option>
              @for (x of departments(); track x.id) { <option [ngValue]="x.id">{{ x.name }} · {{ x.country_name }}</option> }
            </select>
          </label>
          <label>Nombre <input name="name" [(ngModel)]="ci.name" required maxlength="100"></label>
          @if (error) { <p class="error">{{ error }}</p> }
          <div class="actions">
            @if (ci.id) { <button type="button" class="btn ghost" (click)="reset()">Cancelar</button> }
            <button class="btn" type="submit">{{ ci.id ? 'Guardar cambios' : 'Agregar ciudad' }}</button>
          </div>
        </form>
        <div class="card table-wrap">
          <table>
            <thead><tr><th>Ciudad</th><th>Departamento</th><th>País</th><th></th></tr></thead>
            <tbody>
              @for (x of cities(); track x.id) {
                <tr>
                  <td>{{ x.name }}</td><td>{{ x.department_name }}</td><td>{{ x.country_name }}</td>
                  <td class="nowrap">
                    <button class="btn small ghost" (click)="editCity(x)">Editar</button>
                    <button class="btn small danger" (click)="removeCity(x)">Eliminar</button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="4" class="center muted">No hay ciudades.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
})
export class AdminLocations implements OnInit {
  private countryApi = inject(CountryService);
  private deptApi = inject(DepartmentService);
  private cityApi = inject(CityService);

  tab = signal<Tab>('countries');
  countries = signal<Country[]>([]);
  departments = signal<Department[]>([]);
  cities = signal<City[]>([]);
  c: Partial<Country> = {};
  d: Partial<Department> = {};
  ci: Partial<City> = {};
  error = '';

  ngOnInit() { this.load(); }
  load() {
    this.countryApi.list().subscribe(v => this.countries.set(v));
    this.deptApi.list().subscribe(v => this.departments.set(v));
    this.cityApi.list().subscribe(v => this.cities.set(v));
  }
  go(t: Tab) { this.tab.set(t); this.reset(); }
  reset() { this.c = {}; this.d = {}; this.ci = {}; this.error = ''; }

  private done = { next: () => { this.reset(); this.load(); }, error: (e: any) => (this.error = e.error?.message || 'No se pudo guardar.') };
  private removed = { next: () => this.load(), error: (e: any) => alert(e.error?.message) };

  editCountry(x: Country) { this.c = { ...x }; this.error = ''; }
  editDepartment(x: Department) { this.d = { ...x }; this.error = ''; }
  editCity(x: City) { this.ci = { ...x }; this.error = ''; }

  saveCountry() {
    (this.c.id ? this.countryApi.update(this.c.id, this.c) : this.countryApi.create(this.c)).subscribe(this.done);
  }
  saveDepartment() {
    (this.d.id ? this.deptApi.update(this.d.id, this.d) : this.deptApi.create(this.d)).subscribe(this.done);
  }
  saveCity() {
    (this.ci.id ? this.cityApi.update(this.ci.id, this.ci) : this.cityApi.create(this.ci)).subscribe(this.done);
  }

  removeCountry(x: Country) {
    if (confirm(`¿Eliminar el país "${x.name}"?`)) this.countryApi.remove(x.id).subscribe(this.removed);
  }
  removeDepartment(x: Department) {
    if (confirm(`¿Eliminar el departamento "${x.name}"?`)) this.deptApi.remove(x.id).subscribe(this.removed);
  }
  removeCity(x: City) {
    if (confirm(`¿Eliminar la ciudad "${x.name}"?`)) this.cityApi.remove(x.id).subscribe(this.removed);
  }
}
