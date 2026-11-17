import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City, Country, Department, EventItem, Report, Reservation, Service, Stats, Status, User } from './models';

export const API = '/api';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  list() { return this.http.get<Service[]>(`${API}/services`); }
  get(id: number) { return this.http.get<Service>(`${API}/services/${id}`); }
  create(s: Partial<Service>) { return this.http.post<Service>(`${API}/services`, s); }
  update(id: number, s: Partial<Service>) { return this.http.put<Service>(`${API}/services/${id}`, s); }
  remove(id: number) { return this.http.delete<void>(`${API}/services/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  list() { return this.http.get<Reservation[]>(`${API}/reservations`); }
  get(id: number) { return this.http.get<Reservation>(`${API}/reservations/${id}`); }
  create(r: object) { return this.http.post<Reservation>(`${API}/reservations`, r); }
  update(id: number, r: object) { return this.http.put<Reservation>(`${API}/reservations/${id}`, r); }
  setStatus(id: number, status: Status, agent_id?: number | null) {
    return this.http.patch<Reservation>(`${API}/reservations/${id}/status`, { status, agent_id });
  }
  remove(id: number) { return this.http.delete<void>(`${API}/reservations/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  list() { return this.http.get<User[]>(`${API}/users`); }
  get(id: number) { return this.http.get<User>(`${API}/users/${id}`); }
  create(u: Partial<User>) { return this.http.post<User>(`${API}/users`, u); }
  update(id: number, u: Partial<User>) { return this.http.put<User>(`${API}/users/${id}`, u); }
  remove(id: number) { return this.http.delete<void>(`${API}/users/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);
  get() { return this.http.get<Stats>(`${API}/stats`); }
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  private http = inject(HttpClient);
  list() { return this.http.get<Country[]>(`${API}/countries`); }
  get(id: number) { return this.http.get<Country>(`${API}/countries/${id}`); }
  create(c: Partial<Country>) { return this.http.post<Country>(`${API}/countries`, c); }
  update(id: number, c: Partial<Country>) { return this.http.put<Country>(`${API}/countries/${id}`, c); }
  remove(id: number) { return this.http.delete<void>(`${API}/countries/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  list() { return this.http.get<Department[]>(`${API}/departments`); }
  get(id: number) { return this.http.get<Department>(`${API}/departments/${id}`); }
  create(d: Partial<Department>) { return this.http.post<Department>(`${API}/departments`, d); }
  update(id: number, d: Partial<Department>) { return this.http.put<Department>(`${API}/departments/${id}`, d); }
  remove(id: number) { return this.http.delete<void>(`${API}/departments/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class CityService {
  private http = inject(HttpClient);
  list() { return this.http.get<City[]>(`${API}/cities`); }
  get(id: number) { return this.http.get<City>(`${API}/cities/${id}`); }
  create(c: Partial<City>) { return this.http.post<City>(`${API}/cities`, c); }
  update(id: number, c: Partial<City>) { return this.http.put<City>(`${API}/cities/${id}`, c); }
  remove(id: number) { return this.http.delete<void>(`${API}/cities/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  list() { return this.http.get<EventItem[]>(`${API}/events`); }
  get(id: number) { return this.http.get<EventItem>(`${API}/events/${id}`); }
  create(e: object) { return this.http.post<EventItem>(`${API}/events`, e); }
  update(id: number, e: object) { return this.http.put<EventItem>(`${API}/events/${id}`, e); }
  remove(id: number) { return this.http.delete<void>(`${API}/events/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  list() { return this.http.get<Report[]>(`${API}/reports`); }
  get(id: number) { return this.http.get<Report>(`${API}/reports/${id}`); }
  create(r: object) { return this.http.post<Report>(`${API}/reports`, r); }
  update(id: number, r: object) { return this.http.put<Report>(`${API}/reports/${id}`, r); }
  remove(id: number) { return this.http.delete<void>(`${API}/reports/${id}`); }
}
