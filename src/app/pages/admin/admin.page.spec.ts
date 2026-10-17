import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminPage } from './admin.page';

describe('AdminPage', () => {
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load report metrics and monthly activity from mocks', () => {
    expect(component.report.registeredUsers).toBeGreaterThan(0);
    expect(component.report.monthlyActivity.length).toBeGreaterThan(0);
    expect(component.recentReservations.length).toBeGreaterThan(0);
  });
});
