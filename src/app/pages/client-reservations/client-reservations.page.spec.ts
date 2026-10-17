import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClientReservationsPage } from './client-reservations.page';

describe('ClientReservationsPage', () => {
  let component: ClientReservationsPage;
  let fixture: ComponentFixture<ClientReservationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientReservationsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientReservationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should show the client mock reservations', () => {
    expect(component.reservations.length).toBeGreaterThan(0);
    expect(component.reservations.every((reservation) => reservation.clientId === component.user.id)).toBe(true);
  });
});