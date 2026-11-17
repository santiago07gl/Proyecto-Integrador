import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <form class="card auth" (ngSubmit)="submit()">
        <a class="brand big" routerLink="/">Kroni</a>
        <h2>Ingresar</h2>
        <label>Correo
          <input type="email" name="email" [(ngModel)]="email" required autocomplete="email">
        </label>
        <label>Contraseña
          <input type="password" name="password" [(ngModel)]="password" required autocomplete="current-password">
        </label>
        @if (error) { <p class="error">{{ error }}</p> }
        <button class="btn block" type="submit" [disabled]="loading">Ingresar</button>
        <p class="muted center">¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>
        <div class="demo">
          <p class="muted">Cuentas de prueba (toca para rellenar):</p>
          <button type="button" class="chip" (click)="fill('client@kroni.com','client123')">Cliente</button>
          <button type="button" class="chip" (click)="fill('agent@kroni.com','agent123')">Agente</button>
          <button type="button" class="chip" (click)="fill('admin@kroni.com','admin123')">Admin</button>
        </div>
      </form>
    </div>
  `,
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = ''; password = ''; error = ''; loading = false;

  fill(e: string, p: string) { this.email = e; this.password = p; }

  submit() {
    this.error = ''; this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: r => this.router.navigate([this.auth.homeFor(r.user.role)]),
      error: e => { this.loading = false; this.error = e.error?.message || 'No se pudo iniciar sesión.'; },
    });
  }
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <form class="card auth" (ngSubmit)="submit()">
        <a class="brand big" routerLink="/">Kroni</a>
        <h2>Crear cuenta</h2>
        <label>Nombre
          <input name="name" [(ngModel)]="name" required>
        </label>
        <label>Correo
          <input type="email" name="email" [(ngModel)]="email" required>
        </label>
        <label>Contraseña (mínimo 6 caracteres)
          <input type="password" name="password" [(ngModel)]="password" minlength="6" required>
        </label>
        @if (error) { <p class="error">{{ error }}</p> }
        <button class="btn block" type="submit" [disabled]="loading">Crear cuenta</button>
        <p class="muted center">¿Ya tienes cuenta? <a routerLink="/login">Ingresa</a></p>
      </form>
    </div>
  `,
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  name = ''; email = ''; password = ''; error = ''; loading = false;

  submit() {
    this.error = ''; this.loading = true;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: r => this.router.navigate([this.auth.homeFor(r.user.role)]),
      error: e => { this.loading = false; this.error = e.error?.message || 'No se pudo crear la cuenta.'; },
    });
  }
}
