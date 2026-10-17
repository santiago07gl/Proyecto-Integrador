import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventMockService } from '../../services/event-mock.service';
import { ReservationMockService } from '../../services/reservation-mock.service';
import { UserMockService } from '../../services/user-mock.service';

@Component({
  imports: [RouterLink],
  selector: 'app-client-page',
  styleUrl: './client.page.scss',
  templateUrl: './client.page.html',
})
export class ClientPage {
  private readonly users = inject(UserMockService);
  private readonly eventService = inject(EventMockService);
  private readonly reservationService = inject(ReservationMockService);

  readonly user = this.users.getClient();
  readonly events = this.eventService.getClientEvents();
  readonly reservations = this.reservationService.getClientReservations(this.user.id);
  readonly categories = ['Todos', 'Fútbol', 'Pádel', 'Básquet', 'Al aire libre'];
  selectedCategory = 'Todos';

  get filteredEvents() {
    if (this.selectedCategory === 'Todos') return this.events;
    return this.events.filter((event) => event.category.startsWith(this.selectedCategory));
  }

  formatCop(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
