import { Component } from '@angular/core';
import { ModalCrearProyecto } from '../../modales/modal-crear-proyecto/modal-crear-proyecto';
import { ModalConfiguracionProyecto } from '../../modales/modal-configuracion-proyecto/modal-configuracion-proyecto';

@Component({
  selector: 'seccion-proyectos',
  imports: [ModalCrearProyecto, ModalConfiguracionProyecto],
  templateUrl: './seccion-proyectos.html',
  styleUrl: './seccion-proyectos.css',
})
export class SeccionProyectos {
  proyectos = [];
  esCrearProyectoModalVisible: boolean = false;
  esConfigurarProyectoModalVisible: boolean = false;

  mostrarModalCrearProyecto() {
    this.esCrearProyectoModalVisible = true;
  }

  mostrarModalConfigurarProyecto() {
    this.esConfigurarProyectoModalVisible = true;
  }

  cerrarModalCrearProyecto() {
    this.esCrearProyectoModalVisible = false;
  }

  cerrarModalConfigurarProyecto() {
    this.esConfigurarProyectoModalVisible = false;
  }
}
