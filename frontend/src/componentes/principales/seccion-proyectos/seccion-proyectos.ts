import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalCrearProyecto } from '../../modales/modal-crear-proyecto/modal-crear-proyecto';
import { ModalConfiguracionProyecto } from '../../modales/modal-configuracion-proyecto/modal-configuracion-proyecto';
import { ProyectoCard } from '../../cards/proyecto-card/proyecto-card';
import { DatosUsuario, Proyectos } from '../../../models/proceso.interface';
import { Api } from '../../../servicios/api';
import { ModalEliminar } from '../../modales/modal-eliminar/modal-eliminar';
import { ModalEditarProyecto } from '../../modales/modal-editar-proyecto/modal-editar-proyecto';
import { Usuario } from '../../../servicios/usuario';

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

    if (this.usuario() === null) return;

    this.api.obtenerProyectos(this.usuario()?.idusuario!).subscribe({
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
    console.log(JSON.stringify(this.proyectoSeleccionado));
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
    this.proyectos().map((proyecto, indice) => {
      if (proyecto.idproyecto === proyectoEditado.idproyecto) {
        this.proyectos()[indice] = proyectoEditado;
        return;
      }

      // Acá no supe muy bien que retornar
      console.log('No se encontró un proyecto con ese id');
      return;
    });
  }

  eliminarProyecto(proyectoEliminado: Proyectos) {
    // Si el proyecto a eliminar es undefined aún no se ha seleccionado ningún proyecto por lo que no hay nada que eliminar
    if (this.proyectoSeleccionado() === undefined) return;

    this.proyectos.update((proyectos) =>
      proyectos.filter((proyecto) => proyecto.idproyecto !== proyectoEliminado.idproyecto),
    );
  }
}
