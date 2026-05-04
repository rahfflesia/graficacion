import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { SeccionProyectos } from '../componentes/principales/seccion-proyectos/seccion-proyectos';
import { MainLayout } from '../componentes/layouts/main-layout/main-layout';
import { ProcesosPrincipales } from '../componentes/principales/procesos-principales/procesos-principales';
import { Subprocesos } from '../componentes/principales/subprocesos/subprocesos';
import { Tecnicas } from '../componentes/principales/tecnicas/tecnicas';
import { Home } from '../componentes/principales/home/home';
import { Roles } from '../componentes/principales/roles/roles';
import { Stakeholders } from '../componentes/principales/stakeholders/stakeholders';
import { SeccionObservaciones } from '../componentes/secciones-tecnicas-recoleccion/seccion-observaciones/seccion-observaciones';
import { authGuard } from '../guards/auth-guard';
import { SeccionCuestionarios } from '../componentes/secciones-tecnicas-recoleccion/seccion-cuestionarios/seccion-cuestionarios';
import { SeccionHistoriasUsuario } from '../componentes/secciones-tecnicas-recoleccion/seccion-historias-usuario/seccion-historias-usuario';
import { SeccionEntrevistas } from '../componentes/secciones-tecnicas-recoleccion/seccion-entrevistas/seccion-entrevistas';
import { SeccionFocusGroup } from '../componentes/secciones-tecnicas-recoleccion/seccion-focus-group/seccion-focus-group';
import { SeccionAnalisisDocumento } from '../componentes/secciones-tecnicas-recoleccion/seccion-analisis-documento/seccion-analisis-documento';
import { CanvasDiagramaClase } from '../componentes/diagramas/diagramas-clase/canvas-diagrama-clase/canvas-diagrama-clase';

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
      { path: 'roles', component: Roles },
      { path: 'stakeholders', component: Stakeholders },
      { path: 'observaciones', component: SeccionObservaciones },
      { path: 'cuestionarios', component: SeccionCuestionarios },
      { path: 'historiasusuario', component: SeccionHistoriasUsuario },
      { path: 'entrevistas', component: SeccionEntrevistas },
      { path: 'focus-group', component: SeccionFocusGroup },
      { path: 'analisis-documento', component: SeccionAnalisisDocumento },
    ],
  },

  { path: 'crear-diagrama-clase/:idproyecto', component: CanvasDiagramaClase },
];
