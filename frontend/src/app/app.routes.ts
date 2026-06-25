import { Routes } from '@angular/router';
import { RecursosComponent } from './pages/recursos/recursos';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ReservasComponent } from './pages/reservas/reservas';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'recursos',
    component: RecursosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reservas',
    component: ReservasComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
