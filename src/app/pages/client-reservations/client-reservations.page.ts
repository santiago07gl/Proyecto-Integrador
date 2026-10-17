import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationMockService } from '../../services/reservation-mock.service';
import { UserMockService } from '../../services/user-mock.service';

@Component({
  imports: [RouterLink],
  selector: 'app-client-reservations-page',
  styleUrl: './client-reservations.page.scss',
  templateUrl: './client-reservations.page.html',
})
export class ClientReservationsPage {
  private readonly users = inject(UserMockService);
  private readonly reservationService = inject(ReservationMockService);

  readonly user = this.users.getClient();
  readonly reservations = this.reservationService.getClientReservations(this.user.id);
  readonly confirmedCount = this.reservations.filter((reservation) => reservation.status === 'confirmed').length;
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