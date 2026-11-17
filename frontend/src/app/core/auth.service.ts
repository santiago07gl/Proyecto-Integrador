import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API } from './api';
import { Role, User } from './models';

interface AuthResponse { token: string; user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  user = signal<User | null>(this.read());

  private read(): User | null {
    try { return JSON.parse(localStorage.getItem('kroni_user') || 'null'); } catch { return null; }
  }
  private save(r: AuthResponse) {
    localStorage.setItem('kroni_token', r.token);
    localStorage.setItem('kroni_user', JSON.stringify(r.user));
    this.user.set(r.user);
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${API}/auth/login`, { email, password }).pipe(tap(r => this.save(r)));
  }
  register(name: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${API}/auth/register`, { name, email, password }).pipe(tap(r => this.save(r)));
  }
  logout() {
    localStorage.removeItem('kroni_token');
    localStorage.removeItem('kroni_user');
    this.user.set(null);
    this.router.navigate(['/login']);
  }
  homeFor(role: Role) { return role === 'admin' ? '/admin' : role === 'agent' ? '/agent' : '/client'; }
}
