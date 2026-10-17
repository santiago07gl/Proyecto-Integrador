import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationMockService } from '../../services/reservation-mock.service';
import { UserMockService } from '../../services/user-mock.service';

@Component({
  imports: [RouterLink],
  selector: 'app-agent-reservations-page',
  styleUrl: './agent-reservations.page.scss',
  templateUrl: './agent-reservations.page.html',
})
export class AgentReservationsPage {
  private readonly users = inject(UserMockService);
  private readonly reservationService = inject(ReservationMockService);

  readonly user = this.users.getAgent();
  readonly reservations = this.reservationService.getAgentReservations(this.user.id);
  readonly pendingCount = this.reservations.filter((reservation) => reservation.status === 'pending').length;

  formatCop(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  statusLabel(status: string): string {
    return status === 'confirmed' ? 'Confirmada' : status === 'pending' ? 'Pendiente' : 'Cancelada';
  }
}