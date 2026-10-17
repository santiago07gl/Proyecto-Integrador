import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { AgentPage } from './pages/agent/agent.page';
import { AdminPage } from './pages/admin/admin.page';
import { RegisterPage } from './pages/register/register.page';
import { ClientPage } from './pages/client/client.page';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "client",
        pathMatch: "full"
    },
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
    {
        path: "client",
        component: ClientPage
    },
    {
        path: "**",
        redirectTo: "client"
    }
];
