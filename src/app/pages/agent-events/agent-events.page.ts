import { Component, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventMockService } from '../../services/event-mock.service';
import { UserMockService } from '../../services/user-mock.service';

@Component({
  imports: [RouterLink, UpperCasePipe],
  selector: 'app-agent-events-page',
  styleUrl: './agent-events.page.scss',
  templateUrl: './agent-events.page.html',
})
export class AgentEventsPage {
  private readonly users = inject(UserMockService);
  private readonly eventService = inject(EventMockService);

  readonly user = this.users.getAgent();
  readonly events = this.eventService.getAgentEvents(this.user.id);

  formatCop(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }
}