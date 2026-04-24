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

@Component({
  selector: 'seccion-proyectos',
  imports: [
    ModalCrearProyecto,
    ModalConfiguracionProyecto,
    ProyectoCard,
    ModalEliminar,
    ModalEditarProyecto,
  ],
  templateUrl: './seccion-proyectos.html',
  styleUrl: './seccion-proyectos.css',
})
export class SeccionProyectos implements OnInit {
  private api = inject(Api);
  private ServicioUsuario = inject(Usuario);

  private router = inject(Router);

  proyectos = signal<Proyectos[]>([]);
  esCrearProyectoModalVisible: boolean = false;
  esConfigurarProyectoModalVisible: boolean = false;
  esEliminarProyectoModalVisible: boolean = false;
  esEditarProyectoModalVisible = signal<boolean>(false);
  estaCargando = signal<boolean>(true);
  proyectoSeleccionado = signal<Proyectos | undefined>(undefined);
  usuario = signal<DatosUsuario | null>(null);

  ngOnInit(): void {
    this.usuario.set(this.ServicioUsuario.obtenerUsuario());

    const idusuario = localStorage.getItem('idusuario');

    if (!idusuario) {
      console.error('No se encontró idusuario en localStorage');
      this.estaCargando.set(false);
      return;
    }

    this.api.obtenerProyectos(Number(idusuario)).subscribe({
      next: (proyectos: Proyectos[]) => {
        this.proyectos.set(proyectos);
        this.estaCargando.set(false);
      },
      error: (error) => {
        alert(JSON.stringify(error));
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

  irMenuDiagramas() {
    this.router.navigateByUrl('/menudiagramas');
  }
}
