import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalCrearProyecto } from '../../modales/modal-crear-proyecto/modal-crear-proyecto';
import { ModalConfiguracionProyecto } from '../../modales/modal-configuracion-proyecto/modal-configuracion-proyecto';
import { ProyectoCard } from '../../cards/proyecto-card/proyecto-card';
import { DatosUsuario, Proyectos } from '../../../models/proceso.interface';
import { Api } from '../../../servicios/api';
import { ModalEliminar } from '../../modales/modal-eliminar/modal-eliminar';
import { ModalEditarProyecto } from '../../modales/modal-editar-proyecto/modal-editar-proyecto';
import { Usuario } from '../../../servicios/usuario';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalCrearDiagrama } from '../../modales/modal-crear-diagrama/modal-crear-diagrama';

@Component({
  selector: 'seccion-proyectos',
  imports: [
    ModalCrearProyecto,
    ModalConfiguracionProyecto,
    ProyectoCard,
    ModalEliminar,
    ModalEditarProyecto,
    ModalCrearDiagrama,
  ],
  templateUrl: './seccion-proyectos.html',
  styleUrl: './seccion-proyectos.css',
})
export class SeccionProyectos implements OnInit {
  private api = inject(Api);
  private ServicioUsuario = inject(Usuario);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  proyectos = signal<Proyectos[]>([]);
  esCrearProyectoModalVisible: boolean = false;
  esConfigurarProyectoModalVisible: boolean = false;
  esEliminarProyectoModalVisible: boolean = false;
  esEditarProyectoModalVisible = signal<boolean>(false);
  esModalCrearDiagramaVisible = false;
  estaCargando = signal<boolean>(true);
  proyectoSeleccionado = signal<Proyectos | undefined>(undefined);
  usuario = signal<DatosUsuario | null>(null);

  ngOnInit(): void {
    this.usuario.set(this.ServicioUsuario.obtenerUsuario());
    const idUsuario = this.usuario()?.usuario.idusuario;

    if (idUsuario) {
      this.obtenerProyectos(idUsuario);
      return;
    }

    this.api.obtenerSesionActual().subscribe({
      next: (datosUsuario) => {
        this.ServicioUsuario.guardarUsuario(datosUsuario);
        this.usuario.set(datosUsuario);
        this.obtenerProyectos(datosUsuario.usuario.idusuario);
      },
      error: (error) => {
        console.error(error);
        this.ServicioUsuario.borrarUsuario();
        this.estaCargando.set(false);
        this.router.navigate(['/login']);
      },
    });
  }

  obtenerProyectos(idUsuario: number) {
    this.api.obtenerProyectos(idUsuario).subscribe({
      next: (proyectos: Proyectos[]) => {
        this.proyectos.set(proyectos.filter((proyecto) => proyecto.idproyecto));
        this.estaCargando.set(false);
      },
      error: (error) => {
        this.toastr.error('Ha ocurrido un error al obtener los proyectos', '', {
          toastClass: 'toastr-error',
        });
        console.error(error);
        this.estaCargando.set(false);
      },
    });
  }

  limpiarProyectoSeleccionado() {
    this.proyectoSeleccionado.set(undefined);
  }

  mostrarModalCrearProyecto() {
    this.esCrearProyectoModalVisible = true;
  }

  mostrarModalConfigurarProyecto() {
    this.esConfigurarProyectoModalVisible = true;
  }

  mostrarModalEliminarProyecto() {
    this.esEliminarProyectoModalVisible = true;
  }

  mostrarModalEditarProyecto() {
    this.esEditarProyectoModalVisible.set(true);
    console.log(JSON.stringify(this.proyectoSeleccionado()));
  }

  cerrarModalCrearProyecto() {
    this.esCrearProyectoModalVisible = false;
  }

  cerrarModalConfigurarProyecto() {
    this.esConfigurarProyectoModalVisible = false;
  }

  cerrarModalEliminarProyecto() {
    this.esEliminarProyectoModalVisible = false;
    this.limpiarProyectoSeleccionado();
  }

  cerrarModalEditarProyecto() {
    this.esEditarProyectoModalVisible.set(false);
    this.limpiarProyectoSeleccionado();
  }

  mostrarModalMenuDiagramas() {
    this.esModalCrearDiagramaVisible = true;
  }

  cerrarModalMenuDiagramas() {
    this.esModalCrearDiagramaVisible = false;
  }

  crearNuevoProyecto(nuevoProyecto: Proyectos) {
    this.proyectos.update((proyectos) => [nuevoProyecto, ...proyectos]);
  }

  seleccionarProyecto(proyecto: Proyectos) {
    this.proyectoSeleccionado.set(proyecto);
  }

  editarProyecto(proyectoEditado: Proyectos) {
    this.proyectos.update((proyectos) =>
      proyectos.map((proyecto) =>
        proyecto.idproyecto === proyectoEditado.idproyecto ? proyectoEditado : proyecto,
      ),
    );
  }

  eliminarProyecto(proyectoEliminado: Proyectos) {
    if (this.proyectoSeleccionado() === undefined) return;

    this.proyectos.update((proyectos) =>
      proyectos.filter((proyecto) => proyecto.idproyecto !== proyectoEliminado.idproyecto),
    );
  }

  irSeccionDiagramas(tipoDiagramaSeleccionado: 'clase' | 'paquetes' | 'casos_uso' | 'secuencia') {
    const idProyecto = this.proyectoSeleccionado()?.idproyecto;

    if (!idProyecto) {
      console.error('El id del proyecto no está definido');
      return;
    }

    switch (tipoDiagramaSeleccionado) {
      case 'clase':
        this.router.navigate(['/crear-diagrama-clase', idProyecto]);
        break;
      case 'paquetes':
        break;
      case 'casos_uso':
        break;
      case 'secuencia':
        break;
      default:
        console.error('Tipo de diagrama inválido');
    }
  }
}
