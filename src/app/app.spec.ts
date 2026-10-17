import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminPage } from './pages/admin/admin.page';
import { AgentPage } from './pages/agent/agent.page';
import { ClientPage } from './pages/client/client.page';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the route outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should route each profile path to its page component', () => {
    const pageByPath = new Map(
      routes
        .filter((route) => route.component)
        .map((route) => [route.path, route.component]),
    );

    expect(pageByPath.get('client')).toBe(ClientPage);
    expect(pageByPath.get('login')).toBe(LoginPage);
    expect(pageByPath.get('register')).toBe(RegisterPage);
    expect(pageByPath.get('agent')).toBe(AgentPage);
    expect(pageByPath.get('admin')).toBe(AdminPage);
  });
});
