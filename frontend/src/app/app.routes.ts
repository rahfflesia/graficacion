import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { SeccionProyectos } from '../componentes/principales/seccion-proyectos/seccion-proyectos';
import { MainLayout } from '../componentes/layouts/main-layout/main-layout';
import { ProcesosPrincipales } from '../componentes/principales/procesos-principales/procesos-principales';
import { Subprocesos } from '../componentes/principales/subprocesos/subprocesos';
import { Tecnicas } from '../componentes/principales/tecnicas/tecnicas';
import { Home } from '../componentes/principales/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'proyectos', component: SeccionProyectos },
      { path: 'procesos', component: ProcesosPrincipales },
      { path: 'subprocesos', component: Subprocesos },
      { path: 'tecnicas', component: Tecnicas },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
