import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/">Kroni</a>
      <nav></nav>
      <div class="user">
        @if (auth.user(); as u) {
          <a class="btn small" [routerLink]="auth.homeFor(u.role)">Ir a mi cuenta</a>
        } @else {
          <a class="btn small ghost" routerLink="/login">Ingresar</a>
          <a class="btn small" routerLink="/register">Crear cuenta</a>
        }
      </div>
    </header>
    <section class="hero">
      <div class="hero-text">
        <h1>Reserva tu lugar en pocos pasos</h1>
        <p>Mesas, salas, canchas y más. Elige el servicio, escoge el día y la hora, y nuestro equipo confirma tu reserva.</p>
        <div class="actions left">
          <a class="btn" routerLink="/register">Empezar ahora</a>
          <a class="btn ghost" routerLink="/login">Ya tengo cuenta</a>
        </div>
      </div>
      <div class="hero-panel card">
        <h3>Tu próxima reserva</h3>
        <ul class="steps">
          <li><b>1.</b> Elige el servicio</li>
          <li><b>2.</b> Selecciona fecha y hora</li>
          <li><b>3.</b> Un agente la confirma</li>
        </ul>
      </div>
    </section>
    <section class="container features">
      <div class="card"><h3>Para clientes</h3><p>Crea, edita y cancela tus reservas cuando quieras.</p></div>
      <div class="card"><h3>Para agentes</h3><p>Atiende y confirma las reservas que van llegando.</p></div>
      <div class="card"><h3>Para administradores</h3><p>Gestiona servicios, usuarios y revisa el resumen del negocio.</p></div>
    </section>
    <footer class="footer">Kroni · Sistema de reservas</footer>
  `,
})
export class HomePage {
  auth = inject(AuthService);
}
