import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardUserComponent } from './pages/dashboard-user/dashboard-user.component';
import { DashboardProfesionalComponent } from './pages/dashboard-profesional/dashboard-profesional.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { DashboardSuperAdminComponent } from './pages/dashboard-super-admin/dashboard-super-admin.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/roles.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { 
        path: 'dashboard-user', 
        component: DashboardUserComponent, 
        canActivate: [AuthGuard, RoleGuard], data: { roles: ['user'] }
    },
    { 
        path: 'dashboard-profesional', 
        component: DashboardProfesionalComponent, 
        canActivate: [AuthGuard, RoleGuard], data: { roles: ['profesional'] }
    },
    { 
        path: 'dashboard-admin', 
        component: DashboardAdminComponent, 
        canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] }
    },
    { 
        path: 'dashboard-super-admin', 
        component: DashboardSuperAdminComponent, 
        canActivate: [AuthGuard, RoleGuard], data: { roles: ['is_super_admin'] }
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];