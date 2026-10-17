import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AgentEventsPage } from './agent-events.page';

describe('AgentEventsPage', () => {
  let component: AgentEventsPage;
  let fixture: ComponentFixture<AgentEventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentEventsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentEventsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should load events owned by the current agent', () => {
    expect(component.events.length).toBeGreaterThan(0);
    expect(component.events.every((event) => event.ownerId === component.user.id)).toBe(true);
  });
});