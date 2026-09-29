import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { AgentPage } from './pages/agent/agent.page';
import { AdminPage } from './pages/admin/admin.page';
import { RegisterPage } from './pages/register/register.page';

export const routes: Routes = [
    {
        path: "login",
        component:LoginPage
    },
    {
        path: "agent",
        component: AgentPage
    },
    {
        path: "admin",
        component: AdminPage
    },
    {
        path: "register",
        component:  RegisterPage
    },
];
