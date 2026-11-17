import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../core/api';
import { AuthService } from '../core/auth.service';
import { ROLE_LABEL, User } from '../core/models';

@Component({
  selector: 'app-admin-users',
  imports: [FormsModule],
  template: `
    <div class="page-head"><h1>Usuarios</h1></div>
    <div class="split">
      <form class="card form" (ngSubmit)="save()">
        <h3>{{ m.id ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
        <label>Nombre <input name="name" [(ngModel)]="m.name" required></label>
        <label>Correo <input type="email" name="email" [(ngModel)]="m.email" required></label>
        <label>{{ m.id ? 'Contraseña nueva (opcional)' : 'Contraseña' }}
          <input type="password" name="password" [(ngModel)]="m.password" [required]="!m.id" minlength="6">
        </label>
        <label>Rol
          <select name="role" [(ngModel)]="m.role">
            <option value="client">Cliente</option>
            <option value="agent">Agente</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        @if (error) { <p class="error">{{ error }}</p> }
        <div class="actions">
          @if (m.id) { <button type="button" class="btn ghost" (click)="reset()">Cancelar</button> }
          <button class="btn" type="submit">{{ m.id ? 'Guardar cambios' : 'Agregar usuario' }}</button>
        </div>
      </form>

      <div class="card table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th></th></tr></thead>
          <tbody>
            @for (u of items(); track u.id) {
              <tr>
                <td>{{ u.name }}</td>
                <td>{{ u.email }}</td>
                <td>{{ roles[u.role] }}</td>
                <td class="nowrap">
                  <button class="btn small ghost" (click)="edit(u)">Editar</button>
                  @if (u.id !== auth.user()?.id) {
                    <button class="btn small danger" (click)="remove(u)">Eliminar</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminUsers implements OnInit {
  private us = inject(UserService);
  auth = inject(AuthService);
  roles = ROLE_LABEL;
  items = signal<User[]>([]);
  m: Partial<User> = this.blank();
  error = '';

  private blank(): Partial<User> { return { name: '', email: '', password: '', role: 'client' }; }

  ngOnInit() { this.load(); }
  load() { this.us.list().subscribe(u => this.items.set(u)); }
  edit(u: User) { this.m = { ...u, password: '' }; this.error = ''; }
  reset() { this.m = this.blank(); this.error = ''; }

  save() {
    const req = this.m.id ? this.us.update(this.m.id, this.m) : this.us.create(this.m);
    req.subscribe({
      next: () => { this.reset(); this.load(); },
      error: e => (this.error = e.error?.message || 'No se pudo guardar el usuario.'),
    });
  }
  remove(u: User) {
    if (!confirm(`¿Eliminar a ${u.name}? También se borrarán sus reservas.`)) return;
    this.us.remove(u.id).subscribe({ next: () => this.load(), error: e => alert(e.error?.message) });
  }
}
