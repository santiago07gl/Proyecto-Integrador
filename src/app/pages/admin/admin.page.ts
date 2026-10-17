import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminReportMockService } from '../../services/admin-report-mock.service';
import { ReservationMockService } from '../../services/reservation-mock.service';
import { UserMockService } from '../../services/user-mock.service';

@Component({
  imports: [RouterLink],
  selector: 'app-admin-page',
  styleUrl: './admin.page.scss',
  templateUrl: './admin.page.html',
})
export class AdminPage {
  private readonly reportService = inject(AdminReportMockService);
  private readonly reservationService = inject(ReservationMockService);
  private readonly users = inject(UserMockService);

  readonly report = this.reportService.getReport();
  readonly user = this.users.getAdmin();
  readonly recentReservations = this.reservationService.getAllReservations().slice(0, 4);
  readonly maxMonthlyReservations = Math.max(...this.report.monthlyActivity.map((month) => month.reservations));

  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-CO').format(value);
  }

  formatCop(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }

  barHeight(reservations: number): number {
    return Math.round((reservations / this.maxMonthlyReservations) * 100);
  }

  statusLabel(status: string): string {
    return status === 'confirmed' ? 'Confirmada' : status === 'pending' ? 'Pendiente' : 'Cancelada';
  }
}
