import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AgentPage } from './agent.page';

describe('AgentPage', () => {
  let component: AgentPage;
  let fixture: ComponentFixture<AgentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show reservations assigned to the current agent', () => {
    expect(component.reservations.length).toBeGreaterThan(0);
    expect(component.reservations.every((reservation) => reservation.agentId === component.user.id)).toBe(true);
  });
});
