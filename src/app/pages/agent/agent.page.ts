import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationMockService } from '../../services/reservation-mock.service';
import { UserMockService } from '../../services/user-mock.service';

@Component({
  imports: [RouterLink],
  selector: 'app-agent-page',
  styleUrl: './agent.page.scss',
  templateUrl: './agent.page.html',
})
export class AgentPage {
  private readonly users = inject(UserMockService);
  private readonly reservationService = inject(ReservationMockService);

  readonly user = this.users.getAgent();
  readonly reservations = this.reservationService.getAgentReservations(this.user.id);
  readonly upcomingReservations = this.reservations.slice(0, 4);
  readonly pendingCount = this.reservations.filter((reservation) => reservation.status === 'pending').length;
  readonly confirmedRevenue = this.reservations
    .filter((reservation) => reservation.status === 'confirmed')
    .reduce((total, reservation) => total + reservation.total, 0);

  formatCop(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  initials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('');
  }

  statusLabel(status: string): string {
    return status === 'confirmed' ? 'Confirmada' : status === 'pending' ? 'Pendiente' : 'Cancelada';
  }
}
