import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AgentReservationsPage } from './agent-reservations.page';

describe('AgentReservationsPage', () => {
  let component: AgentReservationsPage;
  let fixture: ComponentFixture<AgentReservationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentReservationsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentReservationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should list reservations assigned to the current agent', () => {
    expect(component.reservations.length).toBeGreaterThan(0);
    expect(component.reservations.every((reservation) => reservation.agentId === component.user.id)).toBe(true);
  });
});