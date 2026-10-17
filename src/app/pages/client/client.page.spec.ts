import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClientPage } from './client.page';

describe('ClientPage', () => {
  let component: ClientPage;
  let fixture: ComponentFixture<ClientPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter available events by category', () => {
    component.selectCategory('Pádel');

    expect(component.filteredEvents.length).toBeGreaterThan(0);
    expect(component.filteredEvents.every((event) => event.category.startsWith('Pádel'))).toBe(true);
  });
});
