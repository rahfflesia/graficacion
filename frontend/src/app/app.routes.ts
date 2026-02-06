import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';

export const routes: Routes = [{ path: 'login', component: Login},
  { path: 'registro', component: Registro },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
